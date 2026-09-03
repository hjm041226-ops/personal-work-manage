// ============================================================
// WorksManage - 方法
// ============================================================
import { filterWorks } from '@/common/api/worksMock'

/** 按关键词 + 分类重算各分类计数 */
export function computeCounts(payload) {
  const counts = { all: payload.list.length, web: 0, app: 0, desktop: 0, others: 0 }
  payload.list.forEach((w) => {
    if (counts[w.category] !== undefined) counts[w.category] += 1
  })
  payload.counts = counts
}

/** 过滤 + 分页 */
export function applyFilter(payload) {
  const filtered = filterWorks(payload.list, {
    keyword: payload.keyword,
    category: payload.category,
  })
  const { current, pageSize } = payload.pagination
  payload.pagination.total = filtered.length
  const start = (current - 1) * pageSize
  payload.visible = filtered.slice(start, start + pageSize)
  // 翻页越界自动回退
  if (!payload.visible.length && current > 1) {
    payload.pagination.current = 1
    payload.applyFilter()
  }
}

/** 关键词/分类变化：回到第一页再过滤 */
export function applySearch(payload) {
  payload.pagination.current = 1
  payload.applyFilter()
}

/** 搜索输入（实时过滤） */
export function onSearchInput(payload) {
  payload.applySearch()
}

/** 选择分类胶囊 */
export function onCategory(payload, key) {
  payload.category = key || 'all'
  payload.applySearch()
}

/** 分页变化 */
export function onPageChange(payload, page = 1, pageSize = 4) {
  payload.pagination.current = page
  payload.pagination.pageSize = pageSize
  payload.applyFilter()
}

/** 行内操作：编辑 -> 路由带 id */
export function goEdit(payload, row) {
  payload.$router.push(`/works/${row.id}/edit`)
}

/** 新增作品 */
export function goUpload(payload) {
  payload.$router.push('/works/upload')
}

/** 行内操作：查看（静态演示占位） */
export function onView(payload, row) {
  payload.$msg.info(`查看作品「${row.title}」详情功能待接入（静态演示）`)
}

/** 行内操作：归档删除（确认后调用 api） */
export function onDelete(payload, row) {
  payload.$msg.confirm({
    title: '归档删除',
    content: `确定要归档删除「${row.title}」吗？`,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      const res = await payload.api.deleteWork(row.id)
      if (res && res.ok) {
        payload.list = payload.list.filter((w) => w.id !== row.id)
        payload.computeCounts()
        payload.applyFilter()
        payload.$msg.success('作品已删除')
      }
    },
  })
}

export default { computeCounts, applyFilter, applySearch, onSearchInput, onCategory, onPageChange, goEdit, goUpload, onView, onDelete }
