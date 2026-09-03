// ============================================================
// WorksManage - 状态（变量）
// ============================================================

export const PAGE_SIZE = 4 // demo 每页 4 条

export default function createState() {
  return {
    keyword: '',
    category: 'all',
    loading: false,
    list: [], // 全量（静态期来自 mock）
    visible: [], // 过滤+分页后的展示行
    counts: { all: 0, web: 0, app: 0, desktop: 0, others: 0 },
    pagination: { current: 1, pageSize: PAGE_SIZE, total: 0 },
  }
}
