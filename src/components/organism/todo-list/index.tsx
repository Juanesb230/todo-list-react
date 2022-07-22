import { FC, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios';

import { AUTHOR_ID } from '../../../constants/app';
import { useList } from "../../../hooks/useLists";
import { ITodoResponse } from '../../../models';

import { Button } from '../../atoms/button'
import Typography from '../../atoms/typography';
import { Todo } from '../../molecules/todo'
import './index.css'

export interface TodoListProps {
  updateTodo: (todo: ITodoResponse) => void
}

const TodoList: FC<TodoListProps> = ({updateTodo}) => {

  const history = useHistory()
  const { todos, refetch } = useList()
  const [todosRender, settodosRender] = useState(todos)
  const todosCompleted = todosRender.filter(t => t.status === 1).length
  const total = todosRender.length

  useEffect(() => {
    refetch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    settodosRender(todos)
  }, [todos])

  const goToCreate = () => {
    history.push('/create')
  }

  const redirectUpdate = (todo: ITodoResponse) => {
    updateTodo(todo)
    history.push('/update')
  }

  const deleteTodo = async (todo: ITodoResponse) => {
    await axios.delete(`https://bp-todolist.herokuapp.com/${todo.id}`)
    settodosRender(current => current.filter(t => t.id !== todo.id))
  }

  const toggleComplete = async (todo: ITodoResponse) => {
    settodosRender(current => 
      current.map(t => t.id === todo.id ? todo: t)
    )
    await axios.put(`https://bp-todolist.herokuapp.com/${todo.id}`, {...todo, id_author: AUTHOR_ID})
  }

  return (
    <>
      <div className='my-8'>
        <Button onClick={goToCreate} ><i data-testid="add-todo" className="fa-solid fa-plus"></i></Button>
      </div>
      <div>
        { todosRender.length === 0 && <Typography>No hay todos en la lista</Typography>}
        { todosRender.map((todo, index) =>
          <Todo key={index} isEven={index % 2 === 0} todo={todo} updateTodo={redirectUpdate} deleteTodo={deleteTodo} toggleComplete={toggleComplete}/>
        )}
        <div style={{
          border: '1px solid black',
          background: `linear-gradient(to right, yellow 0%, yellow ${(todosCompleted/total)*100}%, white ${(todosCompleted/total)*100}%, white 100%)`
          }}>
          { todosCompleted } de { total } completados
        </div>
      </div>
    </>
  )
}

export default TodoList