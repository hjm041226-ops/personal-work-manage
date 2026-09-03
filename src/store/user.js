// ============================================================
// 用户 store（接入契约 A1/A2/D1：token + user，localStorage 持久化）
// ============================================================
import { defineStore } from 'pinia'
import { getToken, setToken, getUser, setUser, clearSession } from '@/common/utils/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken() || '',
    user: getUser(), // { id,email,name,title,bio,website,avatar,role }
  }),
  getters: {
    isLogin: (state) => !!state.token,
    displayName: (state) => (state.user && state.user.name) || '',
    avatar: (state) => (state.user && state.user.avatar) || '',
  },
  actions: {
    /** 登录成功（A1 响应 { token, user }） */
    setSession({ token, user } = {}) {
      if (token) {
        this.token = token
        setToken(token)
      }
      if (user) {
        this.user = user
        setUser(user)
      }
    },
    /** 更新用户信息（A2 / D1 / D2 / D3 之后同步） */
    updateUser(user = {}) {
      if (!user) return
      this.user = { ...(this.user || {}), ...user }
      setUser(this.user)
    },
    /** 退出：本地清理（契约 A3 无状态，可不调用接口） */
    logout() {
      this.token = ''
      this.user = null
      clearSession()
    },
  },
})

export default useUserStore
