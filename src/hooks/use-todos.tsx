import { useReducer } from "react"
import { ITodoResponse } from "../models"

interface TodoState {
  todos: ITodoResponse[]
  serverData: ITodoResponse[]
  completedFilter: boolean
  todo: ITodoResponse
}

type TodosReducerAction = {
  type: "getTodos" | "getForServer",
  payload: ITodoResponse[]
} | {
  type: "deleteTodo" | "updateTodo",
  payload: ITodoResponse
} | {
  type: "searchTodo" | "getTodo",
  payload: string
} | {
  type: "filterTodos" | "clearTodo"
} | {
  type: "changeTodo"
  payload: {
    inputName: string,
    inputValue: string
  }
}

export const INITIAL_STATE = {
  todos: [],
  completedFilter: false,
  serverData: [],
  todo: { description: '', finish_at: '', status: 0 }
}

const todosReducer = (state: TodoState, action: TodosReducerAction): TodoState => {
  let filter
  switch (action.type) {
    case "getForServer":
      return {
        ...state,
        serverData: action.payload,
        todos: state.completedFilter ? action.payload.filter(t => t.status === 0) : action.payload,
      }
    case "getTodos":
      return {
        ...state,
        todos: action.payload
      }
    case "getTodo":
      filter = state.todos.find(t => t.id === +action.payload)
      if (filter) {
        return {
          ...state,
          todo: filter
        }
      }
      return state
    case "clearTodo":
      return {
        ...state,
        todo: INITIAL_STATE.todo
      }
    case "deleteTodo":
      const { id: todoId } = action.payload
      filter = state.serverData.filter(t => t.id !== todoId)
      return {
        ...state,
        serverData: filter,
        todos: filter
      }
    case "updateTodo":
      const { id: statusId } = action.payload
      filter = state.serverData.map(t => t.id === statusId ? action.payload : t)
      return {
        ...state,
        serverData: filter,
        todos: filter
      }
    case "searchTodo":
      if (action.payload !== '') return {
        ...state,
        todos: state.todos.filter((t: any) => t.description.toLowerCase().includes(action.payload.toLowerCase()))
      }
      return { ...state, todos: state.serverData }
    case "filterTodos":
      if (!state.completedFilter) return {
        ...state,
        todos: state.todos.filter((t: any) => t.status === 0),
        completedFilter: !state.completedFilter
      }
      return {
        ...state,
        todos: state.serverData,
        completedFilter: !state.completedFilter
      }
    case "changeTodo":
      const {inputName, inputValue} = action.payload
      return {
        ...state,
        todo: {
          ...state.todo, 
          [inputName]: inputValue
        }
      }
  }
}

const useTodos = () => {
  const [todoState, todoDispatch] = useReducer(todosReducer, INITIAL_STATE)
  return { todoState, todoDispatch }
}

export default useTodos
export type todosHook = ReturnType<typeof useTodos>