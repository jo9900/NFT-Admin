import { ethers } from 'ethers'
import { parseInt } from 'lodash'
import { VUE_APP_RFC } from '@/config'
import { BigNumber } from 'ethers'

import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
const VUE_APP_CHAIN_ID = process.env.VUE_APP_CHAIN_ID
const web3ModalStore = {
  state: {
    web3Modal: null,
    account: null,
    chainId: 0,
  },
  mutations: {
    setWeb3Modal(state, web3Modal) {
      state.web3Modal = web3Modal
    },
    setAccount(state, account) {
      state.account = account
      // state.account = account && account.toLowerCase()
      localStorage.setItem('account', account)
    },
    setChainId(state, chainId) {
      state.chainId = chainId
    },
  },
  actions: {
    async disconnect({ dispatch }) {
      await dispatch('resetApp')
      await dispatch('logout')
    },
    initConnect({ state, commit }) {
      const providerOptions = {
        walletconnect: {
          package: function () {
            return new WalletConnectProvider({
              rpc: {
                [VUE_APP_CHAIN_ID]: VUE_APP_RFC,
              },
              chainId: Number(VUE_APP_CHAIN_ID),
            })
          },
          options: {
            // 不能删除 否则不显示！
            infuraId: '-',
          },
        },
      }
      const web3Modal = new Web3Modal({
        network: 'mainnet', // optional
        cacheProvider: true, // optional
        theme: {
          background: 'rgb(39, 49, 56)',
          main: 'rgb(199, 199, 199)',
          secondary: 'rgb(136, 136, 136)',
          border: 'rgba(195, 195, 195, 0.14)',
          hover: 'rgb(16, 26, 32)',
        },
        providerOptions, // required
      })
      commit('setWeb3Modal', web3Modal)
    },
    async connect({ state, commit, dispatch }) {
      const provider = await state.web3Modal.connect()
      console.log('connect', provider)

      const ethersProvider = new ethers.providers.Web3Provider(provider)
      ethersProvider.pollingInterval = 12000

      const network = await ethersProvider.getNetwork()
      commit('setChainId', network.chainId)
      /**
       * 与 metaMask 的交互逻辑：
       * (a)开始连接时
       * -在此网络？
       *  Y: 去连接
       *  N：提醒用户去 switch
       *        Succeed: 去连接
       *        Failed: 失败的原因如果是无此网络（4902） 就可以提醒用户去 add
       *
       * (b)连接成功后切换了账号 登出
       * (c)连接后用户切换了网络 登出
       * -切换到了其他网络？
       *  Y：提醒用户切换回来
       *        Succeed: 去连接
       *        Failed: 失败的原因如果是无此网络（4902） 就可以提醒用户去 add
       *  N：去连接
       */
      const switchOrAddNet = async (currentId) => {
        if (parseInt(currentId) !== parseInt(VUE_APP_CHAIN_ID)) {
          // (a)
          let chainId = BigNumber.from(VUE_APP_CHAIN_ID).toHexString()
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: chainId }],
            })
          } catch (e) {
            if (e.code === 4902) {
              let method = 'wallet_addEthereumChain'
              let params = [
                {
                  chainId: chainId,
                  chainName: 'Binance Smart Chain Testnet',
                  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
                  nativeCurrency: {
                    name: 'tBNB',
                    symbol: 'tBNB',
                    decimals: 18,
                  },
                  blockExplorerUrls: ['https://testnet.bscscan.com'],
                },
              ]
              window.ethereum.request({ method, params }, (err, result) => {
                if (err) {
                  console.log('添加失败')
                  return false
                }
                console.log('result', result)
              })
            } else console.log('auto add failed:', e)
          }
        } else {
          const accounts = await ethersProvider.listAccounts()
          if (accounts.length > 0) {
            commit('setAccount', accounts[0])
          }
          dispatch('login')
        }
      }
      await switchOrAddNet(network.chainId)
      provider.on('connect', async (info) => {
        let chainId = parseInt(info.chainId)
        commit('setChainId', chainId)
      })

      provider.on('accountsChanged', async (accounts) => {
        // (b)
        console.log('accountsChanged', accounts[0])
        dispatch('disconnect')
      })
      provider.on('chainChanged', async (chainId) => {
        //(c)
        chainId = parseInt(chainId)
        if (chainId !== parseInt(VUE_APP_CHAIN_ID)) {
          await dispatch('disconnect')
          commit('setChainId', 0)
          return
        }
        await dispatch('initConnect')
        const accounts = await ethersProvider.listAccounts()
        if (accounts.length > 0) {
          commit('setAccount', accounts[0])
        }
        await dispatch('login')
        commit('setChainId', chainId)
      })
    },
    async resetApp({ state, commit }) {
      try {
        await state.web3Modal.clearCachedProvider()
      } catch (error) {
        console.error(error)
      }
      commit('setAccount', '')
    },
  },
}

export default web3ModalStore
