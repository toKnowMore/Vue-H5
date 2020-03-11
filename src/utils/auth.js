import Cookies from 'js-cookie'

const TokenKey = 'siya-h5-Token'
const Username = 'siya-h5-Username'
const PfCode = 'siya-h5-PfCode'
const PfId = 'siya-h5-PfId'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUsername() {
  return Cookies.get(Username)
}

export function setUsername(username) {
  return Cookies.set(Username, username)
}

export function removeUsername() {
  return Cookies.remove(Username)
}

export function getEntranceCode() {
  return Cookies.get(PfCode)
}

export function setEntranceCode(code) {
  return Cookies.set(PfCode, code)
}

export function removeEntranceCode() {
  return Cookies.remove(PfCode)
}

export function getPlatformId() {
  return Cookies.get(PfId)
}

export function setPlatformId(id) {
  return Cookies.set(PfId, id)
}

export function removePlatformId() {
  return Cookies.remove(PfId)
}

