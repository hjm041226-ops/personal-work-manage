// ============================================================
// Login - 方法
// ============================================================
import { useUserStore } from '@/store/user'

/** 表单通过校验后触发（a-form @finish） */
export async function submit(payload, values) {
  if (payload.submitting) return
  payload.submitting = true
  try {
    const res = await payload.api.login({
      email: values.email,
      password: values.password,
      remember: !!values.remember,
    })
    // res = { token, user }（契约 A1）
    if (res && res.token) {
      const userStore = useUserStore()
      userStore.setSession({ token: res.token, user: res.user })
      payload.$msg.success('登录成功')
      const redirect = payload.$route.query.redirect
      payload.$router.push(redirect && redirect !== '/login' ? redirect : '/works')
    }
  } catch (e) {
    // 错误提示由请求层统一处理
  } finally {
    payload.submitting = false
  }
}

/** 忘记密码（契约未提供，占位提示） */
export function onForgot(payload) {
  payload.$msg.info('请联系管理员重置密码')
}

export default { submit, onForgot }
