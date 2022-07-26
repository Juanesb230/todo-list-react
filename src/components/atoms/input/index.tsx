import React, { FC, useEffect, useState } from "react"
import './index.scss'

export interface InputProps {
  initialValue?: string
  placeholder?: string
  width?: string
  type?: string
  name?: string
  onChange?(value: any): void
}

export const Input: FC<InputProps> = ({ initialValue = '', type = 'text', placeholder, name = 'input', width, onChange = () => { } }) => {

  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value }= event.target
    setValue(value)
    onChange(event)
  }

  return (
    <div style={{ width }}>
      <input type={type} placeholder={placeholder} value={value} name={name} className='input' onChange={handleOnChange}></input>
    </div>
  )

}