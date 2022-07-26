import React, { FC, useEffect, useCallback, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import Context from '../../../store';
import { TodoService } from '../../../services/todosService';
import { ITodoResponse } from '../../../models';

import { Button } from '../../atoms/button'
import { Input } from '../../atoms/input';
import Typography from '../../atoms/typography';
import { Todo } from '../../molecules/todo'
import './index.scss'

const TodoList: FC = () => {

  const history = useHistory()
  
  const appContext = useContext(Context)
  const serverDispatch = appContext.serverReducer[1]
  const [todosStates, todosDispatch] = appContext.todosReducer
  const { todos, completedFilter } = todosStates
  const todosCompleted = todos.filter(t => t.status === 1).length
  const total = todos.length

  const refetch = useCallback(async () => {
    const payload = await TodoService.getTodos()
    todosDispatch({ type: 'getForServer', payload })
  }, [todosDispatch])

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
    todosDispatch({ type, payload: todo })
    try {
      await TodoService[type](todo)
      serverDispatch({ type: 'success' })
    } catch (e) {
      serverDispatch({ type: 'error' })
      todosDispatch({ type: 'getTodos', payload: oldTodos })
    } finally {
      serverDispatch({ type: 'normal' })
    }
  }

  const searchTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    todosDispatch({ type: 'searchTodo', payload: value })
  }

  const filterTodos = () => {
    todosDispatch({ type: 'filterTodos' })
  }

  return (
    <>
      <div className='my-8 todo-list__container'>
        <div style={{ flexGrow: 1 }}><Input placeholder='Buscar tarea' initialValue="" onChange={searchTodo} /></div>
        <Button onClick={goToCreate} ><i data-testid="add-todo" className="fa-solid fa-plus"></i></Button>
      </div>
      <div>
        {total === 0 && <Typography>No hay todos en la lista</Typography>}
        {todos.map((todo, index) =>
          <Todo
            key={index}
            isEven={index % 2 === 0}
            todo={todo}
            updateTodo={redirectUpdate}
            deleteTodo={(todo) => callServer(todo, 'deleteTodo')}
            toggleComplete={(todo => callServer(todo, 'updateTodo'))}
          />
        )}
        <div className="todo-list__container todo-list__mobile" style={{ marginTop: '10px' }}>
          {
            total > 0 &&
            <div
              style={{
                background: `linear-gradient(to right, yellow 0%, yellow ${(todosCompleted / total) * 100}%, white ${(todosCompleted / total) * 100}%, white 100%)`
              }}
              className="todo-list__meter"
            >
              {todosCompleted} de {total} completados
            </div>
          }
          <Button onClick={filterTodos}>{completedFilter ? 'Mostrar todos' : 'Mostrar no completados'}</Button>
        </div>
      </div>
    </>
  )
}

export default TodoList