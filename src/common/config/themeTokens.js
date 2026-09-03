// ============================================================
// ATELIER CMS 设计令牌（antd ConfigProvider 使用，与 _tokens.scss 同源）
// ============================================================

export const designColors = {
  bg: '#f8f9ff',
  surface: '#ffffff',
  surfaceLow: '#eff4ff',
  surfaceContainer: '#e5eeff',
  surfaceContainerHigh: '#dce9ff',
  onSurface: '#0b1c30',
  onSurfaceVariant: '#45464d',
  outline: '#76777d',
  outlineVariant: '#c6c6cd',
  primary: '#0f172a', // 深碳灰主按钮（视觉近似 demo 的 #000/#131b2e）
  onPrimary: '#ffffff',
  primaryContainer: '#131b2e',
  secondary: '#0051d5',
  onSecondary: '#ffffff',
  secondaryContainer: '#316bf3',
  error: '#dc2626',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
  ring: '#2563eb',
  divider: '#e2e8f0',
}

export const themeTokens = {
  token: {
    colorPrimary: designColors.primary,
    colorInfo: designColors.secondary,
    colorLink: designColors.ring,
    colorSuccess: '#059669',
    colorWarning: '#d97706',
    colorError: designColors.error,
    colorTextBase: designColors.onSurface,
    colorBgLayout: designColors.bg,
    colorBorder: '#d9e0ea',
    colorBorderSecondary: designColors.divider,
    borderRadius: 8,
    fontSize: 14,
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif",
  },
  components: {
    Layout: {
      headerBg: 'rgba(255,255,255,0.86)',
      headerHeight: 56,
      headerPadding: '0 16px',
      siderBg: designColors.surface,
      bodyBg: designColors.bg,
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: designColors.surfaceContainer,
      itemSelectedColor: designColors.secondary,
      itemColor: designColors.onSurfaceVariant,
      itemHoverColor: designColors.onSurface,
      itemHoverBg: designColors.surfaceLow,
      activeBarBorderWidth: 0,
    },
    Table: {
      headerBg: designColors.surfaceLow,
      headerColor: designColors.onSurfaceVariant,
      rowHoverBg: 'rgba(239,244,255,0.5)',
      borderColor: designColors.divider,
      cellPaddingBlock: 12,
    },
    Button: {
      controlHeight: 36,
      controlHeightLG: 44,
    },
    Input: {
      controlHeight: 36,
    },
  },
}
