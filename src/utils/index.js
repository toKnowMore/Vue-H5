/**
 * @name 判断iOS
 */
export const isiOS = () => {
  const u = navigator.userAgent
  const iOs = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端\
  return iOs
}
/**
 * @name 判断android
 */
export const isAndroid = () => {
  const u = navigator.userAgent
  const android = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
  return android
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}
