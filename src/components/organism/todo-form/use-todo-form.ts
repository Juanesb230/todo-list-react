import{ useContext, useLayoutEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import Context from '../../../store'
import { TodoService } from '../../../services/todosService'

interface Params {
  id?: string
}

const useTodoForm = () => {
  const param: Params = useParams()
  const history = useHistory()

  const appContext = useContext(Context)
  const { serverDispatch } = appContext.serverReducer
  const {todoState, todoDispatch} = appContext.todosReducer
  const { todo } = todoState

  useLayoutEffect(() => {
    todoDispatch({type: 'getTodo', payload: param.id || '-1'})

    return () => {
      todoDispatch({type: 'clearTodo'})
    }
  }, [param.id, todoDispatch])

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value: inputValue } = e.target
    todoDispatch({ type: 'changeTodo', payload: { inputName, inputValue } })
  }

  const serviceCallTodo = async (method: 'createTodo' | 'updateTodo') => {
    try {
      await TodoService[method](todo)
      serverDispatch({ type: 'success' })
      history.push('/')
    } catch (e) {
      serverDispatch({ type: 'error' })
    } finally {
      serverDispatch({ type: 'normal' })
    }
  }

  const goBack = () => {
    history.goBack()
  }

  return {
    todo,
    handleOnChange,
    serviceCallTodo,
    goBack
  }
}

export default useTodoForm