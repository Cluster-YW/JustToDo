import { create } from "zustand";
import { addonRegistry, type RegisteredAddonType } from "../addons/registry";
import type { Addon } from "../addons/types";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number; // timestamp in milliseconds
  dueDate?: string; // ISO string
  category?: string;
  addons: Addon[];
}

interface AppState {
  todos: Todo[];

  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodoTitle: (id: string, title: string) => void;
  getSortedTodos: () => Todo[];
  getCompletedCount: () => number;

  // Addons
  addAddon: (taskId: string, type: RegisteredAddonType) => void;
  updateAddon: (taskId: string, addonId: string, newData: Addon) => void;
  removeAddon: (taskId: string, addonId: string) => void;
}

const useAppStore = create<AppState>()((set, get) => ({
  todos: [],

  addTodo: (title: string) => {
    const id =
      Date.now().toString() + Math.random().toString(36).substring(2, 9);
    const newTodo: Todo = {
      id,
      title,
      completed: false,
      createdAt: Date.now(),
      addons: [],
    };

    set((state) => ({
      ...state,
      todos: [...state.todos, newTodo],
    }));
  },

  toggleTodo: (id: string) => {
    set((state) => ({
      ...state,
      todos: state.todos.map((todo) =>
        todo.id == id ? { ...todo, completed: !todo.completed } : todo,
      ),
    }));
  },

  deleteTodo: (id: string) => {
    set((state) => ({
      ...state,
      todos: state.todos.filter((todo) => todo.id !== id),
    }));
  },

  getCompletedCount: () => {
    const state = get();
    return state.todos.filter((todo) => todo.completed).length;
  },

  getSortedTodos: () => {
    const { todos } = get();
    return [...todos].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return b.createdAt - a.createdAt;
    });
  },

  updateTodoTitle: (id: string, title: string) => {
    set((state) => ({
      ...state,
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, title } : todo,
      ),
    }));
  },

  // ********** Addons **********
  addAddon: (taskId: string, type: RegisteredAddonType) => {
    const meta = addonRegistry[type];
    const newAddon = meta.createDefault();

    set((state) => ({
      ...state,
      todos: state.todos.map((todo) =>
        todo.id === taskId
          ? { ...todo, addons: [...todo.addons, newAddon] }
          : todo,
      ),
    }));
  },

  updateAddon: (taskId: string, addonId: string, newData: Addon) => {
    set((state) => ({
      ...state,
      todos: state.todos.map((todo) => {
        if (todo.id === taskId) return todo;
        const newAddons = todo.addons.map((addon) =>
          addon.id === addonId ? newData : addon,
        );
        return { ...todo, addons: newAddons };
      }),
    }));
  },

  removeAddon: (taskId: string, addonId: string) => {
    set((state) => ({
      ...state,
      todos: state.todos.map((todo) => {
        if (todo.id === taskId) return todo;
        const newAddons = todo.addons.filter((addon) => addon.id !== addonId);
        return { ...todo, addons: newAddons };
      }),
    }));
  },
}));

export default useAppStore;
