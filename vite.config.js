import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import vue2 from '@vitejs/plugin-vue2'

// https://vitejs.dev/config/
export default defineConfig({

  plugins: [
    vue2(),
    legacy({
      targets: ['ie >= 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
<<<<<<< HEAD
<<<<<<< HEAD

=======
    // 代理地址
>>>>>>> 3d8160e (表选择、列选择)
=======
    // 代理地址
>>>>>>> c3aee6620285c80bde9626c51042e9bb2965132d
    proxy: {
      '/api': {
        target: 'http://10.16.11.244:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
