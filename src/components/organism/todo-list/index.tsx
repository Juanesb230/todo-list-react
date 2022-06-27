import { FC, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useAppSelector } from '../../../redux/hooks'
import {
  useDeleteTodoMutation,
  selectNoCompleteTodos,
  selectAll,
  searchAllTodos,
  searchNoCompleteTodos,
} from '../../../redux/api/apiSlices'

import { ITodoResponse } from '../../../models'
import { Button } from '../../atoms/button'
import { Input } from '../../atoms/input';
import Typography from '../../atoms/typography'
import { Todo } from '../../molecules/todo'
import './index.scss'

const TodoList: FC = () => {

  const history = useHistory()
  const [filterOption, setfilterOption] = useState('completed')
  const [searchValue, setsearchValue] = useState('')
  const total = useAppSelector((state) => selectAll(state).length)
  const todosCompleted = total - useAppSelector((state) => selectNoCompleteTodos(state).length)
  const todos = useAppSelector((state: any) => {
    if (filterOption === 'all') return searchNoCompleteTodos(state, searchValue)
    return searchAllTodos(state, searchValue)
  })

  const [deleteOneTodo] = useDeleteTodoMutation()

  const goToCreate = () => {
    history.push('/create')
  }

  const deleteTodo = async (todo: ITodoResponse) => {
    await deleteOneTodo(todo)
  }

  const onUpdate = async (todo: ITodoResponse) => {
    history.push(`/update/${todo.id}`)
  }

  const onFiltered = (value: string) => {
    setsearchValue(value)
  }

  const onFilteredClick = () => {
    setfilterOption(current => {
      if (current === 'all') return 'completed'
      return 'all'
    })
  }

  return (
    <>
      <div className='my-8' style={{ display: 'flex' }}>
        <Input placeholder='Buscar tarea' initialValue={''} onChange={onFiltered} />
        <Button onClick={goToCreate} ><i className="fa-solid fa-plus"></i></Button>
      </div>
      <div>
        {
          todos.length === 0 ?
            <Typography fontSize='32' color='skyblue' align='center'>No tienes tareas registradas</Typography>
            :
            todos.map((todo, index) =>
              <Todo key={index} isEven={index % 2 === 0} todo={todo as ITodoResponse} updateTodo={onUpdate} deleteTodo={deleteTodo} />
            )
        }
      </div>
      <br />
      <div>
        <div className='todo-list-bar' style={{ background: `linear-gradient(to right, yellow 0%, yellow ${(todosCompleted/total)*100}%, white ${(todosCompleted/total)*100}%, white 100%)` }}>
          {todosCompleted} de {total} tarea(s) completada(s)
        </div>
        <br />
        <Button onClick={onFilteredClick}>
          {filterOption === 'completed' ? 'Mostrar no completados' : 'Mostrar todos'}
          <i className="fa-solid fa-address-card"></i></Button>
      </div>
    </>
  )
}

export default TodoList