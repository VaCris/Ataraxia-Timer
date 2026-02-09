import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'sounds/*.mp3'],
      manifest: {
        name: 'Ataraxia Timer',
        short_name: 'Ataraxia',
        description: 'Focus timer with Spotify integration and offline support',
        theme_color: '#8b5cf6',
        background_color: '#050505',
        display: 'standalone',
        icons: [
          {
            src: 'Logo_SN_紫.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'Logo_SN_紫2.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        navigateFallbackDenylist: [/^\/api/],
      }
    })
  ],
  server: {
    host: '127.0.0.1',
    port: 5173
  }
})