import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import useAppStore from "../stores/useAppStore";

interface TaskItemProps {
  todo: {
    id: string;
    title: string;
    completed: boolean;
    createdAt: number;
  };
}

// export component with an argument of todo
export const TaskItem = ({ todo }: TaskItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isDeleteConfirming, setIsDeleteConfirming] = useState(false);

  const { toggleTodo, deleteTodo, updateTodoTitle } = useAppStore();

  const enterEditMode = () => {
    setEditTitle(todo.title);
    setIsEditing(true);
    setIsDeleteConfirming(false);
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

          <button className="hover-edit-btn" onClick={enterEditMode}>
            ···
          </button>
        </>
      )}
    </motion.div>
  );
};
