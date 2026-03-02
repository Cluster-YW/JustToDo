import React, { useState } from "react";
import "./App.css";
import useAppStore from "./stores/useAppStore.ts";

function App() {
  const { getSortedTodos, addTodo, toggleTodo, getCompletedCount } = useAppStore();
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
          {sortedTodos.length === 0 ? (
            <div className="empty-tip">No Task Yet</div>
          ) : (
            sortedTodos.map((todo) => (
              <div
                key={todo.id}
                className={`task-item ${todo.completed ? "completed" : ""}`}
                onClick={() => toggleTodo(todo.id)}
              >
                <span className={`checkbox ${todo.completed ? "checked" : ""}`}>
                  <span>{todo.completed ? "✔" : ""}</span>
                </span>
                <span
                  className={`task-title ${todo.completed ? "completed-text" : ""}`}
                >
                  {todo.title}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
