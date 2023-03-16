import { FC } from "react"
import { useCompletedTodoMutation } from "../../../redux/api/apiSlices"
import { ITodoResponse } from "../../../models"
import { COLORS } from "../../../shared/theme/colors"
import { IconButton } from "../../atoms/icon-button"
import Typography from "../../atoms/typography"
import './index.scss'

export interface TodoProps {
  todo: ITodoResponse
  isEven: boolean
  deleteTodo?(todo: ITodoResponse): void
  updateTodo?(todo: ITodoResponse): void
}

export const Todo: FC<TodoProps> = ({ todo, isEven , deleteTodo = () => {}, updateTodo = () => {} }) => {

  const [completeTodo] = useCompletedTodoMutation()

  const toggleComplete = async (todo: ITodoResponse, status: boolean) => {
    await completeTodo({...todo, status: Number(status)} as ITodoResponse)
  }

  return (
    <div data-testid="todo-item" className={`todo-wrapper todo-wrapper-${isEven ? 'even' : 'odd'}`}>
      <div className={`todo-wrapper-element`}>
        <input type="checkbox" checked={todo.status === 1}  onChange={(e) => toggleComplete(todo, e.target.checked)}/>
        <div className={`todo-wrapper-information`}>
          <Typography color={COLORS.textColor} textDecoration={todo.status === 1 ? 'line-through' : ''}>
            {todo.description}
          </Typography>
          <Typography color={COLORS.textColor2} textDecoration={todo.status === 1 ? 'line-through' : ''}>
            {todo.finish_at}
          </Typography>
        </div>
      </div>
      <div className={`todo-wrapper-information`}>
        <IconButton className="fa-solid fa-pencil" onClick={() => updateTodo(todo)}></IconButton>
        <IconButton className="fa-solid fa-trash-can" onClick={() => deleteTodo(todo)}></IconButton>
      </div>
    </div>
  )
}
