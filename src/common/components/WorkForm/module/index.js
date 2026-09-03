// ============================================================
// WorkForm - 方法
// ============================================================
import { DESC_MAX, TAG_MAX, DEFAULT_CATEGORY_OPTIONS } from '../state'

/** 表单校验入口（index.vue 暴露给页面） */
export async function validate(payload) {
  if (!payload.$formEl) {
    return { ok: false, errors: [{ message: '表单未就绪' }] }
  }
  try {
    await payload.$formEl.validate()
    return { ok: true, values: payload.getData() }
  } catch (e) {
    return { ok: false, errors: e && e.errorFields ? e.errorFields : e }
  }
}

/** 导出表单可写字段（页面据此组装 B3/B4 请求体） */
export function getData(payload) {
  const f = payload.form
  return {
    title: f.title || '',
    category: f.category || '',
    date: f.date || '',
    url: f.url || '',
    repo: f.repo || '',
    desc: f.desc || '',
    tags: Array.isArray(f.tags) ? [...f.tags] : [],
    published: !!f.published,
    featured: !!f.featured,
    cover: f.cover || '',
    coverFile: f.coverFile || '',
    coverMeta: f.coverMeta || '',
  }
}

/** 加载分类字典（契约 E1；失败静默回退默认中文字典） */
export async function loadCategories(payload) {
  try {
    const res = await payload.api.fetchCategories()
    const list = (res && res.categories) || []
    if (list.length) {
      payload.categoryOptions = list.map((c) => ({ value: c.key, label: c.label || c.key }))
    }
  } catch (e) {
    payload.categoryOptions = DEFAULT_CATEGORY_OPTIONS.map((c) => ({ value: c.key, label: c.label }))
  }
}

/** 封面事件（CoverUpload change）：同步 coverFile / coverMeta */
export function onCoverChange(payload, info = {}) {
  payload.form.cover = info.url || payload.form.cover
  payload.form.coverFile = (info && info.fileName) || ''
  payload.form.coverMeta = (info && info.meta) || ''
}

/** 重置为初始数据 */
export function resetForm(payload, initial = {}) {
  Object.assign(payload.form, {
    title: initial.title || '',
    category: initial.category || undefined,
    date: initial.date || undefined,
    url: initial.url || '',
    repo: initial.repo || '',
    desc: initial.desc || '',
    tags: Array.isArray(initial.tags) ? [...initial.tags] : [],
    published: initial.published !== undefined ? !!initial.published : true,
    featured: initial.featured !== undefined ? !!initial.featured : false,
    cover: initial.coverFileUrl || initial.cover || '',
    coverFile: initial.coverFile || '',
    coverMeta: initial.coverMeta || '',
  })
  payload.syncCount()
}

/** 描述字数同步 */
export function syncCount(payload) {
  payload.descCount = (payload.form.desc || '').length
}

/** 字数校验（超出则截断提示） */
export function onDescInput(payload) {
  const len = (payload.form.desc || '').length
  if (len > DESC_MAX) {
    payload.form.desc = payload.form.desc.slice(0, DESC_MAX)
    payload.$msg.warning(`描述内容最多 ${DESC_MAX} 字`)
  }
  payload.descCount = Math.min(len, DESC_MAX)
}

// ---------------- 富文本（markdown 式）处理 ----------------

function getDescArea(payload) {
  const ref = payload.$descRef
  if (!ref) return null
  const el = ref.$el || ref
  return el && el.tagName === 'TEXTAREA' ? el : el.querySelector && el.querySelector('textarea')
}

function wrapSelection(area, before, after) {
  const { selectionStart: s, selectionEnd: e, value: v } = area
  const selected = v.slice(s, e) || before
  area.value = v.slice(0, s) + before + selected + after + v.slice(e)
  const ns = s + before.length
  area.setSelectionRange(ns, ns + selected.length)
  area.focus()
}

function applyLinePrefix(area, prefix) {
  const { selectionStart: s, selectionEnd: e, value: v } = area
  const startLine = v.lastIndexOf('\n', s - 1) + 1
  const endLine = v.indexOf('\n', e)
  const blockEnd = endLine === -1 ? v.length : endLine
  const block = v.slice(startLine, blockEnd)
  const next = block
    .split('\n')
    .map((line) => (line.startsWith(prefix) ? line.slice(prefix.length) : prefix + line))
    .join('\n')
  area.value = v.slice(0, startLine) + next + v.slice(blockEnd)
  area.setSelectionRange(startLine, startLine + next.length)
  area.focus()
}

/** 工具栏命令：cmd 来自 MarkdownToolbar 的 exec 事件 */
export function execCommand(payload, cmd) {
  const area = getDescArea(payload)
  if (!area) {
    payload.$msg.warning('请先聚焦到作品描述区域')
    return
  }
  const { value: v, selectionStart: s, selectionEnd: e } = area
  const sel = v.slice(s, e)

  switch (cmd) {
    case 'bold':
      return wrapSelection(area, '**', '**')
    case 'italic':
      return wrapSelection(area, '*', '*')
    case 'code':
      return wrapSelection(area, '`', '`')
    case 'createLink': {
      const insert = sel ? `[${sel}](https://)` : '[链接文字](https://)'
      area.value = v.slice(0, s) + insert + v.slice(e)
      area.setSelectionRange(s, s + insert.length)
      area.focus()
      return undefined
    }
    case 'insertUnorderedList':
      return applyLinePrefix(area, '- ')
    case 'insertOrderedList':
      return applyLinePrefix(area, '1. ')
    case 'formatBlock':
      return applyLinePrefix(area, '> ')
    default:
      return undefined
  }
}

// ---------------- 标签管理 ----------------

export function addTag(payload) {
  const tag = (payload.newTag || '').trim().replace(/^#/, '')
  if (!tag) return
  if (payload.form.tags.includes(tag)) {
    payload.$msg.info('标签已存在')
    payload.newTag = ''
    return
  }
  if (payload.form.tags.length >= TAG_MAX) {
    payload.$msg.warning(`最多添加 ${TAG_MAX} 个标签`)
    return
  }
  payload.form.tags.push(tag)
  payload.newTag = ''
}

export function removeTag(payload, index) {
  payload.form.tags.splice(index, 1)
}

export default { validate, getData, loadCategories, onCoverChange, resetForm, syncCount, onDescInput, execCommand, addTag, removeTag }
