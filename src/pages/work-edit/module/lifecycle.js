// ============================================================
// WorkEdit - 生命周期（统一放这里）
// ============================================================

export default {
  async onMounted(payload) {
    const id = payload.$route.params.id
    payload.loading = true
    try {
      payload.record = await payload.api.fetchWork(id)
      if (!payload.record) {
        payload.$msg.error('未找到该作品，返回作品管理')
        payload.goBack()
      }
    } finally {
      payload.loading = false
    }
  },
}
