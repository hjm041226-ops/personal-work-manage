import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 读取 .env(.local) 中的 VITE_PROXY_TARGET（代理目标，默认本地 8080）
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.VITE_PROXY_TARGET || 'http://localhost:8080'

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern', // 使用新版 Sass API，避免 legacy-js-api 弃用告警
          // 设计变量全局注入，组件 css 无需手动 import（tokens 文件本身不可再 @use 自身）
          // 注意：sass 不解析 js 别名，这里使用绝对路径
          additionalData:
            '@use "' +
            fileURLToPath(new URL('./src/common/assets/styles/_tokens.scss', import.meta.url)).replace(/\\/g, '/') +
            '" as *;\n',
        },
      },
    },
    server: {
      port: 5174, // 与后端 CORS 默认白名单一致（127.0.0.1:5174）
      host: true,
      open: false,
      proxy: {
        // 开发期把 /api 转发到 Go 后端（契约 baseURL = /api/v1/admin）
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
        '/healthz': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
