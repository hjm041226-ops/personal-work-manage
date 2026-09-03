// ============================================================
// 公共请求层（后台组契约 baseURL = /api/v1/admin）
//
// 行为：
//  1. 自动携带 Authorization: Bearer <token>（除 login 外每个请求都需要）
//  2. 解包统一响应 { code, message, data }：成功直接返回 data
//  3. code!==0 或 HTTP 错误 → toast 后端 message 并 reject
//  4. HTTP 401（任意 message）→ 清本地 token、跳登录页
//  5. 上传类 500 且含「文件存储未配置」→ 提示「上传功能暂不可用」
// ============================================================
import axios from 'axios'
import { message } from 'ant-design-vue'
import { getToken, clearSession } from '@/common/utils/auth'
import router from '@/router'

const baseURL = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '') + '/api/v1/admin'

const instance = axios.create({
  baseURL,
  // 60s：兼容 Render 免费实例冷启动（闲置后首个请求可能较慢）
  timeout: 60000,
})

instance.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

let redirectingToLogin = false
function handleUnauthorized(messageText) {
  clearSession()
  if (router.currentRoute.value && router.currentRoute.value.path === '/login') return
  if (redirectingToLogin) return
  redirectingToLogin = true
  const full = window.location.pathname + window.location.search
  router
    .replace({ path: '/login', query: { redirect: full } })
    .catch(() => {})
    .finally(() => {
      redirectingToLogin = false
    })
}

function toastMessage(msg) {
  if (!msg) return
  if (String(msg).includes('文件存储未配置')) {
    message.warning('上传功能暂不可用')
  } else {
    message.error(String(msg))
  }
}

// 成功路径：解包
instance.interceptors.response.use(
  (response) => {
    const envelope = response && response.data
    if (envelope && typeof envelope === 'object' && 'code' in envelope) {
      if (envelope.code === 0) return envelope.data
      toastMessage(envelope.message)
      if (envelope.code === 401 || response.status === 401) handleUnauthorized(envelope.message)
      return Promise.reject(new Error(envelope.message || '操作失败'))
    }
    return envelope
  },
  (error) => {
    const resp = error && error.response
    if (resp) {
      const body = resp.data || {}
      if (resp.status === 401) {
        toastMessage(body.message || '未登录或登录已过期')
        handleUnauthorized(body.message)
        return Promise.reject(new Error(body.message || '未登录或登录已过期'))
      }
      toastMessage(body.message)
      return Promise.reject(new Error(body.message || `请求失败(${resp.status})`))
    }
    if (error && error.code === 'ECONNABORTED') {
      message.error('请求超时，请稍后重试')
    } else {
      message.error('网络异常，请检查网络或稍后重试')
    }
    return Promise.reject(error)
  }
)

export const http = instance
export default instance
