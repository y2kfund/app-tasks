import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      plugins: [vue(), dts({ rollupTypes: true })],
      build: {
        outDir: 'dist',
        lib: {
          entry: './src/index.ts',
          name: 'Tasks',
          formats: ['es'],
          fileName: 'index'
        },
        rollupOptions: {
          external: ['vue', '@y2kfund/core', '@tanstack/vue-query'],
          output: {
            globals: {
              vue: 'Vue',
              '@y2kfund/core': 'Y2kfundCore',
              '@tanstack/vue-query': 'VueQuery'
            }
          }
        }
      }
    }
  }

  // Development mode
  return {
    plugins: [vue()],
    server: { 
      port: 5104,
      open: true 
    },
    root: '.',
    build: {
      outDir: 'dev-dist'
    }
  }
})