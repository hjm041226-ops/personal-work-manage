// ============================================================
// WorksManage - 生命周期（统一放这里）
// ============================================================

export default {
  onMounted(payload) {
    payload.refresh()
  },
  onBeforeUnmount(payload) {
    if (payload._searchTimer) clearTimeout(payload._searchTimer)
  },
}
