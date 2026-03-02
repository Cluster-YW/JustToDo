import { app, BrowserWindow } from "electron";

// 保持对窗口对象的全局引用，防止被垃圾回收
let mainWindow: BrowserWindow | null = null;

function createWindow() {
  console.log("VITE_DEV_SERVER_URL:", process.env.VITE_DEV_SERVER_URL);
  console.log("All env:", process.env);

  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false, // 去掉系统标题栏和边框
    thickFrame: true,
    alwaysOnTop: true, // 置顶显示
    transparent: true, // 允许透明背景（配合 CSS 实现毛玻璃）
    resizable: true, // 允许调整大小（四边可拖拽）
    minimizable: false, // 禁用最小化按钮（符合你的需求）
    maximizable: false, // 禁用最大化按钮（浮动窗口不需要）
    skipTaskbar: false, // 是否隐藏任务栏图标（false = 显示在任务栏）
    webPreferences: {
      nodeIntegration: true, // 允许在渲染进程使用 Node API（开发时方便）
      contextIsolation: false, // 关闭上下文隔离（MVP阶段简化配置）
    },
  });

  // 加载应用
  // 兼容新旧版本 electron-vite
  const devServerUrl =
    process.env.VITE_DEV_SERVER_URL || process.env.ELECTRON_RENDERER_URL;

  if (devServerUrl) {
    console.log("Loading URL:", devServerUrl);
    mainWindow.loadURL(devServerUrl);
    // mainWindow.webContents.openDevTools()
  } else {
    console.log("No dev server URL found");
  }
  //   else {
  //     // 生产环境：加载打包后的 index.html（暂时不会走到这里）
  //     mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  //   }

  // 关键修改：窗口关闭时立即强制退出整个应用
  mainWindow.on('close', () => {
    // 不等待，直接杀死进程
    app.exit(0)
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Electron 初始化完成后创建窗口
app.whenReady().then(() => {
  createWindow();

  // macOS 特定：点击 Dock 图标时重新创建窗口
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 所有窗口关闭时退出应用（Windows/Linux）
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    // macOS 除外（习惯不同）
    app.quit();
  }
});
