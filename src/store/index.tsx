import { createContext } from "react"
import { serverHook, INITIAL_STATE as serverInitialState } from "../hooks/use-server"
import { todosHook, INITIAL_STATE as todosInitialState } from '../hooks/use-todos'

interface AppContextInterface {
  serverReducer: serverHook,
  todosReducer: todosHook
}

const Context = createContext<AppContextInterface>({
  serverReducer: {serverState: serverInitialState, serverDispatch: () => {}},
  todosReducer: {todoState: todosInitialState, todoDispatch: () => {}}
})

export default Context