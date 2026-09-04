// ============================================================
// WorkUpload - 方法
// ============================================================

export function goBack(payload) {
  payload.$router.push('/works')
}

/** 组装 B3 请求体（上传页没有历史字段，只提交表单内容） */
// 注意：module 方法统一由 usePayload 前置注入 payload 首参，故签名必须为 (payload, data, status)。
export function buildCreateBody(payload, data, status = 'published') {
  return {
    title: data.title,
    category: data.category,
    date: data.date || '',
    status,
    url: data.url || '',
    repo: data.repo || '',
    desc: data.desc || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    published: !!data.published,
    featured: !!data.featured,
    cover: data.cover || '',
    coverFile: data.coverFile || '',
    coverMeta: data.coverMeta || '',
  }
}

/** 内部提交：status = published 发布 / draft 保存草稿 */
async function submitCreate(payload, status) {
  if (!payload.$formRef) return
  const { ok, values } = await payload.$formRef.validate()
  if (!ok) {
    payload.$msg.warning('请检查表单必填项')
    return
  }
  payload.saving = true
  try {
    const body = payload.buildCreateBody(values, status)
    await payload.api.createWork(body) // id 由后端生成
    payload.$msg.success(status === 'draft' ? '已保存为草稿' : '作品已发布')
    payload.goBack()
  } finally {
    payload.saving = false
  }
}

/** 保存草稿（B3 + status=draft） */
export function saveDraft(payload) {
  return submitCreate(payload, 'draft')
}

/** 发布作品（B3 + status=published） */
export function publish(payload) {
  return submitCreate(payload, 'published')
}

export default { goBack, buildCreateBody, saveDraft, publish }
