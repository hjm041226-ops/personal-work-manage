// ============================================================
// CoverUpload - 状态（变量）
// ============================================================

export default function createState() {
  return {
    fileInfo: { name: '', meta: '' }, // 新选择文件的元信息展示
    uploading: false,
    uploadPercent: 0,
    _objectUrl: '', // 上传前的本地临时预览（成功后替换为服务器 URL）
  }
}
