// ============================================================
// Login - 状态（变量）
// ============================================================

export default function createState() {
  return {
    email: '',
    password: '',
    remember: true, // 记住登录状态
    submitting: false,
  }
}
