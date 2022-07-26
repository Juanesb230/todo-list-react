import { FC, useState, useEffect } from 'react'
import Typography from '../typography'
import './index.scss'

const message = {
  error: "Ha ocurrido un error",
  success: "Cambio realizado con exito",
  normal: "",
  loading: ""
}

export interface MessageBarProps {
  variant?: 'success' | 'error' | 'normal' | 'loading',
}

const MessageBar: FC<MessageBarProps> = ({ variant = 'normal' }) => {

  const [status, setStatus] = useState<MessageBarProps['variant']>(variant)

  useEffect(() => {
    let timer: any
    if (variant === 'error' || variant === 'success') setStatus(variant)
    if (variant === 'normal') timer = setTimeout(() => setStatus(variant), 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [variant])
  

  return (
    <>
      {
        status !== 'normal' &&
        <div className={`message-bar message-bar__${status}`}>
          <Typography color='white' fontSize='10px'>{message[status || 'normal']}</Typography>
        </div>
      }
    </>
  )
}

export default MessageBar