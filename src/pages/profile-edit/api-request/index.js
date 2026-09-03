// ============================================================
// ProfileEdit - 请求函数（预留；真实资料更新接口待接入）
// ============================================================

export async function updateProfile(payload, data) {
  // TODO: 接入真实资料更新接口
  await new Promise((resolve) => setTimeout(resolve, 400))
  return { ok: true, ...data }
}

export default { updateProfile }
