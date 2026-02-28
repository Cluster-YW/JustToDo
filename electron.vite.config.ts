import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import path from 'path'

export default defineConfig({
  // 主进程配置（Node.js 环境）
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: 'electron/main.ts',  // 主进程入口
        formats: ['cjs'],           // CommonJS 格式（Node.js 标准）
        fileName: () => '[name].js'
      },
      outDir: 'out/main'            // 主进程构建输出目录
    }
  },
  
  // 预加载脚本配置（安全相关的桥梁代码，暂时不用但先配置上）
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: {
        entry: 'electron/preload.ts',  // 我们稍后创建这个文件
        formats: ['cjs'],
        fileName: () => '[name].js'
      },
      outDir: 'out/preload'
    }
  },
  
  // 渲染进程配置（React 应用，浏览器环境）
  renderer: {
    plugins: [react()],  // 使用 Vite React 插件
    root: '.',           // 项目根目录
    build: {
      outDir: 'out/renderer',  // 渲染进程构建输出目录
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, 'index.html')  // HTML 入口
        }
      }
    }
  }
})