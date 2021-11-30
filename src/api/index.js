import { get, post } from '../axios/admin'
import { mallCode } from "../config";


const base = process.NODE_ENV ==='production'? 'mgt-nft' : 'management-nft'
const _mallCode = base + '/' + mallCode
export const userLogin = (params = {}) => {
  return post(base + '/adminUserWallet/login', params)
}

export const getGoodsList = (params = {}) => {
  return post(_mallCode + '/goods/all/Page', params)
}

export const getGoodsDetail = (params = {}, id) => {
  return get(_mallCode + '/goods/detail/' + id, params)
}

export const getOrders = (params = {}) => {
  return post(base + '/orders/listPage', params)
}

// 服务费信息-根据当前登录人查询
export const getFee = (params = {}) => {
  return get(base + '/mallInfo/current/getInfo', params)
}
export const updateFee = (params = {}) => {
  return post(base + '/mallInfo/update', params)
}

export const getBannerList = (params = {}) => {
  return post(_mallCode + '/focusMap/listPage', params)
}

export const triggerBannerState = (params = {}, id) => {
  return post(_mallCode + '/focusMap/state/' + id, params)
}

export const addBanner = (params = {}) => {
  return post(_mallCode + '/focusMap/add', params)
}

export const updateBanner = (params ={}, id) => {
  return post(_mallCode + '/focusMap/updateById' + id, params)
}
export const getBannerData = (params ={}, id) => {
  return get(_mallCode + '/focusMap/getById/' + id, params)
}
