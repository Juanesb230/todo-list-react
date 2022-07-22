import { FC } from 'react'
import './index.scss'

export interface IconButtonProps {
  className?: string
  onClick?(): void
}

export const IconButton:FC<IconButtonProps> = ({className, onClick = () =>{}}) => {
  return (
    <i data-testid={className} className={`icon-button ${className}`} onClick={onClick}></i>
  )
}
