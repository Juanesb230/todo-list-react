import { FC } from 'react'
import { useLocation } from 'react-router-dom'
import useTodoForm from './use-todo-form'

import { Button } from '../../atoms/button'
import { Input } from '../../atoms/input'
import Typography from '../../atoms/typography'
import './index.scss'

const TodoForm: FC = () => {
  const { pathname } = useLocation()
  const {
    todo,
    handleOnChange,
    serviceCallTodo,
    goBack
  } = useTodoForm()

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