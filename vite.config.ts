import { readFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { viteSingleFile } from 'vite-plugin-singlefile'

/**
 * `vite build` → installable PWA in dist/ (used for GitHub Pages).
 * `vite build --mode single` → one self-contained index.html (no service worker),
 *   handy for hosting the demo anywhere a single file can go.
 */
function inlineIconsForSingleFile(): Plugin {
  return {
    name: 'skyloft-inline-icons',
    transformIndexHtml(html) {
      const svg = readFileSync(new URL('./public/favicon.svg', import.meta.url), 'utf8')
      const dataUri = `data:image/svg+xml,${encodeURIComponent(svg)}`
      return html
        .replace(/<link rel="apple-touch-icon"[^>]*>\s*/g, '')
        .replace(/href="favicon\.svg"/, `href="${dataUri}"`)
    },
  }
}

export default defineConfig(({ mode }) => {
  const single = mode === 'single'
  return {
    base: './',
    plugins: [
      react(),
      single
        ? [viteSingleFile(), inlineIconsForSingleFile()]
        : VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
            manifest: {
              name: 'SkyLoft',
              short_name: 'SkyLoft',
              description: "Build your dream loft, blast your music, and visit other passengers' rooms while flying.",
              theme_color: '#0f172a',
              background_color: '#0b1020',
              display: 'standalone',
              orientation: 'portrait',
              scope: './',
              start_url: './',
              icons: [
                { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
                { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
                { src: 'pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
              ],
            },
            workbox: {
              globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
              cleanupOutdatedCaches: true,
              navigateFallback: 'index.html',
              runtimeCaching: [
                {
                  urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
                  handler: 'CacheFirst',
                  options: { cacheName: 'google-fonts', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } },
                },
              ],
            },
          }),
    ],
    server: { port: 5173 },
    build: {
      outDir: single ? 'dist-single' : 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 900,
      rollupOptions: single
        ? undefined
        : {
            output: {
              manualChunks: {
                react: ['react', 'react-dom'],
                konva: ['konva', 'react-konva'],
                motion: ['framer-motion'],
              },
            },
          },
    },
  }
})
