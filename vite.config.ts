import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  // THAY 'ten-repo-cua-may' bằng tên thư mục dự án trên GitHub của mày
  // Ví dụ link là github.com/nguyenvanca/mmo-pro thì để là '/mmo-pro/'
  base: '/nguyenvanca14062001-ops/', 
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // Thêm cái này để lúc build nó không quét lỗi lung tung làm đỏ Actions
  build: {
    chunkSizeWarningLimit: 1600,
  }
})