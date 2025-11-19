import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    open:true,
     port:5173,
    proxy:" https://b9d6875587a9.ngrok-free.app",
    allowedHosts:true
  }
})
