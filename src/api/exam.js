import request from '@/utils/request'

export function licenseInfoByJob(query) {
  return request({
    url: '/api-app/exam/examLicenseInfo',
    method: 'get',
    params: query
  })
}

export function examQuestions(data) {
  return request({
    url: '/api-app/exam/getExamQuestions',
    method: 'post',
    data
  })
}

export function submitExamQ(data) {
  return request({
    url: '/api-app/exam/submitExamQuestions',
    method: 'post',
    data
  })
}

export function saveExamQuestion(data) {
  return request({
    url: '/api-app/exam/saveQuestion',
    method: 'post',
    data
  })
}

export function getExamPrice(query) {
  return request({
    url: '/api-app/exam/getExamPrice',
    method: 'get',
    params: query
  })
}

export function checkFaceImg(data) {
  return request({
    url: '/api-app/userInfo/checkFaceImg',
    method: 'post',
    data
  })
}

