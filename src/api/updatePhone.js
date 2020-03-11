import request from '@/utils/request'

export function updatePhone(data) {
  return request({
    url: '/api-app/userInfo/updatePhone',
    method: 'post',
    data
  })
}

