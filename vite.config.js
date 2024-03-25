import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  //base:'./',  // <=================新增這行
  plugins: [
    // VueDevTools(),
    vue(),
  
  ],
  build: {
    minify: true,
  },
  base: process.env.NODE_ENV === 'production' ? '/FJU_liff/' : './',

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
