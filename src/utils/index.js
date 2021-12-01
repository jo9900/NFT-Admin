import Web3 from 'web3'
import {
  abi_Fee,
  VUE_APP_RFC,
  VUE_APP_MCA,
  abi_SetBeneficiary,
  abi_AboutFee,
} from '../config'

export const maskingAddress = (account, prefix = 6, suffix = 4) => {
  if (typeof account === 'string') {
    if (account.length <= 10) return account
    let str = ''
    str = account.substring(0, prefix)
    str = str + '...'
    str = str + account.substring(account.length - suffix)
    return str
  }
  return ''
}

export const checkProvider = () => {
  if (typeof window.web3 !== 'undefined') {
    window.web3 = new Web3(window.web3.currentProvider)
  } else {
    window.web3 = new Web3(new Web3.providers.HttpProvider(VUE_APP_RFC))
  }
}

export const setFeeAndAddress = async (newFee = null, newAddress = null) => {
  await checkProvider()
  const Contract = new window.web3.eth.Contract(abi_AboutFee, VUE_APP_MCA)
  const currentAddress = localStorage.getItem('account')

  console.log('newFee', newFee)
  console.log('newAddress', newAddress)
  console.log('currentAddress', currentAddress)
  const setFee = () => {
    return new Promise((resolve, reject) => {
      Contract.methods
        .setFee(newFee)
        .send({
          from: currentAddress,
        })
        .then(resolve)
        .catch(reject)
    })
  }
  const setAddress = () => {
    return new Promise((resolve, reject) => {
      Contract.methods
        .setBeneficiary(newAddress)
        .send({
          from: currentAddress,
        })
        .then(resolve)
        .catch(reject)
    })
  }
  let paramsArr = []
  newFee && paramsArr.push(setFee())
  newAddress && paramsArr.push(setAddress())
  return new Promise((resolve) => {
    Promise.allSettled(paramsArr).then((res) => {
      resolve(res)
    })
  })
}
