import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import "./App.css";
import { TaskItem } from "./components/TaskItem.tsx";
import useAppStore from "./stores/useAppStore.ts";

function App() {
  const { getSortedTodos, addTodo, getCompletedCount } =
    useAppStore();
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim() === "") return;
    addTodo(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  const sortedTodos = getSortedTodos();

  return (
    <div className="app-container">
      {/* 自定义标题栏 - 可拖拽区域 */}
      <div className="title-bar">
        <div className="title">我的 Todo</div>
        <div className="window-controls">
          <button className="control-btn close" onClick={() => window.close()}>
            ×
          </button>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="content">
        <div className="input-area">
          <input
            type="text"
            placeholder="Input New Task..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="task-input"
          />

          <button onClick={handleAdd} className="add-btn">
            Add
          </button>
        </div>

        <div className="task-count-area">
          <span className="task-count">
            {sortedTodos.length - getCompletedCount()}/{sortedTodos.length}
          </span>
        </div>

        <div className="task-list">
          <AnimatePresence mode="popLayout">
            {sortedTodos.map((todo) => (
              <TaskItem key={todo.id} todo={todo} /> // 使用新组件
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;
