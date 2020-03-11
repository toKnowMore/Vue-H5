import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/api-app/userInfo/orderList',
    method: 'get',
    params: query
  })
}

export function applyInv(data) {
  return request({
    url: '/api-app/userInfo/applicationInvoice',
    method: 'post',
    data
  })
}
