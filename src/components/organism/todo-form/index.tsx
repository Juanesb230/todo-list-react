import { FC, useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'

import { ITodoResponse } from '../../../models'
import { AUTHOR_ID } from '../../../constants/app'

import { Button } from '../../atoms/button'
import { Input } from '../../atoms/input'
import Typography from '../../atoms/typography'
import './index.scss'

const TodoForm: FC = () => {

  const history = useHistory()
  const [todo, setTodo] = useState<ITodoResponse>({ description: '', finish_at: '', status: 0 })
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

  return <div className='todo-form'>
    <div className='todo-form-imput-container'>
      <Typography>
        Descripción
      </Typography>
      <Input placeholder='Descripción' initialValue={todo.description} onChange={handleOnChange('description')} />
    </div>
    <div className='todo-form-imput-container'>
      <Typography>
        Fecha limite
      </Typography>
      <Input placeholder='Fecha limite' type='date' initialValue={todo.finish_at} onChange={handleOnChange('finish_at')} />
    </div>
    <div className='todo-form-button-container'>
      <Button onClick={createTodo}> Agregar </Button>
    </div>
  </div>
}

export default TodoForm