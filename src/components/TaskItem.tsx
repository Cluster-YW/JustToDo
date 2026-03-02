import { motion } from "framer-motion";
import { useState } from "react";
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
    setIsEditing(true);
    setIsDeleteConfirming(false);
  };

  const handleDeleteClick = () => {
    if (isDeleteConfirming) {
      deleteTodo(todo.id);
    } else {
      setIsDeleteConfirming(true);
    }
  };

  return (
    <motion.div
      key={todo.id}
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
          >
            {isDeleteConfirming ? "确认删除?" : "🗑️"}
          </button>

          <div className="edit-actions">
            <button className="save-btn" disabled={editTitle.trim() == ""}>
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
