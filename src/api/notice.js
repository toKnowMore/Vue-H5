import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/api-app/userInfo/sysNoticeList',
    method: 'get',
    params: query
  })
}
