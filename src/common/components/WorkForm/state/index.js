// ============================================================
// WorkForm - 状态（变量）
// 表单模型 + 分类/长度常量；initial 由 props 注入（编辑回显）
// ============================================================

export const CATEGORY_OPTIONS = [
  '车载交互 / HMI',
  '移动端应用',
  '品牌视觉规范',
  '三维动态设计',
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
      published: src.published !== undefined ? src.published : true,
      featured: src.featured !== undefined ? src.featured : false,
      cover: src.coverFileUrl || src.cover || '',
    },
    // 描述字数统计
    descCount: (src.desc || '').length,
    newTag: '',
  }
}
