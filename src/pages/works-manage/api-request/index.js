// ============================================================
// WorksManage - 请求函数（契约 B1 列表 / B5 归档删除）
// ============================================================
import { http } from '@/common/api/request'

/**
 * 作品分页列表（契约 B1）
 * params: { page, pageSize, category?, keyword?, status?, sortBy?, order? }
 * 返回 { items, page, pageSize, total, categories }
 */
export async function fetchWorks(payload, params = {}) {
  const query = {
    page: params.page || 1,
    pageSize: params.pageSize || 10,
    category: params.category || 'all',
    ...(params.keyword ? { keyword: params.keyword } : {}),
    ...(params.status ? { status: params.status } : {}),
    ...(params.sortBy ? { sortBy: params.sortBy } : {}),
    ...(params.order ? { order: params.order } : {}),
  }
  return http.get('/works', { params: query })
}

/** 归档删除（契约 B5：软删） */
export async function deleteWork(payload, id) {
  return http.delete(`/works/${encodeURIComponent(id)}`)
}

export default { fetchWorks, deleteWork }
