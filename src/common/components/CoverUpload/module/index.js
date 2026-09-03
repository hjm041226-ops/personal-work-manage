// ============================================================
// CoverUpload - 方法
// ============================================================
import { formatBytes } from '@/common/utils/format'

/** 规格校验（PNG/WEBP/JPG，≤20MB） */
export function checkFile(payload, file) {
  const okType = ['image/png', 'image/jpeg', 'image/webp'].includes(file.type)
  if (!okType) {
    payload.$msg.error('仅支持 PNG / WEBP / JPG 格式')
    return false
  }
  if (file.size > 20 * 1024 * 1024) {
    payload.$msg.error('图片大小不能超过 20MB')
    return false
  }
  return true
}

/** 选择本地图片：校验 -> 本地预览 -> 通过 v-model:cover 通知父组件 */
export function pickFile(payload, file) {
  if (!file) return false
  if (!payload.checkFile(file)) return false

  // 替换旧预览时释放
  if (payload._objectUrl) URL.revokeObjectURL(payload._objectUrl)

  const url = URL.createObjectURL(file)
  payload._objectUrl = url
  payload.fileInfo = { name: file.name, meta: formatBytes(file.size) }
  payload.$emit('update:cover', url)
  return false // 阻止 antd 自动上传
}

/** 移除封面 */
export function removeCover(payload) {
  if (payload._objectUrl) {
    URL.revokeObjectURL(payload._objectUrl)
    payload._objectUrl = ''
  }
  payload.fileInfo = { name: '', meta: '' }
  payload.$emit('update:cover', '')
}

export default { checkFile, pickFile, removeCover }
