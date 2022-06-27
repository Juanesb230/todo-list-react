import { FC } from 'react'
import './index.scss'

export interface IconButtonProps {
  className?: string
  onClick?(): void
}

export const IconButton:FC<IconButtonProps> = ({className, onClick = () =>{}}) => {
  const testid = className?.split(' ')[1]
  return (
    <i data-testid={testid} className={`icon-button ${className}`} onClick={onClick}></i>
  )
}
