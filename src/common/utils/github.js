// ============================================================
// GitHub 公开仓库导入辅助(仅公开仓库,匿名 API,无需 token)
//
// 说明:
//  - 直连 github.com 公开 REST API,不经过后端,不携带任何凭据;
//  - 匿名接口限流 60 次/小时/IP;需要导入私有仓库时,应改为
//    后端代理接口 + GitHub PAT 的方案(本文件只支持公开仓库);
//  - 本工具只服务上传页「从 GitHub 导入」,与后端接口契约无关。
// ============================================================

// 要列出公开仓库的账号(想换账号时改这里即可)
export const GITHUB_OWNER = 'hjm041226-ops'

// GitHub 匿名请求强制要求带 User-Agent
const GITHUB_API = 'https://api.github.com'
const UA = 'portfolio-cms-web'

// 仓库没有可用封面时使用的占位图(已上传到自有 OSS,公网可访问;
// 以后想换默认占位图,只需替换这个 URL)
export const COVER_PLACEHOLDER_URL =
  'https://personalworkshow.oss-cn-beijing.aliyuncs.com/uploads/cover/2026/09/88e66a5b3ef3d11721d6051e.png'

// 可当封面的位图扩展(排除 svg/data URI/徽章,避免把 README 顶部的
// 状态徽章当成封面)
const RASTER_RE = /\.(png|jpe?g|gif|webp|avif)(?:[?#].*)?$/i
const BADGE_HOST_RE =
  /(shields\.io|img\.shields|badgen\.net|flat\.badgen|codecov\.io|coveralls\.io|codacy\.com)/i

/** 简化仓库对象:只保留导入需要展示/回填的字段 */
function slimRepo(r) {
  return {
    name: r.name,
    fullName: r.full_name,
    htmlUrl: r.html_url,
    description: r.description || '',
    homepage: r.homepage || '',
    language: r.language || '',
    topics: Array.isArray(r.topics) ? r.topics.slice(0, 8) : [],
    defaultBranch: r.default_branch || 'main',
    pushedAt: r.pushed_at || '',
  }
}

/** 尝试从非 2xx 响应里读出 GitHub 的错误文案 */
async function readErrMessage(resp) {
  try {
    const j = await resp.json()
    return (j && j.message) || ''
  } catch (e) {
    return ''
  }
}

/** GitHub 请求统一封装:非 2xx 抛中文可读错误(限流/网络单独提示) */
async function githubFetch(path, accept = 'application/vnd.github+json') {
  let resp
  try {
    resp = await fetch(`${GITHUB_API}${path}`, {
      headers: { 'User-Agent': UA, Accept: accept },
    })
  } catch (e) {
    throw new Error('无法连接 GitHub,请检查网络后重试')
  }
  if (!resp.ok) {
    // README 404 = 该仓库没有 README,调用方按“空描述”处理
    if (accept === 'application/vnd.github.raw' && resp.status === 404) return ''
    const msg = await readErrMessage(resp)
    if (/rate limit/i.test(msg)) {
      throw new Error('GitHub 匿名接口限流(60 次/小时),请稍后再试')
    }
    if (resp.status === 404) {
      throw new Error('GitHub 上找不到对应内容(账号或仓库不存在)')
    }
    throw new Error(`GitHub 请求失败(HTTP ${resp.status})`)
  }
  if (accept === 'application/vnd.github.raw') return resp.text()
  return resp.json()
}

/**
 * 列出账号下可导入的公开仓库:
 * 自动排除 fork、已归档与私有仓库,按最近推送时间排序。
 */
export async function listPublicRepos(owner = GITHUB_OWNER) {
  const path = `/users/${encodeURIComponent(owner)}/repos?type=owner&sort=updated&per_page=100`
  const list = await githubFetch(path)
  if (!Array.isArray(list)) return []
  return list
    .filter((r) => r && !r.fork && !r.archived && r.private !== true)
    .map(slimRepo)
}

/** 拉取仓库 README 的 Markdown 原文;没有 README 时返回空串 */
export async function fetchReadme(owner, repo, branch = 'main') {
  const path = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`
  const md = await githubFetch(path, 'application/vnd.github.raw')
  return typeof md === 'string' ? md : ''
}

/** 把 README 里的图片地址转成可直接访问的 http(s) URL(处理相对路径 / blob 链接) */
function normalizeImageSrc(src, owner, repo, branch) {
  const s = (src || '').trim()
  if (!s || s.startsWith('data:')) return ''
  // 已是绝对地址:github 的 blob 页面链接转 raw
  if (/^https?:\/\//i.test(s)) {
    const m = s.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/i)
    if (m) return `https://raw.githubusercontent.com/${m[1]}/${m[2]}/${m[3]}`
    return s
  }
  // 相对路径 → 相对仓库根解析到 raw.githubusercontent.com
  const clean = s.replace(/^\.\//, '').replace(/^\/+/, '').split('#')[0].split('?')[0]
  if (!clean) return ''
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${clean}`
}

/**
 * 从 README Markdown 里挑第一张“像封面”的位图 URL
 * (跳过徽章 / svg / data URI / 装饰性图标),找不到返回空串。
 */
export function pickCoverFromReadme(md, owner, repo, branch = 'main') {
  if (!md) return ''
  const candidates = []
  // Markdown 图片:![alt](url)
  const mdRe = /!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
  let m
  while ((m = mdRe.exec(md))) candidates.push(m[1])
  // HTML 图片:<img src="url">
  const imgRe = /<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi
  while ((m = imgRe.exec(md))) candidates.push(m[1])

  for (const src of candidates) {
    const url = normalizeImageSrc(src, owner, repo, branch)
    if (!url) continue
    if (BADGE_HOST_RE.test(url)) continue
    if (RASTER_RE.test(url)) return url
  }
  return ''
}
