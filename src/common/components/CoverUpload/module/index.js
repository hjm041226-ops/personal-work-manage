// ============================================================
// CoverUpload - 方法（契约 C1 真实上传）
// ============================================================

/** 规格校验（PNG/WEBP/JPG，≤20MB，与契约 C1 一致） */
export function checkFile(payload, file) {
  const okType = ['image/png', 'image/jpeg', 'image/webp'].includes(file.type)
  if (!okType) {
    payload.$msg.error('仅支持 PNG / WEBP / JPG 格式')
    return false
  }
  if (file.size > 20 * 1024 * 1024) {
    payload.$msg.error('文件过大，封面最大 20MB')
    return false
  }
  return true
}

/** antd before-upload：本地校验，通过才进入 customRequest 上传 */
export function beforeUpload(payload, file) {
  return payload.checkFile(file)
}

/** antd custom-request：真实上传 C1；成功后回填 url/fileName/fileMeta */
export async function customRequest(payload, { file, onSuccess, onError } = {}) {
  if (!file) return
  const prevCover = (payload.$props && payload.$props.cover) || '' // 失败时回滚
  payload.uploading = true
  payload.uploadPercent = 0

  // 先本地预览（响应快），成功后切换为服务器 URL
  if (payload._objectUrl) URL.revokeObjectURL(payload._objectUrl)
  const previewUrl = URL.createObjectURL(file)
  payload._objectUrl = previewUrl
  payload.$emit('update:cover', previewUrl)

  try {
    const res = await payload.api.uploadCover(file, (evt) => {
      if (evt && evt.total) {
        payload.uploadPercent = Math.round((evt.loaded / evt.total) * 100)
      }
    })
    // res = { url, fileName, fileMeta, size, width, height }
    if (payload._objectUrl) {
      URL.revokeObjectURL(payload._objectUrl)
      payload._objectUrl = ''
    }
    const url = (res && res.url) || ''
    const fileName = (res && res.fileName) || file.name
    const meta = (res && res.fileMeta) || ''
    payload.fileInfo = { name: fileName, meta }
    payload.$emit('update:cover', url)
    payload.$emit('change', { url, fileName, meta })
    if (onSuccess) onSuccess(res)
  } catch (e) {
    // 请求层已统一 toast（含「文件存储未配置」-> 上传功能暂不可用）
    if (payload._objectUrl) {
      URL.revokeObjectURL(payload._objectUrl)
      payload._objectUrl = ''
    }
    payload.fileInfo = { name: '', meta: '' }
    payload.$emit('update:cover', prevCover) // 回滚原封面
    if (onError) onError(e)
  } finally {
    payload.uploading = false
  }
}

/** 移除封面：清空表单并通知父组件 */
export function removeCover(payload) {
  if (payload._objectUrl) {
    URL.revokeObjectURL(payload._objectUrl)
    payload._objectUrl = ''
  }
  payload.fileInfo = { name: '', meta: '' }
  payload.uploadPercent = 0
  payload.$emit('update:cover', '')
  payload.$emit('change', { url: '', fileName: '', meta: '' })
}

export default { checkFile, beforeUpload, customRequest, removeCover }
