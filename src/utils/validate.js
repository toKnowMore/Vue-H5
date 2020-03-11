/**
 * Created by jiachenpan on 16/11/18.
 */

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/* 小写字母*/
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
   * validate email
   * @param email
   * @returns {boolean}
   */

function Base64() {
  // private property
  const _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  // private method for UTF-8 encoding
  var _utf8_encode = function(string) {
    string = string.replace(/\r\n/g, '\n')
    var utftext = ''
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n)
      if (c < 128) {
        utftext += String.fromCharCode(c)
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192)
        utftext += String.fromCharCode((c & 63) | 128)
      } else {
        utftext += String.fromCharCode((c >> 12) | 224)
        utftext += String.fromCharCode(((c >> 6) & 63) | 128)
        utftext += String.fromCharCode((c & 63) | 128)
      }
    }
    return utftext
  }

  // private method for UTF-8 decoding
  var _utf8_decode = function(utftext) {
    var string = ''
    var i = 0
    var c = 0
    var c2 = 0
    var c3
    while (i < utftext.length) {
      c = utftext.charCodeAt(i)
      if (c < 128) {
        string += String.fromCharCode(c)
        i++
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1)
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
        i += 2
      } else {
        c2 = utftext.charCodeAt(i + 1)
        c3 = utftext.charCodeAt(i + 2)
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
        i += 3
      }
    }
    return string
  }

  // public method for encoding
  this.encode = function(input) {
    var output = ''
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4
    var i = 0
    input = _utf8_encode(input)
    while (i < input.length) {
      chr1 = input.charCodeAt(i++)
      chr2 = input.charCodeAt(i++)
      chr3 = input.charCodeAt(i++)
      enc1 = chr1 >> 2
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
      enc4 = chr3 & 63
      if (isNaN(chr2)) {
        enc3 = enc4 = 64
      } else if (isNaN(chr3)) {
        enc4 = 64
      }
      output = output +
          _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
          _keyStr.charAt(enc3) + _keyStr.charAt(enc4)
    }
    return output
  }

  // public method for decoding
  this.decode = function(input) {
    var output = ''
    var chr1, chr2, chr3
    var enc1, enc2, enc3, enc4
    var i = 0
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++))
      enc2 = _keyStr.indexOf(input.charAt(i++))
      enc3 = _keyStr.indexOf(input.charAt(i++))
      enc4 = _keyStr.indexOf(input.charAt(i++))
      chr1 = (enc1 << 2) | (enc2 >> 4)
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
      chr3 = ((enc3 & 3) << 6) | enc4
      output = output + String.fromCharCode(chr1)
      if (enc3 !== 64) {
        output = output + String.fromCharCode(chr2)
      }
      if (enc4 !== 64) {
        output = output + String.fromCharCode(chr3)
      }
    }
    output = _utf8_decode(output)
    return output
  }
}

export {
  Base64
}

function isvalidPhone(str) {
  const reg = /^1\d{10}$/
  return reg.test(str)
}

export function validPhone(value) {
  if (!isvalidPhone(value)) {
    return false
  } else {
    return true
  }
}

function isvalidIdCardNo(str) {
  const reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/
  return reg.test(str)
}
export function validIdCardNo(value) {
  if (!isvalidIdCardNo(value)) {
    return false
  } else {
    return true
  }
}

function acount(str) {
  const reg = /^(\d(?!\d*$)|[A-z])[A-z0-9]*$/
  return reg.test(str)
}
export function validAcount(rule, value, callback) {
  if (!acount(value)) {
    return callback('格式不正确')
  } else {
    return callback()
  }
}

function contact(str) {
  const reg = /^[\u4e00-\u9fa5]+$/
  return reg.test(str)
}
export function validCN(rule, value, callback) {
  if (!contact(value)) {
    return callback('格式不正确')
  } else {
    return callback()
  }
}

// 整数
function number(str) {
  const reg = /^\d+$/
  return reg.test(str)
}
export function validNumber(rule, value, callback) {
  if (!number(value)) {
    return callback('格式不正确')
  } else {
    return callback()
  }
}

// 正整数
function numberAdd(str) {
  const reg = /^[1-9]\d*$/
  return reg.test(str)
}
export function validNumberAdd(rule, value, callback) {
  if (!numberAdd(value)) {
    return callback('格式不正确')
  } else {
    return callback()
  }
}

// 整数和小数
function int(str) {
  const reg = /^\d+(\.\d+)?$/
  return reg.test(str)
}
export function validFloat(rule, value, callback) {
  if (!int(value)) {
    return callback('格式不正确')
  } else {
    return callback()
  }
}

// 0、正整数
function number0Add(str) {
  const reg = /^(0|\+?[1-9][0-9]*)$/
  return reg.test(str)
}
export function validNumber0Add(rule, value, callback) {
  if (!number0Add(value)) {
    return callback('格式不正确')
  } else {
    return callback()
  }
}

function email(str) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(str)
}

export function validEmail(rule, value, callback) {
  if (!email(value)) {
    return callback('格式不正确')
  } else {
    return callback()
  }
}
