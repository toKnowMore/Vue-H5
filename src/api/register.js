import request from '@/utils/request'

export function register(data) {
  return request({
    url: '/api-app/public/register',
    method: 'post',
    data
  })
}

