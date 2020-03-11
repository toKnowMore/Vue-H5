import request from '@/utils/request'

export function supplementInfo(query) {
  return request({
    url: '/api-app/trainHisQualifications/trainSignInfo',
    method: 'get',
    params: query
  })
}

export function examAuthInfo(query) {
  return request({
    url: '/api-app/exam/examAuthInfo',
    method: 'get',
    params: query
  })
}

export function uploadIdCardAndSignImg(data) {
  return request({
    url: '/api-app/exam/uploadIdCardAndSignImg',
    method: 'post',
    data
  })
}
