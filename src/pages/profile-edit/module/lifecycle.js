// ============================================================
// ProfileEdit - 生命周期（统一放这里）
// ============================================================
import { useUserStore } from '@/store/user'

export default {
  onMounted(payload) {
    const userStore = useUserStore()
    payload.name = userStore.name
    payload.bio = userStore.bio
    payload.email = userStore.email
    payload.website = userStore.website
    payload.avatar = userStore.profileAvatar
    payload.bioCount = (payload.bio || '').length
  },
  onBeforeUnmount(payload) {
    if (payload._avatarObjectUrl) {
      URL.revokeObjectURL(payload._avatarObjectUrl)
      payload._avatarObjectUrl = ''
    }
  },
}
