// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import router from './router'
import store from './store'
import i18n from './lang' // Internationalization
import * as filters from './filters' // global filters

import Vant from 'vant'
import 'vant/lib/index.css'
import './permission' // permission control

import '@/styles/index.scss' // global css

import 'lib-flexible'

Vue.use(Vant, {
  i18n: (key, value) => i18n.t(key, value)
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

/* eslint-disable no-new */
const Vm = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})

export default Vm
