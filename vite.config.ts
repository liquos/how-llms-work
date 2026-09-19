import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// base must match the GitHub Pages sub-path: https://<user>.github.io/<repo>/
export default defineConfig({
  base: '/how-llms-work/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'How LLMs Work',
        short_name: 'How LLMs Work',
        description: 'An interactive course on language models and transformers.',
        theme_color: '#0f1115',
        background_color: '#0f1115',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/how-llms-work/',
        scope: '/how-llms-work/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // every page of the course is cached on first load, so the whole app works offline
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: '/how-llms-work/index.html',
      },
    }),
  ],
})
