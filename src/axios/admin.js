import axios from 'axios'
import store from '@/store'
import errorCode from '@/locales/errorCode'
const locale = localStorage.getItem('locale') || 'en'
const errorText = errorCode[locale]

const formatError = (code) => {
  let res = ''
  try {
    res = errorText[code]
  } catch (e) {
    res = errorText.other
  }
  return res
}
const nftInstance = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 5000,
})
nftInstance.interceptors.request.use(
  (config) => {
    console.log( config );
    const token = store.getters.getToken
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
nftInstance.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 10000) {
      store.dispatch('Message', {
        isShow: true,
        msg: formatError(res.code),
        type: 'warning',
      })
      return Promise.reject(res)
    } else {
      return response.data
    }
  },
  (error) => {
    console.dir(error)
    if (error.response && error.response.status === 401) {
      store.dispatch('Message', {
        isShow: true,
        msg: formatError(401),
        type: 'warning',
      })
    } else if (error.message.includes('timeout')) {
      store.dispatch('Message', {
        isShow: true,
        msg: formatError('timeout'),
        type: 'warning',
      })
    } else {
      store.dispatch('Message', {
        isShow: true,
        msg: formatError('other'),
        type: 'warning',
      })
    }
    store.dispatch('logout')
    return Promise.reject(error)
  }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    nftInstance
      .get(url, {
        params: params,
      })
      .then((res) => {
        if (res.code !== 10000) {
          reject(res)
          return
        }
        resolve(res)
      })
      .catch((err) => {
        throw err
      })
  })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    nftInstance
      .post(url, params)
      .then((res) => {
        if (res.code !== 10000) {
          reject(res)
          return
        }
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
