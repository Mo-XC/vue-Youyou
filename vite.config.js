import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 1. 已移除 WindiCSS 的导入
import vueDevTools from 'vite-plugin-vue-devtools'
import path from "path"

export default defineConfig({
  plugins: [
    vue(), // 2. 确保 vue 插件存在
    vueDevTools(),
    // 3. 已移除 WindiCSS() 插件的调用
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    },
  },
  server: {
    proxy: {
      // 统一代理所有以 /api 开头的请求
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})