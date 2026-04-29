import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { homedir } from 'node:os'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

// Eduzz Design System tokens — populated by `pnpm sync-tokens`
const designTokensSrc = resolve(homedir(), '.design-tokens-cache/src')

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/checkout-sun-novo-admin/',
  resolve: {
    alias: {
      '@eduzz/design-tokens': designTokensSrc,
      // Force antd to resolve from this project's node_modules even when imported from external sources
      antd: resolve(projectRoot, 'node_modules/antd'),
    },
    dedupe: ['react', 'react-dom', 'antd'],
  },
})
