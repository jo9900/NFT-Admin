import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from './en.json'
import zh from './zh.json'
import { currentLocale } from '@/config'
Vue.use(VueI18n)

const messages = {
  en: {
    ...en,
  },
  zh: {
    ...zh,
  },
}
const i18n = new VueI18n({
  locale: currentLocale, // set locale
  legacy: true,
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
  // If you need to specify other options, you can set other options
  // ...
})
export default i18n
