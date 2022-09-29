import { FC } from 'react'

import useTodoList from './use-todo-list';

import { Button } from '../../atoms/button'
import { Input } from '../../atoms/input';
import Typography from '../../atoms/typography';
import { Todo } from '../../molecules/todo'
import './index.scss'

const TodoList: FC = () => {

  const {
    todos,
    todosCompleted,
    total,
    completedFilter,
    goToCreate,
    searchTodo,
    redirectUpdate,
    callServer,
    filterTodos
  } = useTodoList()

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