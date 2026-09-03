# ATELIER CMS · 个人作品后台管理系统（Vue3）

由 `个人作品后台管理系统-demo`（HTML 原型 + PRD.md）转换而来，已按《整合接口契约》接入 Go 后端（`/api/v1/admin`）。

## 技术栈

- Vue 3（组合式 API + `<script setup>`）+ Vite 5（dev 端口 **5174**）
- ant-design-vue 4 + @ant-design/icons-vue
- vue-router 4、pinia、dayjs、sass（scss）、axios
- 语言：JavaScript（目录约定均为 `.js`）

## 快速开始（对接真实后端）

```bash
npm install
# 1) 修改 .env（或新建 .env.local 覆盖）：
#    VITE_PROXY_TARGET = 后端地址，默认 http://localhost:8080（契约 §8.1 PORT 默认 8080）
#    VITE_API_BASE     = 留空(同源代理)；生产构建时填后端源，如 https://api.example.com
npm run dev      # http://localhost:5174（后端 CORS 默认白名单包含 127.0.0.1:5174）
npm run build    # 产物输出到 dist/
```

> 登录使用后端管理员账号（契约 A1：`ADMIN_EMAIL` / `ADMIN_PASSWORD`）；首次启动后端会自动种 4 条演示作品（PRJ-0001~0004）。

## 后端对接要点

- baseURL：`/api/v1/admin`（`common/api/request.js` 自动拼 `VITE_API_BASE`）
- 鉴权：登录成功把 `data.token` 存 localStorage；除 login 外所有请求自动带 `Authorization: Bearer <token>`
- 统一响应包裹 `{ code, message, data }`：请求层自动解包，成功直接返回 `data`
- 401 → 清 token 跳登录页；`code !== 0` → toast 后端 message；上传类 500 且 message 含「文件存储未配置」→ 提示上传功能暂不可用
- 接口映射详见「文档」；各页面 api-request 已全部替换为真实请求（不再使用 mock）

## 目录架构（pages + common）

```
src/
├─ main.js / App.vue / router/         # 路由含登录守卫（无 token 跳 /login）
├─ common/
│  ├─ composables/        # 公共逻辑：usePayload（核心）、useFeedback、useDesignTokens
│  ├─ components/         # 公共组件（AppShell、WorkForm、CoverUpload 等，见组件架构）
│  ├─ config/             # 主题令牌（antd ConfigProvider 使用）
│  ├─ api/                # request.js（axios 封装）、assets.js（素材地址）
│  ├─ assets/styles/      # _tokens.scss（设计变量）、global.scss（全局样式）
│  └─ utils/              # format.js、auth.js（token 存取）
├─ store/user.js          # pinia 用户态（token+user 持久化）
└─ pages/                 # 页面：login / works-manage / work-upload / work-edit / profile-edit
```

## 单个组件的目录架构

页面与公共组件都采用如下约定（每个目录均为目录，空目录放占位文件保证可提交）：

```
组件名/
├─ index.vue            # <template> + 装配 payload + <style lang="scss">
├─ api-request/         # 请求函数（axios 调后端接口）
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

## 页面与路由

| 路由 | 页面 | 对接接口 |
|---|---|---|
| `/login` | login | A1 登录 |
| `/` → `/works` | — | — |
| `/works` | works-manage | B1 列表（搜索/分类/分页/计数）+ B5 归档删除 |
| `/works/upload` | work-upload | B3 新建（发布/草稿）+ C1 封面上传 |
| `/works/:id/edit` | work-edit | B2 详情回显 + B4 全字段保存 |
| `/profile` | profile-edit | D1 资料 + D2 保存 + D3 换头像 |
| 顶栏 | AppShell | A2 当前用户 / A3 退出；表单分类下拉：E1 分类字典 |

## 主题与设计变量

- `common/assets/styles/_tokens.scss`：色板 / 字号 / 间距 / 圆角（取自 demo 内联 palette 与 DESIGN.md）。
  经 `vite.config.js` 的 `scss.additionalData` 全局注入，组件 css 直接使用 `$c-*`、`$space-*` 等变量。
- `common/config/themeTokens.js`：同一色板的 antd ConfigProvider 主题令牌（JS 侧单一来源）。

## 待办 / 可优化

- 图片直链来自后端对象存储（`STORAGE_PUBLIC_BASE_URL`）；旧演示外链已移除，仅保留 IMG_FALLBACK 兜底占位。
- antd 全量引入（构建产物偏大），如需优化可改为按需注册或 unplugin-vue-components 自动导入。
- 登录态为 JWT + localStorage；如需刷新 token 机制，可按后端演进补充。

## 文档

- **接口契约（以 Go 后端为准）**：`docs/整合接口契约.md`（全集）、`docs/前端对接契约(后台管理系统).md`（后台组拆分版）
- 早期草案：`docs/后端接口文档.md`（已并入整合契约，仅存档参考）
