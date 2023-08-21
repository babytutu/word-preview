import './hash'

import { fileURLToPath, URL } from 'node:url'
import { execSync } from 'child_process'

import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import eslint from 'vite-plugin-eslint'

// 按需加载组件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import { createHtmlPlugin } from 'vite-plugin-html'

const title = '预览word文件'

// 获取最后一次提交的commitID,处理异常报错
let version
try {
  version = execSync('git rev-parse --short HEAD').toString().replace(/\n/, '')
} catch (e) {
  /* eslint-disable no-console */
  console.warn('Getting revision FAILED. Maybe this is not a git project.')
}

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    eslint(),
    vue({
      // 显式启用，响应性语法糖目前默认是关闭状态，需要你显式选择启用
      reactivityTransform: true,
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('T-'),
        },
      },
    }),
    vueJsx(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    createHtmlPlugin({
      minify: true,
      pages: [
        {
          /**
           * 在这里写entry后，你将不需要在`index.html`内添加 script 标签，原有标签需要删除
           * @default src/main.ts
           */
          entry: 'src/main.ts',
          filename: 'index.html',
          template: 'index.html',
          /**
           * 需要注入 index.html ejs 模版的数据
           */
          injectOptions: {
            data: {
              title,
              version,
              buildTime: new Date().toLocaleString(),
            },
          },
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 9090,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('element-plus')) {
            return 'element'
          }
        },
      },
    },
  },
})
