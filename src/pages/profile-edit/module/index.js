// ============================================================
// ProfileEdit - 方法
// ============================================================
import { useUserStore } from '@/store/user'

export function goBack(payload) {
  if (window.history.length > 1) {
    payload.$router.back()
  } else {
    payload.$router.push('/works')
  }
}

/** 简介字数限制 200 */
export function onBioInput(payload) {
  const BIO_MAX = 200
  if ((payload.bio || '').length > BIO_MAX) {
    payload.bio = payload.bio.slice(0, BIO_MAX)
  }
  payload.bioCount = (payload.bio || '').length
}

/** 更换头像（本地预览，保存后写入 store） */
export function chooseAvatar(payload, file) {
  if (!file) return false
  const okType = ['image/png', 'image/jpeg', 'image/webp'].includes(file.type)
  if (!okType) {
    payload.$msg.error('仅支持 PNG / WEBP / JPG 格式')
    return false
  }
  if (file.size > 5 * 1024 * 1024) {
    payload.$msg.error('头像图片不能超过 5MB')
    return false
  }
  if (payload._avatarObjectUrl) URL.revokeObjectURL(payload._avatarObjectUrl)
  const url = URL.createObjectURL(file)
  payload._avatarObjectUrl = url
  payload.avatar = url
  return false
}

/** 取消（返回上一页） */
export function cancel(payload) {
  payload.goBack()
}

/** 保存更改 */
export async function save(payload) {
  if (!payload.$formEl) return
  let values
  try {
    values = await payload.$formEl.validate()
  } catch (e) {
    payload.$msg.warning('请检查必填项')
    return
  }
  payload.submitting = true
  try {
    const userStore = useUserStore()
    const data = {
      name: payload.name,
      bio: payload.bio,
      email: payload.email,
      website: payload.website,
      profileAvatar: payload.avatar,
    }
    const res = await payload.api.updateProfile(data)
    if (res && res.ok) {
      userStore.name = data.name
      userStore.bio = data.bio
      userStore.email = data.email
      userStore.website = data.website
      userStore.profileAvatar = data.profileAvatar
      payload.$msg.success('个人资料已保存')
      payload.goBack()
    }
  } finally {
    payload.submitting = false
  }
}

export default { goBack, onBioInput, chooseAvatar, cancel, save }
