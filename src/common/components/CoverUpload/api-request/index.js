// ============================================================
// CoverUpload - 请求函数（契约 C1：POST /api/v1/admin/files/cover）
// ============================================================
import { http } from '@/common/api/request'

/** 封面上传（multipart 字段 file）→ { url, fileName, fileMeta, size, width, height } */
export async function uploadCover(payload, file, onProgress) {
  const form = new FormData()
  form.append('file', file)
  return http.post('/files/cover', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress,
  })
}

export default { uploadCover }
