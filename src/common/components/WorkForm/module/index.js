// ============================================================
// WorkForm - 方法
// ============================================================
import { DESC_MAX, TAG_MAX, DEFAULT_CATEGORY_OPTIONS } from '../state'
import {
  GITHUB_OWNER,
  COVER_PLACEHOLDER_URL,
  listPublicRepos,
  fetchReadme,
  pickCoverFromReadme,
  normalizeReadmeImages,
} from '@/common/utils/github'

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

// ---------------- GitHub 仓库导入(上传页「从 GitHub 导入」) ----------------

/** 打开导入弹窗;首次打开时自动拉取仓库列表 */
export function openGithubImport(payload) {
  payload.githubOpen = true
  if (!payload.githubRepos.length && !payload.githubLoading) {
    payload.loadGithubRepos()
  }
}

/** 关闭导入弹窗 */
export function closeGithubImport(payload) {
  payload.githubOpen = false
}

/** 拉取账号公开仓库列表(自动排除 fork / archived,调用 GitHub 匿名 API) */
export async function loadGithubRepos(payload) {
  payload.githubLoading = true
  try {
    payload.githubRepos = await listPublicRepos()
  } catch (e) {
    payload.$msg.error((e && e.message) || '拉取 GitHub 仓库失败,请稍后重试')
  } finally {
    payload.githubLoading = false
  }
}

/**
 * 导入单个仓库到当前表单:
 *  title=仓库名;repo=仓库地址;url=仓库 homepage;desc=README(Markdown 原样);
 *  tags=原标签+仓库 topics+主语言(去重、限 8 个);cover=README 首图,取不到用占位图。
 *  category/date/published/featured 等用户已填内容保持不变。
 */
export async function applyGithubImport(payload, repo) {
  if (!repo || !repo.name) return
  payload.githubImporting = repo.name
  try {
    const branch = repo.defaultBranch || 'main'
    // README 里的图片地址多是相对路径 / github blob 页链接,先把它们改写为
    // 可直接访问的绝对 URL,再落库,保证渲染描述时图片能正常显示
    const md = normalizeReadmeImages(
      await fetchReadme(GITHUB_OWNER, repo.name, branch),
      GITHUB_OWNER,
      repo.name,
      branch
    )
    const truncated = md.length > DESC_MAX
    let desc = md
    if (truncated) {
      // 尽量按行截断,避免把某张图片的 markdown 语法从中间切断导致裂图
      desc = md.slice(0, DESC_MAX)
      const cut = desc.lastIndexOf('\n')
      if (cut > 0) desc = desc.slice(0, cut)
    }
    const cover =
      pickCoverFromReadme(md, GITHUB_OWNER, repo.name, branch) || COVER_PLACEHOLDER_URL

    const cur = payload.form
    cur.title = repo.name
    cur.repo = repo.htmlUrl || ''
    cur.url = repo.homepage || ''
    cur.desc = desc
    cur.tags = [
      ...new Set([
        ...(cur.tags || []),
        ...(repo.topics || []),
        ...(repo.language ? [repo.language] : []),
      ]),
    ].slice(0, TAG_MAX)
    cur.cover = cover
    cur.coverFile = ''
    cur.coverMeta = ''
    payload.syncCount()

    payload.githubOpen = false
    payload.$msg.success(`已从 GitHub 导入「${repo.name}」,请核对后保存`)
    if (truncated) payload.$msg.warning(`README 超过 ${DESC_MAX} 字,描述已截断`)
    if (!md) payload.$msg.info('该仓库没有 README,作品描述留空')
  } catch (e) {
    payload.$msg.error((e && e.message) || `导入「${repo.name}」失败,请稍后重试`)
  } finally {
    payload.githubImporting = ''
  }
}

export default {
  validate,
  getData,
  loadCategories,
  onCoverChange,
  resetForm,
  syncCount,
  onDescInput,
  execCommand,
  addTag,
  removeTag,
  openGithubImport,
  closeGithubImport,
  loadGithubRepos,
  applyGithubImport,
}
