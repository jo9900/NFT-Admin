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
export const currentLocale = localStorage.getItem('locale') || 'en'
export const mallCode = JSON.parse(localStorage.getItem('uInfo'))?.mallCode || 'firstMall'
export const mallName = JSON.parse(localStorage.getItem('uInfo'))?.mallName || ''
export const mallWalletAddress = '111'
