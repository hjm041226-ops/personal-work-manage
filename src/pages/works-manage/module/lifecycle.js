// ============================================================
// WorksManage - 生命周期（统一放这里）
// ============================================================

export default {
  async onMounted(payload) {
    payload.loading = true
    try {
      payload.list = await payload.api.fetchWorks()
      payload.computeCounts()
      payload.applyFilter()
    } finally {
      payload.loading = false
    }
  },
}
