import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'

import weiLocale from './wei'
import zhLocale from './zh'
import wei from 'vant/lib/locale/lang/wei'
import zhCN from 'vant/lib/locale/lang/zh-CN'

Vue.use(VueI18n)

const messages = {
  wei: {
    ...weiLocale,
    ...wei
  },
  zh: {
    ...zhLocale,
    ...zhCN
  }
}

export function getLanguage() {
  const chooseLanguage = Cookies.get('language')
  if (chooseLanguage) return chooseLanguage

  // if has not choose language
  const language = (navigator.language || navigator.browserLanguage).toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'zh'
}

const i18n = new VueI18n({
  locale: getLanguage(),
  messages
})

export default i18n
