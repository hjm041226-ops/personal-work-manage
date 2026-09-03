// ============================================================
// Login - 请求函数（静态期 mock，后续替换为真实登录接口）
// ============================================================

const MOCK_LATENCY = 1200

export async function login(payload, { email, password, remember } = {}) {
  // TODO: 接入真实鉴权接口
  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY))
  return { ok: true, token: 'mock-token', email, remember }
}

export default { login }
