import { createContext } from "react"
import { serverHook, INITIAL_STATE as serverInitialState } from "../hooks/useServer"
import { todosHook, INITIAL_STATE as todosInitialState } from '../hooks/useTodos'

interface AppContextInterface {
  serverReducer: serverHook,
  todosReducer: todosHook
}

const Context = createContext<AppContextInterface>({
  serverReducer: [serverInitialState, () => {}],
  todosReducer: [todosInitialState, () => {}]
})

export default Context