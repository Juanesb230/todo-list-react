import { FC, useState } from "react"

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

  const [isChecked, setisChecked] = useState(!!todo.status)

  const changeStatus = async () => {
    setisChecked(!isChecked)
    const updatedTodo = {...todo, status: !isChecked ? 1 : 0}
    toggleComplete(updatedTodo)
  }

  return (
    <div className={`todo-wrapper todo-wrapper-${isEven ? 'even' : 'odd'}`}>
      <div className={`todo-wrapper-element`}>
        <input type="checkbox" checked={isChecked} onChange={changeStatus}/>
        <div className={`todo-wrapper-information`}>
          <Typography color={COLORS.textColor}>
            {todo.description}
          </Typography>
          <Typography color={COLORS.textColor2}>
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
