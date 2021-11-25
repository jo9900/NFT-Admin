import { get, post } from '../axios/admin'
const base = process.NODE_ENV ==='production'? 'mgt-nft' : 'management-nft'
const mallCode = base + '/' + localStorage.getItem('mallCode')
export const userLogin = (params = {}) => {
  return post(base + '/adminUserWallet/login', params)
}

export const getGoodsList = (params = {}) => {
  return post(mallCode + '/goods/all/Page', params)
}
