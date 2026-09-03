// ============================================================
// 用户 store（一期静态；后续接入真实登录态）
// ============================================================
import { defineStore } from 'pinia'
import { IMG_AVATAR_USER, IMG_AVATAR_PROFILE } from '@/common/api/assets'

export const useUserStore = defineStore('user', {
  state: () => ({
    // 静态演示默认已登录，便于直接预览后台页面；真实环境应从鉴权接口恢复
    isLogin: true,
    name: 'Elena Vance',
    title: '创意总监 / 设计师',
    email: 'elena.vance@atelier-cms.io',
    website: 'https://elenavance.design',
    bio: '专注极致美学、数字产品交互与品牌视觉构建。致力于通过严谨的结构与克制的视觉语言，创造恒久的数字体验。',
    avatar: IMG_AVATAR_USER,
    profileAvatar: IMG_AVATAR_PROFILE,
  }),
  actions: {
    /** 模拟登录（一期无真实校验） */
    login({ email = '', name = 'Elena Vance', remember = false } = {}) {
      this.isLogin = true
      if (email) this.email = email
      this.name = name
      return Promise.resolve({ ok: true })
    },
    logout() {
      this.isLogin = false
    },
  },
})

export default useUserStore
