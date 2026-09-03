// ============================================================
// 通用格式化工具
// ============================================================
import dayjs from 'dayjs'

/** 视图量千分位：1420 -> 1,420 */
export function formatViews(n) {
  const num = Number(n) || 0
  return num.toLocaleString('en-US')
}

/** 日期格式化：2024-03-15 */
export function formatDate(date, fmt = 'YYYY-MM-DD') {
  if (!date) return '—'
  const d = dayjs(date)
  return d.isValid() ? d.format(fmt) : String(date)
}

/** 文件字节描述（mock 直接给文案时原样返回） */
export function formatBytes(bytes) {
  if (typeof bytes === 'string') return bytes
  const n = Number(bytes) || 0
  if (n >= 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`
  if (n >= 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${n} B`
}

export default { formatViews, formatDate, formatBytes }
