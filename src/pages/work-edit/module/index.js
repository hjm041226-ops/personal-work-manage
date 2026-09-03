// ============================================================
// WorkEdit - 方法
// ============================================================

/** 返回作品管理 */
export function goBack(payload) {
  payload.$router.push('/works')
}

/** 取消修改（返回列表） */
export function cancelEdit(payload) {
  payload.goBack()
}

/**
 * 组装 B4 完整请求体：
 * 前端只编辑表单字段；表单之外的服务端字段（sub/badge/summary/descIntro/
 * overlayLabel/stats/sortOrder/categoryLabel/status/views 等）原样保留，
 * 避免 B4「全字段覆盖」把未编辑字段清空。
 */
export function buildEditBody(payload, data) {
  const r = payload.record || {}
  return {
    title: data.title,
    category: data.category,
    date: data.date || '',
    status: r.status || 'draft',
    url: data.url || '',
    repo: data.repo || '',
    desc: data.desc || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    published: !!data.published,
    featured: !!data.featured,
    cover: data.cover || '',
    coverFile: data.coverFile || '',
    coverMeta: data.coverMeta || '',
    sub: r.sub || '',
    badge: r.badge || '',
    categoryLabel: r.categoryLabel || '',
    summary: r.summary || '',
    descIntro: r.descIntro || '',
    overlayLabel: r.overlayLabel || '',
    stats: Array.isArray(r.stats) ? r.stats : [],
    sortOrder: typeof r.sortOrder === 'number' ? r.sortOrder : 0,
  }
}

/** 保存修改（B4）：校验表单 → PUT 完整对象 → 返回列表 */
export async function saveEdit(payload) {
  if (!payload.$formRef || !payload.record) return
  const { ok, values } = await payload.$formRef.validate()
  if (!ok) {
    payload.$msg.warning('请检查表单必填项')
    return
  }
  payload.saving = true
  try {
    const body = payload.buildEditBody(values)
    await payload.api.updateWork(payload.record.id, body)
    payload.$msg.success(`作品「${values.title}」修改已保存`)
    payload.goBack()
  } finally {
    payload.saving = false
  }
}

export default { goBack, cancelEdit, saveEdit, buildEditBody }
