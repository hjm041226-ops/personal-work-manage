// ============================================================
// ProfileEdit - 生命周期（统一放这里）
// ============================================================
import { useUserStore } from '@/store/user'

export default {
  async onMounted(payload) {
    const userStore = useUserStore()
    // 优先从 D1 拉取最新资料（后端为单一事实源）
    try {
      const profile = await payload.api.getProfile()
      payload.name = profile.name || ''
      payload.title = profile.title || ''
      payload.bio = profile.bio || ''
      payload.email = profile.email || ''
      payload.website = profile.website || ''
      payload.avatar = profile.avatar || ''
      userStore.updateUser(profile)
    } catch (e) {
      // 请求失败时用本地缓存兜底展示
      payload.name = userStore.user?.name || ''
      payload.title = userStore.user?.title || ''
      payload.bio = userStore.user?.bio || ''
      payload.email = userStore.user?.email || ''
      payload.website = userStore.user?.website || ''
      payload.avatar = userStore.avatar || ''
    }
    payload._originalAvatar = payload.avatar
    payload.bioCount = (payload.bio || '').length
  },
  onBeforeUnmount(payload) {
    if (payload._avatarObjectUrl) {
      URL.revokeObjectURL(payload._avatarObjectUrl)
      payload._avatarObjectUrl = ''
    }
  },
}
