// ============================================================
// AppShell - 方法（module）
// ============================================================
import { useUserStore } from '@/store/user'

/** 菜单跳转：key 即路由路径 */
export function onMenuClick(payload, { key }) {
  if (key && key !== payload.$route.path) {
    payload.$router.push(key)
  }
}

/** 顶栏用户菜单 */
export function onUserMenuClick(payload, { key }) {
  if (key === 'profile') {
    payload.$router.push('/profile')
  } else if (key === 'logout') {
    const userStore = useUserStore()
    userStore.logout()
    payload.$msg.success('已退出登录')
    payload.$router.push('/login')
  }
}

/** 切换侧边栏折叠（含移动端 0 宽模式） */
export function toggleSider(payload) {
  payload.collapsed = !payload.collapsed
}

export default { onMenuClick, onUserMenuClick, toggleSider }
