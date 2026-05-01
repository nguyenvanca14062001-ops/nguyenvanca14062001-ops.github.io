import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  // PHẢI CÓ ĐỦ DẤU / Ở ĐẦU VÀ CUỐI NHƯ NÀY
  base: 'nguyenvanca14062001-ops/', 
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
    chunkSizeWarningLimit: 2000,
    outDir: 'dist',
    assetsDir: 'assets',
  }
})