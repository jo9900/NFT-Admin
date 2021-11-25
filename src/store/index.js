import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import web3ModalStore from './modules/web3Modal.js'
import { userLogin } from '../api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    msgConfig: {
      isShow: false,
      msg: '',
      type: 'common',
    },
    uInfo: {},
  },
  modules: {
    web3Modal: web3ModalStore,
  },
  mutations: {
    initMsgConfig(state) {
      state.msgConfig = {
        isShow: false,
        msg: '',
        type: 'common',
      }
    },
  },
  getters: {
    uInfo: () => {
      let uInfo = localStorage.getItem('uInfo')
      return uInfo ? JSON.parse(uInfo) : undefined
    },
    getToken: () => {
      return localStorage.getItem('uAuthorization') || ''
    },
    getAccount: () => {
      return localStorage.getItem('account') || ''
    },
  },
  actions: {
    Message({ commit, state }, obj) {
      state.msgConfig = obj
      const timer = setTimeout(() => {
        commit('initMsgConfig')
        clearTimeout(timer)
      }, 5 * 1000)
    },
    logout({ dispatch }) {
      router.push('/login')
      localStorage.removeItem('uAuthorization')
      localStorage.removeItem('uInfo')
      dispatch('resetApp')
    },
    async login({ state }) {
      const { account } = state.web3Modal
      await userLogin({ walletAddress: account }).then((res) => {
        localStorage.setItem('uInfo', JSON.stringify(res.data))
        localStorage.setItem('uAuthorization', res.data.token)
      })
    },
  },
})
