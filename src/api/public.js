import request from '@/utils/request'

export function dynamicCode(query) {
  return request({
    url: '/api-app/public/getDynamicCode',
    method: 'get',
    params: query
  })
}

export function platformAll(query) {
  return request({
    url: '/api-app/public/platformAll',
    method: 'get',
    params: query
  })
}

export function jobAll(query) {
  return request({
    url: '/api-app/public/jobAll',
    method: 'get',
    params: query
  })
}

export function getPlatformByCode(query) {
  return request({
    url: '/api-app/public/getPlatformByCode',
    method: 'get',
    params: query
  })
}

export function categoryAll(query) {
  return request({
    url: '/api-app/public/categoryAll',
    method: 'get',
    params: query
  })
}

export function contentAll(query) {
  return request({
    url: '/api-app/public/contentAll',
    method: 'get',
    params: query
  })
}

export function carrierAll(query) {
  return request({
    url: '/api-app/public/carrierAll',
    method: 'get',
    params: query
  })
}

export function trainContentByName(query) {
  return request({
    url: '/api-app/public/getTrainContentLikeName',
    method: 'get',
    params: query
  })
}

export function trainCarrierByName(query) {
  return request({
    url: '/api-app/public/getTrainCarrierLikeName',
    method: 'get',
    params: query
  })
}

export function uploadFile(data) {
  return request({
    url: '/api-app/ossUpload/uploadFile',
    method: 'post',
    data
  })
}

export function sendToken(query) {
  return request({
    url: '/api-app/public/sendToken',
    method: 'get',
    params: query
  })
}
