import { FC } from "react"

import { ITodoResponse } from "../../../models"
import { COLORS } from "../../../shared/theme/colors"

import { IconButton } from "../../atoms/icon-button"
import Typography from "../../atoms/typography"
import './index.scss'

export interface TodoProps {
  todo: ITodoResponse
  isEven: boolean
  toggleComplete?(todo: ITodoResponse): void
  deleteTodo?(todo: ITodoResponse): void
  updateTodo?(todo: ITodoResponse): void
}

export const Todo: FC<TodoProps> = ({ todo, isEven, toggleComplete = () => {} , deleteTodo = () => {}, updateTodo = () => {} }) => {

  const textDecoration = !!todo.status ? 'line-through': 'none'

  const changeStatus = async () => {
    const updatedTodo = {...todo, status: !!todo.status ? 0 : 1}
    toggleComplete(updatedTodo)
  }

  return (
    <div className={`todo-wrapper todo-wrapper-${isEven ? 'even' : 'odd'}`}>
      <div className={`todo-wrapper-element`}>
        <input type="checkbox" checked={!!todo.status} onChange={changeStatus}/>
        <div className={`todo-wrapper-information todo-wrapper-data`}>
          <Typography color={COLORS.textColor} textDecoration={textDecoration}>
            {todo.description}
          </Typography>
          <Typography color={COLORS.textColor2} textDecoration={textDecoration}>
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
