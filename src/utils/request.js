import axios from 'axios'
import { Dialog } from 'vant'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { Base64 } from '@/utils/validate'
import Vm from '../main'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      config.headers.Authorization = 'Bearer ' + getToken()
      config.headers.memberId = store.getters.memberId
      config.headers.platformId = store.getters.platformId
      config.headers.jobId = store.getters.jobId
      config.headers.categoryId = store.getters.categoryId
    } else {
      config.headers.Authorization = 'Basic ' + new Base64().encode('app' + ':' + '123456')
    }
    return config
  },
  error => {
    console.log('error=====>', error) // for debug
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  // response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   */
  response => {
    const res = response.data
    // 请求token
    if (res.access_token && res.token_type && res.refresh_token && res.expires_in && res.scope) {
      return response
    }

    res.code = res.code - 0
    if (!res.code) {
      res.code = 0
    }
    if (res.code !== 200) {
      if (res === 'invalid_grant') {
        Dialog.alert({
          message: Vm.$t('error.password')
        })
      } else if (res.code > 200) {
        Dialog.alert({
          message: res.msg
        })
      } else {
        Dialog.alert({
          message: res.error
        })
      }
      return Promise.reject(response.data)
    } else {
      return response.data
    }
  },
  error => {
    Dialog.alert({
      message: error
    })
    return Promise.reject(error)
  }
)

export default service
