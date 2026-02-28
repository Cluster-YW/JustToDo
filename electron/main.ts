import { app, BrowserWindow } from 'electron'
import path from 'path'

// 保持对窗口对象的全局引用，防止被垃圾回收
let mainWindow: BrowserWindow | null = null

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      nodeIntegration: true,  // 允许在渲染进程使用 Node API（开发时方便）
      contextIsolation: false, // 关闭上下文隔离（MVP阶段简化配置）
    },
    // 以下配置先注释掉，下一阶段再开启（现在先验证基础功能）
    // frame: false,           // 无边框（稍后开启）
    // alwaysOnTop: true,      // 置顶（稍后开启）
    // transparent: true,      // 透明（稍后开启）
  })

  // 加载应用
  if (process.env.VITE_DEV_SERVER_URL) {
    // 开发环境：加载 Vite 开发服务器 URL
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    // 打开开发者工具（方便调试）
    mainWindow.webContents.openDevTools()
  } else {
    // 生产环境：加载打包后的 index.html（暂时不会走到这里）
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // 当窗口关闭时触发
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Electron 初始化完成后创建窗口
app.whenReady().then(() => {
  createWindow()
  
  // macOS 特定：点击 Dock 图标时重新创建窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// 所有窗口关闭时退出应用（Windows/Linux）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { // macOS 除外（习惯不同）
    app.quit()
  }
})