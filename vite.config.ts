import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  // Fix lỗi đường dẫn trên GitHub Pages - KHÔNG ĐƯỢC XÓA DÒNG NÀY
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

  build: {
    // Tăng giới hạn cảnh báo dung lượng file
    chunkSizeWarningLimit: 2000,
    // Đảm bảo asset được build ra đúng thư mục
    outDir: 'dist',
    assetsDir: 'assets',
  }
})