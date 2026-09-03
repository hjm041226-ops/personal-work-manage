// ============================================================
// Login - 请求函数（契约 A1：POST /api/v1/admin/auth/login）
// 唯一免鉴权接口；请求层会自动加 token（此时还没有）
// ============================================================
import { http } from '@/common/api/request'

/** 管理员登录 → { token, user }（错误由请求层统一 toast/跳转） */
export async function login(payload, { email, password, remember } = {}) {
  return http.post('/auth/login', { email, password, remember })
}

export default { login }
