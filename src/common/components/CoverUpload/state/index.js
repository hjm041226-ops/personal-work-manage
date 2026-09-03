// ============================================================
// CoverUpload - 状态（变量）
// ============================================================

export default function createState() {
  return {
    // 新选择文件的本地元信息（覆盖 props.fileName/meta 的展示）
    fileInfo: { name: '', meta: '' },
    _objectUrl: '', // 本地预览 URL（卸载时 revoke）
  }
}
