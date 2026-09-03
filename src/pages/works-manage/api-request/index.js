// ============================================================
// WorksManage - 请求函数（静态期 mock；payload 自动装配）
// ============================================================
import { getWorks } from '@/common/api/worksMock'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** 获取作品列表（搜索/分类后续由后端完成，目前全量拉取后本地过滤） */
export async function fetchWorks(payload) {
  await delay(360) // 模拟网络延迟
  return getWorks()
}

/** 归档删除作品 */
export async function deleteWork(payload, id) {
  await delay(300)
  return { ok: true, id }
}

export default { fetchWorks, deleteWork }
