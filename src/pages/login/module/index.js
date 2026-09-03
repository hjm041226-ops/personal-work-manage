// ============================================================
// Login - 方法
// ============================================================
import { useUserStore } from '@/store/user'

/** 表单通过校验后触发（a-form @finish） */
export async function submit(payload, values) {
  if (payload.submitting) return
  payload.submitting = true
  try {
    const userStore = useUserStore()
    const res = await payload.api.login({
      email: values.email,
      password: values.password,
      remember: values.remember,
    })
    if (res && res.ok) {
      await userStore.login({ email: values.email, remember: values.remember })
      payload.$msg.success('验证成功，正在跳转')
      payload.$router.push('/works')
    } else {
      payload.$msg.error('登录失败，请稍后重试')
    }
  } catch (e) {
    payload.$msg.error('登录失败，请检查账号与密码')
  } finally {
    payload.submitting = false
  }
}

/** 忘记密码（演示占位） */
export function onForgot(payload) {
  payload.$msg.info('请联系管理员重置密码（静态演示）')
}

export default { submit, onForgot }
