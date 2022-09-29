import { useEffect, useCallback, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import Context from '../../../store';
import { TodoService } from '../../../services/todosService';
import { ITodoResponse } from '../../../models';

const useTodoList = () => {
  const history = useHistory()
  
  const appContext = useContext(Context)
  const { serverDispatch } = appContext.serverReducer
  const {todoState, todoDispatch} = appContext.todosReducer
  const { todos, completedFilter } = todoState
  const todosCompleted = todos.filter(t => t.status === 1).length
  const total = todos.length

  const refetch = useCallback(async () => {
    const payload = await TodoService.getTodos()
    todoDispatch({ type: 'getForServer', payload })
  }, [todoDispatch])

  useEffect(() => {
    refetch()
  }, [refetch])

  const goToCreate = () => {
    history.push('/create')
  }

  const redirectUpdate = (todo: ITodoResponse) => {
    history.push(`/update/${todo.id}`)
  }

  const callServer = async (todo: ITodoResponse, type: 'updateTodo' | 'deleteTodo') => {
    const oldTodos = todos
    todoDispatch({ type, payload: todo })
    try {
      await TodoService[type](todo)
      serverDispatch({ type: 'success' })
    } catch (e) {
      serverDispatch({ type: 'error' })
      todoDispatch({ type: 'getTodos', payload: oldTodos })
    } finally {
      serverDispatch({ type: 'normal' })
    }
  }

  const searchTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    todoDispatch({ type: 'searchTodo', payload: value })
  }

  const filterTodos = () => {
    todoDispatch({ type: 'filterTodos' })
  }

  return {
    todos,
    completedFilter,
    todosCompleted,
    total,
    goToCreate,
    redirectUpdate,
    searchTodo,
    filterTodos,
    callServer
  }
}

export default useTodoList