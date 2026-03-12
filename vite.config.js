import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Remplacez 'ia-news-ethique-ecole' par le nom EXACT de votre dépôt GitHub
  base: '/ia-news-ethique-ecole/', 
})