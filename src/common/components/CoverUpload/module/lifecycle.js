// ============================================================
// CoverUpload - 生命周期（统一放这里）
// ============================================================

export default {
  onBeforeUnmount(payload) {
    // 释放本地预览 URL，避免内存泄漏
    if (payload._objectUrl) {
      URL.revokeObjectURL(payload._objectUrl)
      payload._objectUrl = ''
    }
  },
}
