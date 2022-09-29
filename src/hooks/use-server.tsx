import { useReducer } from "react";

interface ServerState {
  state: 'loading' | 'error' | 'normal' | 'success'
}

interface ServerAction {
  type: ServerState['state'],
}

export const INITIAL_STATE = 'normal'

const serverReducer = (_state: ServerState['state'], action: ServerAction) => {
  return action.type
}

const useServer = () => {
  const [serverState, serverDispatch] = useReducer(serverReducer, INITIAL_STATE)
  return { serverState, serverDispatch }
}

export default useServer
export type serverHook = ReturnType<typeof useServer>