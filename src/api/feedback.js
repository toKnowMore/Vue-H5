import request from '@/utils/request'

export function feedbackSave(data) {
  return request({
    url: '/api-app/userInfo/feedbackSave',
    method: 'post',
    data
  })
}
