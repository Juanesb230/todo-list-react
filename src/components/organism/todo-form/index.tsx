import React, { FC, useContext, useLayoutEffect } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'

import Context from '../../../store'
import { TodoService } from '../../../services/todosService'
import useChangeForm from '../../../hooks/useTodoForm'

import { Button } from '../../atoms/button'
import { Input } from '../../atoms/input'
import Typography from '../../atoms/typography'
import './index.scss'

interface Params {
  id?: string
}

const TodoForm: FC = () => {

  const param: Params = useParams()
  const history = useHistory()
  const { pathname } = useLocation()

  const appContext = useContext(Context)
  const serverDispatch = appContext.serverReducer[1]
  const [todosStates, todosDispatch] = appContext.todosReducer
  const [todo, formDispatch] = useChangeForm(todosStates.todo)

  useLayoutEffect(() => {
    todosDispatch({ type: 'getTodo', payload: param.id || '-1' })

    return () => {
      todosDispatch({ type: 'clearTodo' })
    };
  }, [todosDispatch, param.id])

  useLayoutEffect(() => {
    formDispatch({ type: 'getTodo', payload: todosStates.todo })
  }, [formDispatch, todosStates.todo])

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value: inputValue } = e.target
    formDispatch({ type: 'changeValue', payload: { inputName, inputValue } })
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

  return (
    <div className='todo-form'>
      <div className='todo-form-imput-container'>
        <Typography>
          Descripción
        </Typography>
        <Input placeholder='Descripción' name="description" initialValue={todo.description} onChange={handleOnChange} />
        {!todo.description && <Typography color='red' fontSize='10'>Descripcion requerida</Typography>}
      </div>
      <div className='todo-form-imput-container'>
        <Typography>
          Fecha limite
        </Typography>
        <Input placeholder='Fecha limite' name='finish_at' type='date' initialValue={todo.finish_at} onChange={handleOnChange} />
        {!todo.finish_at && <Typography color='red' fontSize='10'>Fecha requerida</Typography>}
      </div>
      <div className='todo-form-button-container'>
        <Button onClick={goBack} variant="secondary"> Volver </Button>
        {
          pathname === '/create' &&
          <Button onClick={() => serviceCallTodo('createTodo')}> Agregar </Button>
        }
        {
          pathname.includes('/update') &&
          <Button onClick={() => serviceCallTodo('updateTodo')}> Actualizar </Button>
        }
      </div>
    </div>
  )
}

export default TodoForm