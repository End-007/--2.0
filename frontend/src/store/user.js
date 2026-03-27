import { defineStore } from 'pinia'
import { login as loginApi, getUserInfo } from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    role: (state) => state.userInfo?.role || '',
    name: (state) => state.userInfo?.name || ''
  },

  actions: {
    // 登录
    async login(loginForm) {
      try {
        const res = await loginApi(loginForm)
        this.token = res.data.token
        localStorage.setItem('token', res.data.token)
        return Promise.resolve(res)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // 获取用户信息
    async getUserInfo() {
      try {
        const res = await getUserInfo()
        this.userInfo = res.data
        return Promise.resolve(res)
      } catch (error) {
        return Promise.reject(error)
      }
    },

    // 退出登录
    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('token')
    }
  }
})
