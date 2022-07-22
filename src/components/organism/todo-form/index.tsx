import { FC, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import axios from 'axios'

import { ITodoResponse } from '../../../models'
import { AUTHOR_ID } from '../../../constants/app'

import { Button } from '../../atoms/button'
import { Input } from '../../atoms/input'
import Typography from '../../atoms/typography'
import './index.scss'

export interface TodoFormProps {
  initialTodo?: ITodoResponse
}

const TodoForm: FC<TodoFormProps> = ({ initialTodo = { description: '', finish_at: '', status: 0 } }) => {

  const history = useHistory()
  const { pathname } = useLocation()
  const [todo, setTodo] = useState<ITodoResponse>(initialTodo)
  const handleOnChange = (property: 'description' | 'finish_at') => (value: string) => {
    setTodo(current => ({
      ...current,
      [property]: value
    }))
  }

  const createTodo = async () => {
    await axios.post(`https://bp-todolist.herokuapp.com/?id_author=${AUTHOR_ID}`, {...todo, id_author: AUTHOR_ID})
    history.push('/')
  }

  const updateTodo = async () => {
    await axios.put(`https://bp-todolist.herokuapp.com/${todo.id}`, {...todo, id_author: AUTHOR_ID})
    history.push('/')
  }

  return <div className='todo-form'>
    <div className='todo-form-imput-container'>
      <Typography>
        Descripción
      </Typography>
      <Input placeholder='Descripción' initialValue={todo.description} onChange={handleOnChange('description')} />
      { !todo.description && <Typography color='red' fontSize='10px'>Descripcion requerida</Typography> }
    </div>
    <div className='todo-form-imput-container'>
      <Typography>
        Fecha limite
      </Typography>
      <Input placeholder='Fecha limite' type='date' initialValue={todo.finish_at} onChange={handleOnChange('finish_at')} />
      { !todo.finish_at && <Typography color='red' fontSize='10px'>Fecha requerida</Typography> }
    </div>
    <div className='todo-form-button-container'>
      {pathname === '/create' && <Button onClick={createTodo}> Agregar </Button>}
      {pathname === '/update' && <Button onClick={updateTodo}> Actualizar </Button>}
    </div>
  </div>
}

export default TodoForm