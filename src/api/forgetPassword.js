import request from '@/utils/request'

export function findPassword(data) {
  return request({
    url: '/api-app/public/findPassword',
    method: 'post',
    data
  })
}

