// ============================================================
// WorkForm - 状态（变量）
// 表单模型 + 分类/长度常量；initial 由 props 注入（编辑回显）
// ============================================================

/** 契约 E1 默认分类字典（后端接口优先；离线/失败时兜底） */
export const DEFAULT_CATEGORY_OPTIONS = [
  { key: 'web', label: '网站' },
  { key: 'app', label: '移动应用' },
  { key: 'desktop', label: '桌面' },
  { key: 'others', label: '其他' },
]

export const DESC_MAX = 2000
export const TAG_MAX = 8

export default function createState(props) {
  const src = (props && props.initial) || {}
  return {
    form: {
      title: src.title || '',
      category: src.category || undefined,
      date: src.date || undefined,
      url: src.url || '',
      repo: src.repo || '',
      desc: src.desc || '',
      tags: Array.isArray(src.tags) ? [...src.tags] : [],
      published: src.published !== undefined ? !!src.published : true,
      featured: src.featured !== undefined ? !!src.featured : false,
      cover: src.coverFileUrl || src.cover || '',
      coverFile: src.coverFile || '',
      coverMeta: src.coverMeta || '',
    },
    // 分类下拉选项（默认字典；挂载后由 E1 覆盖）
    categoryOptions: DEFAULT_CATEGORY_OPTIONS.map((c) => ({ value: c.key, label: c.label })),
    // 描述字数统计
    descCount: (src.desc || '').length,
    newTag: '',
  }
}
