'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://192.168.199.108:9020"'
  // BASE_API: '"http://192.168.199.142:9020"'
  BASE_API: '"https://siya.shallnew.com/api/"'
})
