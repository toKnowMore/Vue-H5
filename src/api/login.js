import request from '@/utils/request'
import Qs from 'qs'

export function login(params) {
  const data = Qs.stringify({
    grant_type: 'password',
    username: params.username,
    password: params.password
  })
  return request({
    url: 'auth-h5/oauth/token',
    method: 'post',
    data
  })
}

export function logout(params) {
  return request({
    url: 'auth-h5/exit',
    method: 'delete',
    params: params
  })
}

export function getUserInfo(username) {
  return request({
    url: '/api-app/userInfo/getUserInfo',
    method: 'get',
    params: {
      username
    }
  })
}

export function newPassword(data) {
  return request({
    url: '/api-app/userInfo/changePassword',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/api-app/userInfo/update',
    method: 'post',
    data
  })
}
