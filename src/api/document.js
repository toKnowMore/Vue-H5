import request from '@/utils/request'

export function documentList(query) {
  return request({
    url: '/api-app/userInfo/helpDocumentSelectAll',
    method: 'get',
    params: query
  })
}

export function helpDocumentInfo(query) {
  return request({
    url: '/api-app/userInfo/helpDocumentInfo',
    method: 'get',
    params: query
  })
}

export function errorList(query) {
  return request({
    url: '/api-app/questionError/getList',
    method: 'get',
    params: query
  })
}
