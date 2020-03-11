import Cookies from 'js-cookie'
import { getLanguage } from '@/lang/index'

const app = {
  state: {
    language: getLanguage()
  },
  mutations: {
    SET_LANGUAGE: (state, language) => {
      state.language = language
      Cookies.set('language', language)
    }
  },
  actions: {
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    }
  }
}

export default app
