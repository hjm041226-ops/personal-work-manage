// ============================================================
// WorksManage - 状态（变量）—— 服务端分页（契约 B1）
// ============================================================

export const PAGE_SIZE = 10 // 默认每页 10（契约 pageSize 默认 10）

export default function createState() {
  return {
    keyword: '',
    category: 'all', // all / web / app / desktop / others
    loading: false,
    items: [], // 当前页数据（来自 GET /works）
    pills: [], // 分类胶囊 [{ key, label }]（含「全部」）
    counts: {}, // 分类角标计数 { all, web, app, desktop, others }
    pagination: { current: 1, pageSize: PAGE_SIZE, total: 0 },
    _searchTimer: null, // 搜索防抖
  }
}
