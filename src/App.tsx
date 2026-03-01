import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app-container">
      {/* 自定义标题栏 - 可拖拽区域 */}
      <div className="title-bar">
        <div className="title">我的 Todo</div>
        <div className="window-controls">
          <button className="control-btn close" onClick={() => window.close()}>×</button>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="content">
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
        <p className="read-the-docs">
          这是一个置顶浮动窗口
        </p>
      </div>
    </div>
  )
}

export default App