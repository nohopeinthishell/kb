import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: Number(process.env.CLIENT_PORT) || 3000,
    proxy: {
      '/api/course': {
        target: 'https://ya-praktikum.tech',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/course/, '/api/v2'),
        cookieDomainRewrite: '',
      },
      '/api/app': {
        target: 'http://localhost:3001',
        rewrite: path => path.replace(/^\/api\/app/, '/app'),
      },
    },
  },

  define: {
    __EXTERNAL_SERVER_URL__: JSON.stringify(
      process.env.EXTERNAL_SERVER_URL || 'http://localhost:3001'
    ),
    __INTERNAL_SERVER_URL__: JSON.stringify(
      process.env.INTERNAL_SERVER_URL || 'http://localhost:3001'
    ),
  },
  build: {
    outDir: path.join(__dirname, 'dist/client'),
  },
  ssr: {
    format: 'cjs',
    noExternal: ['styled-components'],
  },
  plugins: [react()],
})
