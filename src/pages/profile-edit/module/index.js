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

/** 简介字数限制 200（契约 D2：bio ≤200） */
export function onBioInput(payload) {
  const BIO_MAX = 200
  if ((payload.bio || '').length > BIO_MAX) {
    payload.bio = payload.bio.slice(0, BIO_MAX)
  }
  payload.bioCount = (payload.bio || '').length
}

/** 选择头像：本地校验 + 预览，文件留存待「保存更改」统一走 D3 上传 */
export function chooseAvatar(payload, file) {
  if (!file) return false
  const okType = ['image/png', 'image/jpeg', 'image/webp'].includes(file.type)
  if (!okType) {
    payload.$msg.error('仅支持 PNG / WEBP / JPG 格式')
    return false
  }
  if (file.size > 5 * 1024 * 1024) {
    payload.$msg.error('文件过大，头像最大 5MB')
    return false
  }
  if (payload._avatarObjectUrl) URL.revokeObjectURL(payload._avatarObjectUrl)
  const url = URL.createObjectURL(file)
  payload._avatarObjectUrl = url
  payload.avatar = url
  payload.pendingFile = file
  return false // 阻止 antd 自动上传
}

/** 取消：还原原头像（未点保存则不上传/不落库） */
export function cancel(payload) {
  if (payload._avatarObjectUrl) {
    URL.revokeObjectURL(payload._avatarObjectUrl)
    payload._avatarObjectUrl = ''
  }
  payload.avatar = payload._originalAvatar
  payload.pendingFile = null
  payload.goBack()
}

/** 保存更改：有换头像先 D3 上传；文本资料走 D2 */
export async function save(payload) {
  if (!payload.$formEl) return
  try {
    await payload.$formEl.validate()
  } catch (e) {
    payload.$msg.warning('请检查必填项')
    return
  }
  payload.submitting = true
  try {
    const userStore = useUserStore()

    // 1) 头像：D3（自动落库）
    let avatarUrl = payload._originalAvatar
    if (payload.pendingFile) {
      payload.uploadingAvatar = true
      const avatarRes = await payload.api.uploadAvatar(payload.pendingFile)
      avatarUrl = (avatarRes && avatarRes.avatar) || avatarUrl
      if (payload._avatarObjectUrl) {
        URL.revokeObjectURL(payload._avatarObjectUrl)
        payload._avatarObjectUrl = ''
      }
      payload.pendingFile = null
      payload.uploadingAvatar = false
    }

    // 2) 文本资料：D2
    await payload.api.updateProfile({
      name: payload.name,
      title: payload.title,
      bio: payload.bio,
      email: payload.email,
      website: payload.website,
    })

    // 3) 同步本地 store（顶栏姓名/头像即时刷新）
    userStore.updateUser({
      name: payload.name,
      title: payload.title,
      bio: payload.bio,
      email: payload.email,
      website: payload.website,
      avatar: avatarUrl,
    })
    payload._originalAvatar = avatarUrl
    payload.$msg.success('个人资料已保存')
    payload.goBack()
  } catch (e) {
    payload.uploadingAvatar = false
    // 错误提示由请求层统一处理
  } finally {
    payload.submitting = false
  }
}

export default { goBack, onBioInput, chooseAvatar, cancel, save }
