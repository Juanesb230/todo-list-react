import { FC, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDelete } from '../../../hooks/useDelete';
import { useList } from "../../../hooks/useLists";
import { useCompletedTodo } from '../../../hooks/useCompletedTodo';
import { ITodoResponse } from '../../../models';
import { Button } from '../../atoms/button'
import { Input } from '../../atoms/input';
import Typography from '../../atoms/typography'
import { Todo } from '../../molecules/todo'
import './index.css'

const TodoList: FC<any> = ({ updateTodo }) => {

  const history = useHistory()

  const { todos, refetch, setTodos } = useList()
  const { refetch: onDelete } = useDelete()
  const { refetch: onCompleted } = useCompletedTodo()
  const [renderTodos, setrenderTodos] = useState<ITodoResponse[]>([])
  const [filterOption, setfilterOption] = useState('completed')

  useEffect(() => {
    refetch()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if(todos.length > 0) setrenderTodos(todos)
  }, [todos])

  const goToCreate = () => {
    history.push('/create')
  }

  const deleteTodo = async(todo: ITodoResponse) => {
    await onDelete(todo.id || -2)
    setTodos(current => {
      const data = current.filter(currentTodo => currentTodo.id !== todo.id)
      return data
    })
  }

  const toggleComplete = async(todo: ITodoResponse, status: boolean) => {
    await onCompleted(todo, status)
    await refetch()
  }

  const onUpdate = async (todo: ITodoResponse) => {
    await updateTodo(todo)
    history.push('/update')
  }

  const onFiltered = (value: string) => {
    if (value)
      setrenderTodos( current => {
        const data = current.filter(currentTodo => currentTodo.description.toLowerCase().includes(value.toLowerCase()))
        return data
      })
    else {
      setrenderTodos(todos)
      setfilterOption('completed')
    }
  }

  const onFilteredClick = () => {
    if (filterOption === 'completed') {
      setfilterOption('all')
      setrenderTodos( current => {
        const data = current.filter(currentTodo => currentTodo.status === 0)
        return data
      })
    }
    if (filterOption === 'all') {
      setfilterOption('completed')
      setrenderTodos(todos)
    }
  }

  return (
    <>
      <div className='my-8' style={{display: 'flex'}}>
        <Input placeholder='Buscar tarea' initialValue={''} onChange={onFiltered} />
        <Button onClick={goToCreate} ><i className="fa-solid fa-plus"></i></Button>
      </div>
      <div>
        {
          renderTodos.length === 0 ?
            <Typography fontSize='32' color='skyblue' align='center'>No tienes tareas registradas</Typography>
          :
          renderTodos.map((todo, index) =>
            <Todo key={index} isEven={index % 2 === 0} todo={todo} updateTodo={onUpdate} deleteTodo={deleteTodo} toggleComplete={toggleComplete}/>
          )
        }
      </div>
      <br/>
      <div>
        {renderTodos.filter(renderTodo => renderTodo.status > 0).length} de {renderTodos.length} tarea(s) completada(s)
        <br/><br/>
        <Button onClick={onFilteredClick}>
          {filterOption === 'completed' ? 'Mostrar no completados' : 'Mostrar todos'}
          <i className="fa-solid fa-address-card"></i></Button>
      </div>
    </>
  )
}

export default TodoList