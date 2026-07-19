import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base:'./',  // <=================新增這行
  server: {
    host: true,
    // 測試環境經 Cloudflare Tunnel 存取 dev server
    allowedHosts: ['fjuliff.billxu.net'],
    hmr: { host: 'fjuliff.billxu.net', protocol: 'wss', clientPort: 443 },
  },
  plugins: [
    // VueDevTools(),
    vue(),
  
  ],
  build: {
    minify: true,
  },
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})
