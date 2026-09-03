# ATELIER CMS · 个人作品后台管理系统（Vue3）

由 `个人作品后台管理系统-demo`（HTML 原型 + PRD.md）转换而来的 Vue3 前端工程。

## 技术栈

- Vue 3（组合式 API + `<script setup>`）+ Vite 5
- ant-design-vue 4 + @ant-design/icons-vue
- vue-router 4、pinia、dayjs、sass（scss）
- 语言：JavaScript（目录约定均为 `.js`）

## 快速开始

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 产物输出到 dist/
```

> 演示账号任意邮箱 + 密码即可登录（静态期无真实校验）。

## 目录架构（pages + common）

```
src/
├─ main.js / App.vue / router/
├─ common/
│  ├─ composables/        # 公共逻辑：usePayload（核心）、useFeedback、useDesignTokens
│  ├─ components/         # 公共组件（AppShell、WorkForm、CoverUpload 等，见组件架构）
│  ├─ config/             # 主题令牌（antd ConfigProvider 使用）
│  ├─ api/                # 静态数据层：assets.js（素材地址）、worksMock.js（24 条作品）
│  ├─ assets/styles/      # _tokens.scss（设计变量）、global.scss（全局样式）
│  └─ utils/              # format.js（日期/数字格式化）
├─ store/user.js          # pinia 用户态（静态）
└─ pages/                 # 页面：login / works-manage / work-upload / work-edit / profile-edit
```

## 单个组件的目录架构

页面与公共组件都采用如下约定（每个目录均为目录，空目录放占位文件保证可提交）：

```
组件名/
├─ index.vue            # <template> + 装配 payload + <style lang="scss">
├─ api-request/         # 请求函数（暂返回 mock / Promise，留 TODO）
├─ asserblem/           # 装配：把 state/module/api 聚合后交给 usePayload
├─ components/          # 子组件（同样结构）
├─ module/              # 组件的方法
│  ├─ index.js
│  └─ lifecycle.js      # ★ 生命周期函数统一放这里（组件内不再写 onMounted 等）
├─ state/               # 组件的变量（导出 createState() => 响应式数据）
└─ css/                 # 组件样式（scss，index.scss 入口）
```

## 核心机制：usePayload（公共方法）

`common/composables/usePayload.js` 负责**把变量与方法集成到 payload**，并**自动装配**：

1. `state()` 产出组件私有变量 → `payload` 本身即是响应式变量集合；
2. `api-request` 中的函数 `fn(payload, ...args)` 自动包装为 `payload.api.xxx(...args)`；
3. `module` 中的方法自动包装为 `payload.xxx(...args)`；
4. `module/lifecycle.js` 里声明的 Vue 钩子（签名 `(payload)`）自动注册；
5. 注入公共能力：`payload.$msg`（antd message/confirm 封装）、`$router`、`$route`，
   子组件可选 `payload.$props / $emit`（装配时通过 context 透传）。

因此组件内方法不需要手动 import 请求模块或生命周期注册，全部默认装配进 payload。

示例（作品管理页）：

```js
// api-request/index.js
export const fetchWorks = async (p) => getWorks()          // 自动挂为 p.api.fetchWorks

// module/lifecycle.js
export default { onMounted: async (p) => { p.list = await p.api.fetchWorks() } }

// module/index.js
export const applyFilter = (p) => { /* 本地过滤 + 分页 */ }  // 自动挂为 p.applyFilter

// index.vue（index 只做装配）
const payload = assemble()                                   // 模板直接使用 payload.list / payload.applyFilter()
```

## 页面与路由

| 路由 | 页面 | 说明 |
|---|---|---|
| `/login` | login | 独立整屏登录 |
| `/` → `/works` | — | 后台入口 |
| `/works` | works-manage | 作品管理（检索/分类/分页/快捷操作） |
| `/works/upload` | work-upload | 上传新作品 |
| `/works/:id/edit` | work-edit | 编辑作品（从列表进入，静态取 mock 数据） |
| `/profile` | profile-edit | 个人资料编辑 |

## 主题与设计变量

- `common/assets/styles/_tokens.scss`：色板 / 字号 / 间距 / 圆角（取自 demo 内联 palette 与 DESIGN.md）。
  经 `vite.config.js` 的 `scss.additionalData` 全局注入，组件 css 直接使用 `$c-*`、`$space-*` 等变量，无需手动 import。
- `common/config/themeTokens.js`：同一色板的 antd ConfigProvider 主题令牌（JS 侧单一来源）。

## 后续优化（一期已完成项）

- 全部页面为静态实现，`api-request/` 目录已按真实接口签名预留（TODO 标注），二期只需替换 mock 为真实请求。
- 图片地址来自 demo 的外链 Google 图床，离线时由 IMG_FALLBACK 兜底占位。
- antd 全量引入（构建产物偏大），如需优化可改为按需注册或 unplugin-vue-components 自动导入。

## 文档

- 后端接口契约（面向 Go 后端开发）：`docs/后端接口文档.md` —— 数据模型 / 接口清单 / 响应示例 / 错误码 / 前端字段对照 / Go 落地建议
