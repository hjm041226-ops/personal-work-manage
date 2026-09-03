// ============================================================
// WorkEdit - 请求函数（静态期 mock）
// ============================================================
import { getWorkById } from '@/common/api/worksMock'

export async function fetchWork(payload, id) {
  // TODO: 接入真实详情接口
  await new Promise((resolve) => setTimeout(resolve, 200))
  return getWorkById(id)
}

export default { fetchWork }
