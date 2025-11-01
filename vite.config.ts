import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000' // Opsi untuk pengembangan lokal jika Anda ingin menjalankan fungsi Vercel secara lokal.
    }
  }
})
