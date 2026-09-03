// ============================================================
// AppShell - 状态（变量）
// ============================================================

export default function createState() {
  return {
    collapsed: false, // 侧边栏折叠（<1024px 自动收起为 0 宽度）
    drawerOpen: false, // 预留：移动端抽屉模式
  }
}
