import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/api-app/trainCourse/getList',
    method: 'get',
    params: query
  })
}

export function courseInfo(query) {
  return request({
    url: '/api-app/trainCourse/info',
    method: 'get',
    params: query
  })
}

export function saveOrModify(data) {
  return request({
    url: '/api-app/trainRecord/saveOrModify',
    method: 'post',
    data
  })
}
