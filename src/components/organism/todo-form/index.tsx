import { FC, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { useAppSelector } from '../../../redux/hooks'
import { ITodoResponse } from '../../../models'
import { useAddNewTodoMutation, selectById, useUpdateTodoMutation } from '../../../redux/api/apiSlices'

import { Button } from '../../atoms/button'
import { Input } from '../../atoms/input'
import Typography from '../../atoms/typography'
import './index.scss'

interface FormParams {
  id?: string 
}

const TodoForm: FC = () => {

  const { id = -2 } = useParams<FormParams>()
  const history = useHistory()
  const { pathname } = useLocation()

  const data = useAppSelector(state => selectById(state, id))
  const initialTodo = id !== -2 ? data : { description: '', finish_at: '', status: 0 } 
  const [todo, setTodo] = useState<ITodoResponse>(initialTodo as ITodoResponse)

  const [addNewTodo] = useAddNewTodoMutation()
  const [updateTodo] = useUpdateTodoMutation()

  const handleOnChange = (property: 'description' | 'finish_at') => (value: string) => {
    setTodo(current => ({
      ...current,
      [property]: value
    }))
  }

  const goToList = () => {
    history.push('/')
  }

  const createTodo = async () => {
    if (pathname === '/create') await addNewTodo(todo)
    if (pathname.includes('/update')) await updateTodo(todo)
    history.push('/')
  }

  return <div className='todo-form'>
    <div className='todo-form-imput-container'>
      <Typography>
        Descripción
      </Typography>
      <Input placeholder='Descripción' initialValue={todo.description} onChange={handleOnChange('description')} />
      { !todo.description && <p className='todo-form-error-text'>El campo descripcion es requerido</p> }
    </div>
    <div className='todo-form-imput-container'>
      <Typography>
        Fecha limite
      </Typography>
      <Input placeholder='Fecha limite' type='date' initialValue={todo.finish_at} onChange={handleOnChange('finish_at')} />
      { !todo.finish_at && <p className='todo-form-error-text'>El campo fecha es requerido</p> }
    </div>
    <div className='todo-form-button-container'>
      <Button variant='secondary' onClick={goToList}> Volver </Button>
      <Button onClick={createTodo} disabled={!(todo.finish_at && todo.description)}> Agregar </Button>
    </div>
  </div>
}

export default TodoForm