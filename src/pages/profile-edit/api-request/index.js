// ============================================================
// ProfileEdit - 请求函数（契约 D1 / D2 / D3）
// ============================================================
import { http } from '@/common/api/request'

/** 获取个人资料（D1） */
export async function getProfile(payload) {
  return http.get('/profile')
}

/** 更新个人资料（D2） */
export async function updateProfile(payload, data) {
  return http.put('/profile', data)
}

/** 换头像（D3：multipart file，后端自动落库） */
export async function uploadAvatar(payload, file) {
  const form = new FormData()
  form.append('file', file)
  return http.post('/profile/avatar', form, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export default { getProfile, updateProfile, uploadAvatar }
