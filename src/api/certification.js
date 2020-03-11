import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/api-app/trainHisQualifications/getList',
    method: 'get',
    params: query
  })
}

export function HSELicense(query) {
  return request({
    url: '/api-app/trainHisQualifications/generateHSELicense',
    method: 'get',
    params: query
  })
}
