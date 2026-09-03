// ============================================================
// AppShell - 请求函数（契约 A2 / A3）
// ============================================================
import { http } from '@/common/api/request'

/** 当前登录用户（A2） */
export async function fetchMe(payload) {
  return http.get('/auth/me')
}

/** 退出（A3 无状态实现，可调用可不调用） */
export async function logout(payload) {
  return http.post('/auth/logout')
}

export default { fetchMe, logout }
