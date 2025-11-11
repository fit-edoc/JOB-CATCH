import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    open:true,
    
    proxy:"https://c890c6f79182.ngrok-free.app",
    allowedHosts:true
  }
})
