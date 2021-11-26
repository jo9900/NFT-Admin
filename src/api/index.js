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
  return post(_mallCode + '/goods/detail/' + id, params)
}
