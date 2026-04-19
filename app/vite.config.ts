import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1/medicos': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/api/v1/pacientes': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})