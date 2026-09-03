// ============================================================
// 登录态本地存取（契约 §2.1：token 存本地 + user 入 store）
// ============================================================

const TOKEN_KEY = 'atelier_admin_token'
const USER_KEY = 'atelier_admin_user'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || ''
  } catch (e) {
    return ''
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch (e) {
    /* ignore */
  }
}

export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

export function setUser(user) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  } catch (e) {
    /* ignore */
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } catch (e) {
    /* ignore */
  }
}

export default { getToken, setToken, getUser, setUser, clearSession }
