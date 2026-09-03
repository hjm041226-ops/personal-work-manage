import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
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
    port: 5173,
    host: true,
    open: false,
  },
})
