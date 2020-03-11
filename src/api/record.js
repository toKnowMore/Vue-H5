import request from '@/utils/request'

// 模拟考试
export function trainResultList(query) {
  return request({
    url: '/api-app/userInfo/trainResultList',
    method: 'get',
    params: query
  })
}
export function trainResultInfo(query) {
  return request({
    url: '/api-app/userInfo/trainResultInfo',
    method: 'get',
    params: query
  })
}

// 正式
export function examResultList(query) {
  return request({
    url: '/api-app/userInfo/examResultList',
    method: 'get',
    params: query
  })
}
export function examResultInfo(query) {
  return request({
    url: '/api-app/userInfo/examResultInfo',
    method: 'get',
    params: query
  })
}

export function saveError(data) {
  return request({
    url: '/api-app/questionError/save',
    method: 'post',
    data
  })
}

export function deleteError(query) {
  return request({
    url: '/api-app/questionError/delete',
    method: 'delete',
    params: query
  })
}

export function infoError(query) {
  return request({
    url: '/api-app/questionError/info',
    method: 'get',
    params: query
  })
}
