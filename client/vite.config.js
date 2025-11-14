import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    open:true,
    
    proxy:" https://492a7b8c794c.ngrok-free.app",
    allowedHosts:true
  }
})
