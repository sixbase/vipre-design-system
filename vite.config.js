import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base only matters for the GitHub Pages build. Keep dev at "/" so the local
// preview link is clean (http://localhost:5173/).
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/vipre-design-system/' : '/',
  plugins: [react()],
}))
