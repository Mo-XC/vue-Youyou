import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from "path"

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    WindiCSS(),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src")
    },
  },
  server: {
    proxy: {
      // 处理登录等认证接口（路径保持不变）
      '/api/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // 不重写，因为后端已经是 /api/auth
      },
      // 处理管理接口（去掉 /api 前缀）
      '/api/admin': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // 去掉开头的 /api
      }
    }
  }
})