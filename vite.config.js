import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base must match the repo name for GitHub Pages asset paths.
// Dev server ignores `base` for navigation, so local dev still works at /.
export default defineConfig({
  base: '/vipre-design-system/',
  plugins: [react()],
})
