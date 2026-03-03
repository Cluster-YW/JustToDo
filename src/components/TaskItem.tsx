import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  addonRegistry,
  addonTypeList,
  type RegisteredAddonType,
} from "../addons/registry";
import type { Addon } from "../addons/types";
import useAppStore from "../stores/useAppStore";

interface TaskItemProps {
  todo: {
    id: string;
    title: string;
    completed: boolean;
    createdAt: number;
    addons: Addon[];
  };
}

// export component with an argument of todo
export const TaskItem = ({ todo }: TaskItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);

  const [showAddonSelector, setShowAddonSelector] = useState(false);

  const {
    toggleTodo,
    deleteTodo,
    updateTodoTitle,
    addAddon,
    updateAddon,
    removeAddon,
  } = useAppStore();

  const enterEditMode = () => {
    setEditTitle(todo.title);
    setIsEditing(true);
    setIsDeleteConfirming(false);
    setShowAddonSelector(false);
  };

  const handleSave = () => {
    if (editTitle.trim() === "") return;
    updateTodoTitle(todo.id, editTitle.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
    setIsDeleteConfirming(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isDeleteConfirming) {
      deleteTodo(todo.id);
    } else {
      setIsDeleteConfirming(true);
      // cancel confirming after 3 seconds
      setTimeout(() => setIsDeleteConfirming(false), 3000);
    }
  };

  const handleAddAddon = (type: RegisteredAddonType) => {
    addAddon(todo.id, type);
    setShowAddonSelector(false);
  };

  const handleUpdateAddon = (addonId: string, newData: Addon) => {
    updateAddon(todo.id, addonId, newData);
  };

  const handleRemoveAddon = (addonId: string) => {
    removeAddon(todo.id, addonId);
  };

  useEffect(() => {
    if (!isEditing) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (itemRef.current && !itemRef.current.contains(event.target as Node)) {
        handleCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  return (
    <motion.div
      key={todo.id}
      ref={itemRef}
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: todo.completed ? 0.6 : 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`task-item ${todo.completed ? "completed" : ""} ${isEditing ? "editing" : ""}`}
    >
      {isEditing ? (
        <>
          <span className="checkbox disabled" style={{ opacity: 0.3 }}>
            {todo.completed ? "✔" : " "}
          </span>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            className="edit-input"
            autoFocus
          />
          <button
            className={`delete-btn ${isDeleteConfirming ? "confirming" : ""}`}
            onClick={handleDeleteClick}
            type="button"
          >
            {isDeleteConfirming ? "确认删除?" : "🗑️"}
          </button>

          <div className="edit-actions">
            <button
              className="save-btn"
              onClick={handleSave}
              disabled={editTitle.trim() === ""}
            >
              ✓
            </button>
          </div>

          <div className="addon-edit-panel">
            {/* 已挂载的 Addon 编辑器 */}
            {todo.addons.map((addon) => {
              const meta = addonRegistry[addon.type];
              const Component = meta.component;
              return (
                <div key={addon.id} className="addon-edit-item">
                  <div className="addon-edit-header">
                    <span>
                      {meta.icon} {meta.label}
                    </span>
                    <button
                      className="addon-remove-btn"
                      onClick={() => handleRemoveAddon(addon.id)}
                    >
                      删除
                    </button>
                  </div>
                  <Component
                    data={addon}
                    mode="edit"
                    onUpdate={(newData) => handleUpdateAddon(addon.id, newData)}
                    onRemove={() => handleRemoveAddon(addon.id)}
                    isTaskCompleted={todo.completed}
                  />
                </div>
              );
            })}

            {/* 添加新 Addon 的 UI */}
            {showAddonSelector ? (
              <div className="addon-selector">
                <div className="addon-selector-label">选择要添加的功能：</div>
                <div className="addon-selector-buttons">
                  {addonTypeList.map((type) => (
                    <button
                      key={type}
                      className="addon-selector-btn"
                      onClick={() => handleAddAddon(type)}
                    >
                      {addonRegistry[type].icon} {addonRegistry[type].label}
                    </button>
                  ))}
                  <button
                    className="addon-selector-cancel"
                    onClick={() => setShowAddonSelector(false)}
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="add-addon-btn"
                onClick={() => setShowAddonSelector(true)}
              >
                + 添加功能
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <span
            className={`checkbox ${todo.completed ? "checked" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleTodo(todo.id);
            }}
          >
            {todo.completed ? "✓" : ""}
          </span>

          <span
            className={`task-title ${todo.completed ? "completed-text" : ""}`}
            onDoubleClick={enterEditMode}
          >
            {todo.title}
          </span>

          {todo.addons.length > 0 && (
            <div className="addon-chips">
              {todo.addons.map((addon) => {
                const meta = addonRegistry[addon.type];
                const Component = meta.component;
                return (
                  <div key={addon.id} className="addon-chip">
                    <Component
                      data={addon}
                      mode="compact"
                      onUpdate={() => {}} // Compact 模式不更新
                      onRemove={() => {}} // Compact 模式不删除
                      isTaskCompleted={todo.completed}
                    />
                  </div>
                );
              })}
            </div>
          )}

          <button className="hover-edit-btn" onClick={enterEditMode}>
            ···
          </button>
        </>
      )}
    </motion.div>
  );
};
