import request from '@/utils/request'

// 新增+解析
export function uploadCredentials(data) {
  return request({
    url: '/api-app/membersLicense/uploadCredentials',
    method: 'post',
    data
  })
}

export function saveCer(data) {
  return request({
    url: '/api-app/membersLicense/save',
    method: 'post',
    data
  })
}

export function updateCer(data) {
  return request({
    url: '/api-app/membersLicense/update',
    method: 'post',
    data
  })
}

export function infoCer(query) {
  return request({
    url: '/api-app/membersLicense/info',
    method: 'get',
    params: query
  })
}
