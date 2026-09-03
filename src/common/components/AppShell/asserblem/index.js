// ============================================================
// AppShell - 装配：聚合 state/module/api 到 payload
// ============================================================
import usePayload from '@/common/composables/usePayload'
import createState from '../state'
import module from '../module'
import api from '../api-request'

/**
 * 组装 AppShell 的 payload
 * 额外计算属性：当前菜单选中项、页面标题由路由派生
 */
export default function assemble() {
  return usePayload({
    state: createState,
    module,
    api,
    computedMap: {
      selectedKeys: (p) => {
        const path = p.$route.path
        if (path === '/works/upload') return ['/works/upload']
        if (path.startsWith('/works')) return ['/works'] // 作品管理 / 编辑 / 详情
        return []
      },
      pageTitle: (p) => p.$route.meta?.title || '',
    },
  })
}
