// ============================================================
// WorksManage - 方法（服务端过滤/分页，契约 B1/B5）
// ============================================================

const CATEGORY_LABEL_FALLBACK = {
  web: '网站',
  app: '移动应用',
  desktop: '桌面',
  others: '其他',
}

/** 由后端 categories 生成胶囊数据与角标计数（label 已是中文） */
export function applyCategories(payload, categories = []) {
  const counts = { all: 0, web: 0, app: 0, desktop: 0, others: 0 }
  const pills = [{ key: 'all', label: '全部' }]
  categories.forEach((c) => {
    const key = c.key
    if (key && key !== 'all') {
      counts[key] = counts[key] !== undefined ? counts[key] + (Number(c.count) || 0) : Number(c.count) || 0
      pills.push({ key, label: c.label || CATEGORY_LABEL_FALLBACK[key] || key })
    }
  })
  // 兜底：后端即使缺少某分类也展示 4 个角标
  Object.keys(CATEGORY_LABEL_FALLBACK).forEach((key) => {
    if (counts[key] === undefined) counts[key] = 0
    if (!pills.some((p) => p.key === key)) pills.push({ key, label: CATEGORY_LABEL_FALLBACK[key] })
  })
  counts.all = Object.keys(CATEGORY_LABEL_FALLBACK).reduce((sum, k) => sum + (counts[k] || 0), 0)
  payload.counts = counts
  payload.pills = pills
}

/** 拉取当前页（服务端按 keyword/category 过滤） */
export async function refresh(payload) {
  payload.loading = true
  try {
    const data = await payload.api.fetchWorks({
      page: payload.pagination.current,
      pageSize: payload.pagination.pageSize,
      category: payload.category,
      keyword: payload.keyword,
    })
    payload.items = (data && data.items) || []
    payload.pagination.total = (data && data.total) || 0
    payload.applyCategories((data && data.categories) || [])
  } finally {
    payload.loading = false
  }
}

/** 回到第一页并刷新 */
export function refreshFromFirst(payload) {
  payload.pagination.current = 1
  payload.refresh()
}

/** 搜索输入：防抖 350ms 后回第一页查询 */
export function onSearchInput(payload) {
  if (payload._searchTimer) clearTimeout(payload._searchTimer)
  payload._searchTimer = setTimeout(() => {
    payload.refreshFromFirst()
  }, 350)
}

/** 选择分类胶囊 */
export function onCategory(payload, key) {
  if (payload.category === key) return
  payload.category = key || 'all'
  payload.refreshFromFirst()
}

/** 分页变化 */
export function onPageChange(payload, page = 1) {
  if (payload.pagination.current === page) return
  payload.pagination.current = page
  payload.refresh()
}

/** 行内操作：编辑 -> 路由带 id */
export function goEdit(payload, row) {
  payload.$router.push(`/works/${encodeURIComponent(row.id)}/edit`)
}

/** 新增作品 */
export function goUpload(payload) {
  payload.$router.push('/works/upload')
}

/** 行内操作：查看（契约未要求详情阅读页，占位提示） */
export function onView(payload, row) {
  payload.$msg.info(`「${row.title}」为后台编辑视图，可点击编辑进入`)
}

/** 行内操作：归档删除（B5，软删后服务端与公开站即时下架） */
export function onDelete(payload, row) {
  payload.$msg.confirm({
    title: '归档删除',
    content: `确定要归档删除「${row.title}」吗？删除后公开站将立即下架该作品。`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      await payload.api.deleteWork(row.id)
      payload.$msg.success('作品已删除')
      // 删除的是本页最后一行时回退一页，避免停在空页
      const remain = Math.max(0, (payload.pagination.total || 0) - 1)
      const maxPage = Math.max(1, Math.ceil(remain / (payload.pagination.pageSize || 1)))
      if (payload.pagination.current > maxPage) {
        payload.pagination.current = maxPage
      }
      payload.refresh()
    },
  })
}

export default { applyCategories, refresh, refreshFromFirst, onSearchInput, onCategory, onPageChange, goEdit, goUpload, onView, onDelete }
