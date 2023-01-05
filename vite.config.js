import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: './'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./resources', import.meta.url)),
      '~': fileURLToPath(new URL('./node_modules', import.meta.url)),
    }
  }
})
