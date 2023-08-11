import { defineConfig } from 'vite'
import crx from 'vite-plugin-crx-mv3'

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      crx.default({
        manifest: './src/manifest.json'
      })
    ],
    build: {
      outDir: 'build/dist',
      emptyOutDir: mode === 'production'
    }
  }
})
