export const scanHref = process.env.VUE_APP_TEST_SCAN
export const unit = 'USDT'
export const validatedMediaExt = {
  img: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
  video: ['mp4', 'webm'],
  sound: ['mp3', 'wav'],
}
if (!localStorage.getItem('locale')) {
  if (navigator.language === 'zh' || navigator.language === 'zh-CN') {
    window.localStorage.setItem('locale', 'zh')
  } else {
    window.localStorage.setItem('locale', 'en')
  }
}
export const VUE_APP_RFC = process.env.VUE_APP_RFC
export const VUE_APP_MCA = process.env.VUE_APP_MCA
export const currentLocale = localStorage.getItem('locale') || 'en'
export const mallCode = JSON.parse(localStorage.getItem('uInfo'))?.mallCode || 'firstMall'
export const mallName = JSON.parse(localStorage.getItem('uInfo'))?.mallName || ''
export const abi_AboutFee = [ // 交易服务费和其地址
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "newBeneficiary",
        "type": "address"
      }
    ],
    "name": "setBeneficiary",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "newFee",
        "type": "uint256"
      }
    ],
    "name": "setFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
]
