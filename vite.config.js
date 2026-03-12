import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Remplace "ia-news-ethique-ecole" par le VRAI nom de ton dépôt GitHub s'il est différent !
  base: '/ia-news-ethique-ecole/' 
})