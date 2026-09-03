// ============================================================
// WorkForm - 请求函数（契约 E1：分类字典）
// ============================================================
import { http } from '@/common/api/request'

/** 分类字典（E1）→ { categories: [{ key, label }] }；失败时页面回退默认字典 */
export async function fetchCategories(payload) {
  return http.get('/meta/categories')
}

export default { fetchCategories }
