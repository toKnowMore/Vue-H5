import {
  login,
  logout,
  getUserInfo
} from '@/api/login'
import {
  getToken,
  setToken,
  removeToken,
  getUsername,
  setUsername,
  removeUsername,
  getEntranceCode,
  removeEntranceCode,
  removePlatformId,
  setPlatformId,
  getPlatformId

} from '@/utils/auth'
const user = {
  state: {
    token: getToken(),
    memberId: '',
    platformId: getPlatformId(),
    username: getUsername(),
    carrierId: '',
    categoryId: '',
    contentId: '',
    jobId: '',
    reallyName: '',
    avatar: '',
    jobName: '',
    balance: null,
    exranceCode: getEntranceCode()
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_MEMBERID: (state, memberId) => {
      state.memberId = memberId
    },
    SET_PLATFORMID: (state, platformId) => {
      state.platformId = platformId
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_CARRIERID: (state, carrierId) => {
      state.carrierId = carrierId
    },
    SET_CATEGORYID: (state, categoryId) => {
      state.categoryId = categoryId
    },
    SET_CONTENTID: (state, contentId) => {
      state.contentId = contentId
    },
    SET_JOBID: (state, jobId) => {
      state.jobId = jobId
    },
    SET_JOBNAME: (state, jobName) => {
      state.jobName = jobName
    },
    SET_REALLYNAME: (state, reallyName) => {
      state.reallyName = reallyName
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_BALANCE: (state, balance) => {
      state.balance = balance
    }
  },

  actions: {
    // 用户名登录
    Login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login({
          grant_type: 'password',
          username: username,
          password: userInfo.password
        }).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.access_token)
          commit('SET_USERNAME', userInfo.username)
          setToken(response.data.access_token)
          setUsername(userInfo.username)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.username).then(response => {
          if (!response.data) {
            reject('错误，请重新登录')
          }
          const data = response.data
          commit('SET_MEMBERID', data.memberId)
          commit('SET_PLATFORMID', data.platformId)
          commit('SET_CARRIERID', data.carrierId)
          commit('SET_CATEGORYID', data.categoryId)
          commit('SET_CONTENTID', data.contentId)
          commit('SET_JOBID', data.jobId)
          commit('SET_JOBNAME', data.jobName)
          commit('SET_REALLYNAME', data.reallyName)
          commit('SET_AVATAR', data.userPhotoImg)
          commit('SET_BALANCE', data.balance)
          setPlatformId(data.platformId)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout({
          access_token: state.token
        }).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_USERNAME', '')
          commit('SET_MEMBERID', '')
          commit('SET_PLATFORMID', '')
          commit('SET_CARRIERID', '')
          commit('SET_CATEGORYID', '')
          commit('SET_CONTENTID', '')
          commit('SET_JOBID', '')
          commit('SET_REALLYNAME', '')
          commit('SET_AVATAR', '')
          commit('SET_JOBNAME', '')
          commit('SET_BALANCE', null)
          removeToken()
          removeUsername()
          removeEntranceCode()
          removePlatformId()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_USERNAME', '')
        commit('SET_MEMBERID', '')
        commit('SET_PLATFORMID', '')
        commit('SET_CARRIERID', '')
        commit('SET_CATEGORYID', '')
        commit('SET_CONTENTID', '')
        commit('SET_JOBID', '')
        commit('SET_REALLYNAME', '')
        commit('SET_AVATAR', '')
        commit('SET_JOBNAME', '')
        commit('SET_BALANCE', null)
        removeToken()
        removeUsername()
        removeEntranceCode()
        removePlatformId()
        resolve()
      })
    }
  }
}

export default user

