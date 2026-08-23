import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import scopeModuleCss from './scripts/vite-plugin-scope-module-css.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [scopeModuleCss(), react()],
})
