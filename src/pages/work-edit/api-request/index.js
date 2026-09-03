// ============================================================
// WorkEdit - 请求函数（契约 B2 详情 / B4 更新）
// ============================================================
import { http } from '@/common/api/request'

/** 作品详情（B2）→ 完整作品（编辑回显） */
export async function fetchWork(payload, id) {
  return http.get(`/works/${encodeURIComponent(id)}`)
}

/** 更新作品（B4 全字段覆盖语义，由页面组装完整对象） */
export async function updateWork(payload, id, body) {
  return http.put(`/works/${encodeURIComponent(id)}`, body)
}

export default { fetchWork, updateWork }
