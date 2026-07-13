import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import Icons from 'unplugin-icons/vite'

// base only matters for the GitHub Pages build. Keep dev at "/" so the local
// preview link is clean (http://localhost:5173/).
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/vipre-design-system/' : '/',
  // Dev-only: let Cloudflare quick tunnels reach the dev server for previews.
  server: {
    allowedHosts: ['.trycloudflare.com'],
    // Honor a harness-assigned port (preview tooling) when present.
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
  },
  plugins: [
    react(),
    // Material Symbols via Iconify — only referenced icons get inlined + tree-shaken.
    Icons({ compiler: 'jsx', jsx: 'react' }),
  ],
  resolve: {
    alias: {
      // lucide-react drop-in shim → Material Symbols (Rounded). See src/icons.jsx.
      '@icons': fileURLToPath(new URL('./src/icons.jsx', import.meta.url)),
    },
  },
}))
