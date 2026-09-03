// ============================================================
// WorkUpload - 请求函数（预留；发布接口待接入）
// ============================================================

export async function createWork(payload, data) {
  // TODO: 接入真实发布接口
  await new Promise((resolve) => setTimeout(resolve, 400))
  return { ok: true, id: data && data.workId }
}

export default { createWork }
