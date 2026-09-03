// ============================================================
// WorkUpload - 请求函数（契约 B3 新建作品）
// ============================================================
import { http } from '@/common/api/request'

/** 新建作品（B3）：body 含 status（published / draft），id 由后端生成 */
export async function createWork(payload, body) {
  return http.post('/works', body)
}

export default { createWork }
