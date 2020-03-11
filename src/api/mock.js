import request from '@/utils/request'

export function trainQuestions(query) {
  return request({
    url: '/api-app/train/getTrainQuestions',
    method: 'get',
    params: query
  })
}

export function submitTrain(data) {
  return request({
    url: '/api-app/train/submitTrainQuestions',
    method: 'post',
    data
  })
}

export function beforeMock(query) {
  return request({
    url: '/api-app/train/whetherCategory',
    method: 'get',
    params: query
  })
}

