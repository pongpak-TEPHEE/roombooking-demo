import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    // Sub-path for GitHub Pages, e.g. VITE_BASE_PATH=/roombooking-demo/
    base: env.VITE_BASE_PATH || '/',
  }
})
