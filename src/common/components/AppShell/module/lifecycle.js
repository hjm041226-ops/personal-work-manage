// ============================================================
// AppShell - 生命周期（统一放这里）
// ============================================================
import { useUserStore } from '@/store/user'

export default {
  /** 进入后台时若无用户缓存（刷新后），用 A2 拉取当前用户 */
  async onMounted(payload) {
    const userStore = useUserStore()
    if (userStore.isLogin && !userStore.user) {
      try {
        const user = await payload.api.fetchMe()
        if (user) userStore.updateUser(user)
      } catch (e) {
        // 401 已由请求层清 token 跳登录页；其余静默
      }
    }
  },
}
