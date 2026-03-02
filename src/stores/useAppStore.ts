import { create } from 'zustand'

interface Todo {
    id: string
    title: string
    completed: boolean
    createdAt: number // timestamp in milliseconds
    dueDate?: string // ISO string
    category?: string
}

interface AppState {
    todos: Todo[]
    
    addTodo: (title: string) => void
    toggleTodo: (id: string) => void
    deleteTodo: (id: string) => void
    getCompletedCount: () => number
}

const useAppStore = create<AppState>()(
    (set, get) => ({
        todos: [],

        addTodo: (title: string) => {
            const id = Date.now().toString() + Math.random().toString(36).substring(2, 9)
            const newTodo: Todo = {
                id,
                title,
                completed: false,
                createdAt: Date.now()
            }

            set((state) => ({
                ...state,
                todos: [...state.todos, newTodo]
            }))
        },

        toggleTodo: (id: string) => {
            set((state) => ({
                ...state,
                todos: state.todos.map((todo) =>
                    todo.id == id
                        ? { ...todo, completed: !todo.completed }
                        : todo
                )
            }))
        },

        deleteTodo: (id: string) => {
            set((state) => ({
                ...state,
                todos: state.todos.filter((todo) => todo.id !== id)
            }))
        },

        getCompletedCount: () => {
            const state = get()
            return state.todos.filter((todo) => todo.completed).length
        }
    })
)

export default useAppStore