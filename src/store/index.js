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
    snackbar: {
      isShow: false,
      msg: ''
    },
  },
  modules: {
    web3Modal: web3ModalStore,
  },
  mutations: {
    TOGGLE_SNACKBAR(state,{ msg='', bool = true }) {
      state.snackbar.isShow = bool
      state.snackbar.msg = msg
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
        router.push('/')
      })
    },
  },
})
