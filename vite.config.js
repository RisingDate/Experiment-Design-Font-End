import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 8080, // 运行端口
    open: true,  // 自动打开浏览器
    proxy: {
      '/api': {
        target: "http://localhost:9090/",     //代理的目标地址
        changeOrigin: true,              //是否设置同源，输入是的
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
