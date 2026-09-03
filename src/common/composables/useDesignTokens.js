// ============================================================
// antd 主题装配 composable：返回 a-config-provider 需要的 theme 对象
// ============================================================
import { themeTokens } from '@/common/config/themeTokens'

export function useDesignTokens() {
  return {
    token: themeTokens.token,
    components: themeTokens.components,
  }
}

export default useDesignTokens
