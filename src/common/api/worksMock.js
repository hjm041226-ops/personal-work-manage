// ============================================================
// 作品静态 mock 数据层（一期无真实接口；后续由 api-request 替换）
// 结构对齐 demo：分类胶囊 web/app/desktop/others + 表格列字段
// 共 24 条（4 真实示例 + 20 生成），ID 全局唯一、数据确定性
// ============================================================
import {
  IMG_COVER_NOVA,
  IMG_COVER_KOMOREBI,
  IMG_COVER_ETHEREAL,
  IMG_COVER_PRISM,
  IMG_COVER_NOVA_MASTER,
} from './assets'

export const CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'web', label: 'web' },
  { key: 'app', label: 'app' },
  { key: 'desktop', label: 'desktop' },
  { key: 'others', label: 'others' },
]

// 真实示例（取自 demo 表格）
const realWorks = [
  {
    id: 'PRJ-8821',
    title: 'Nova 智能车机视觉系统',
    sub: 'UI/UX 设计 · Smart Cockpit',
    category: 'desktop',
    date: '2024-03-15',
    status: 'published',
    views: 1420,
    cover: IMG_COVER_NOVA,
    // ---- 编辑页回显字段（Nova 演示数据最完整） ----
    coverFileUrl: IMG_COVER_NOVA_MASTER,
    coverFile: 'nova-cover-master.png',
    coverMeta: '2.4 MB · 1920x1080 px',
    url: 'nova-hmi.atelier.io',
    repo: 'github.com/atelier-studio/nova-hmi',
    desc: `## 项目背景与愿景
Nova 旨在为下一代智能电动汽车打造极致沉浸且安全的车机视觉系统。通过极简的设计语言与高效的信息层级规划，减少驾驶者的认知负荷。

### 核心挑战
1. 多源异构数据的实时渲染性能
2. 夜间驾驶环境下的护眼色彩模式
3. 极端天气下的盲区视觉提示优化`,
    tags: ['HMI Design', 'Automotive', 'UI/UX'],
    published: true,
    featured: true,
  },
  {
    id: 'PRJ-8815',
    title: 'Komorebi 建筑设计事务所品牌重塑',
    sub: '品牌视觉 · Visual Identity',
    category: 'web',
    date: '2024-02-28',
    status: 'published',
    views: 980,
    cover: IMG_COVER_KOMOREBI,
  },
  {
    id: 'PRJ-8809',
    title: 'Ethereal 3D 实验性网页交互体验',
    sub: '动态与三维 · WebGL Interactive',
    category: 'web',
    date: '2024-02-10',
    status: 'draft',
    views: 420,
    cover: IMG_COVER_ETHEREAL,
  },
  {
    id: 'PRJ-8802',
    title: 'Prism 个人知识库移动端应用',
    sub: 'UI/UX 设计 · iOS Productivity',
    category: 'app',
    date: '2024-01-18',
    status: 'published',
    views: 2310,
    cover: IMG_COVER_PRISM,
  },
]

// 各分类名称/副标题池（其余数量用于补齐 24 条，模拟真实检索场景）
const bank = {
  web: {
    titles: [
      'Nordwind 品牌官网重构',
      'Lumen 数据可视化门户',
      'Halo 个人作品站改版',
      'Polis 社区活动专题页',
      'Atlas 电商体验升级',
      'Meridian 内容平台改版',
      'Rift 国际站多语言方案',
      'Cedar 设计系统官网',
    ],
    subs: [
      '界面设计 · Brand Site',
      '数据可视化 · Web App',
      '网页设计 · Portfolio',
      '活动专题 · Campaign',
      '电商体验 · E-commerce',
      '产品设计 · Web Platform',
      '体验设计 · Globalization',
      '前端工程 · Design System',
    ],
  },
  app: {
    titles: [
      'Tide 协作效率工具',
      'Bloom 健康管理应用',
      'Orbit 出行助手',
      'Muse 灵感记录 App',
      'Harbor 金融记账应用',
      'Pulse 运动社区',
      'Flock 团队沟通应用',
    ],
    subs: [
      'UI/UX 设计 · SaaS Mobile',
      '产品设计 · Health',
      '交互设计 · Travel',
      'UI 设计 · iOS',
      '体验设计 · FinTech',
      '交互设计 · Social',
      '产品设计 · Collaboration',
    ],
  },
  desktop: {
    titles: ['Aero 桌面设计工具集', 'Studio One 音频工作站界面', 'Signal 监控大屏系统', 'Forge 3D 资产管线工具'],
    subs: ['桌面软件 · Design Tool', '桌面软件 · Audio', '大屏系统 · Dashboard', '工具设计 · DCC Tooling'],
  },
  others: {
    titles: ['Kinetic 动态海报实验', 'Noir 字体排印研究', 'Chroma 装置艺术视觉', 'Relay 线下展览视觉'],
    subs: ['动态设计 · Motion', '平面设计 · Typography', '视觉艺术 · Installation', '展览视觉 · Exhibition'],
  },
}

// 每个分类“需补齐”的数量（含真实条数后总计：web 8 / app 7 / desktop 5 / others 4）
const fillCount = { web: 6, app: 6, desktop: 4, others: 4 }
const COVERS = [IMG_COVER_NOVA_MASTER, IMG_COVER_KOMOREBI, IMG_COVER_ETHEREAL, IMG_COVER_PRISM]

/** 生成序号 -> 倒退月份的日期 */
function shiftMonth(year, month, back) {
  while (back > 0) {
    month -= 1
    if (month === 0) {
      month = 12
      year -= 1
    }
    back -= 1
  }
  return { year, month }
}

/** 生成补齐数据：ID 使用 8855 起向下的独立区间，避免与真实 ID 冲突 */
const GEN_ID_TOP = 8855
function buildCategory(key) {
  const b = bank[key]
  const list = []
  for (let i = 0; i < fillCount[key]; i++) {
    const j = i % b.titles.length
    const seq = ++buildCategory._seq // 全局序号（20 条内唯一）
    const d = shiftMonth(2024, 2, seq) // 从 2024-02 向前推
    list.push({
      id: `PRJ-${GEN_ID_TOP - (seq - 1)}`,
      title: b.titles[j],
      sub: b.subs[j],
      category: key,
      date: `${d.year}-${String(d.month).padStart(2, '0')}-${String(2 + ((seq * 5) % 24)).padStart(2, '0')}`,
      status: seq % 5 === 3 ? 'draft' : 'published',
      views: 260 + ((seq * 173) % 2600),
      cover: COVERS[seq % COVERS.length],
    })
  }
  return list
}
buildCategory._seq = 0

const generatedWorks = [
  ...buildCategory('web'),
  ...buildCategory('app'),
  ...buildCategory('desktop'),
  ...buildCategory('others'),
]

// 24 条：4 真实 + 20 生成
const allWorks = [...realWorks, ...generatedWorks]

export function getWorks() {
  return [...allWorks]
}

export function getWorkById(id) {
  return allWorks.find((w) => w.id === id) || null
}

/** 本地过滤（关键词 + 分类），供 module 使用；真实环境改由后端查询 */
export function filterWorks(list, { keyword = '', category = 'all' } = {}) {
  const kw = String(keyword).trim().toLowerCase()
  return list.filter((w) => {
    const inCat = category === 'all' || w.category === category
    const hitKw =
      !kw ||
      w.title.toLowerCase().includes(kw) ||
      w.sub.toLowerCase().includes(kw) ||
      (w.tags || []).some((t) => t.toLowerCase().includes(kw))
    return inCat && hitKw
  })
}

export default { CATEGORIES, getWorks, getWorkById, filterWorks }
