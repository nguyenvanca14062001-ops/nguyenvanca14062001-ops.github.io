import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  // SỬA CHỖ NÀY: Vì domain của mày đã có tên repo, nên base chỉ để là '/'
  base: '/', 
  
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