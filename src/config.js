export const scanHref = process.env.VUE_APP_TEST_SCAN
export const unit = 'USDT'
export const validatedMediaExt = {
  img: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
  video: ['mp4', 'webm'],
  sound: ['mp3', 'wav'],
}
export const currentLocale = localStorage.getItem('locale') || 'en'
export const VUE_APP_RFC = process.env.VUE_APP_RFC
export const VUE_APP_MCA = process.env.VUE_APP_MCA
export const VUE_APP_NCA = process.env.VUE_APP_NCA
export const VUE_APP_PAYTOKEN = process.env.VUE_APP_PAYTOKEN
export const mallCode = JSON.parse(localStorage.getItem('uInfo'))?.mallCode || 'firstMall'
export const mallName = JSON.parse(localStorage.getItem('uInfo'))?.mallName || ''
export const mallWalletAddress = '111'
