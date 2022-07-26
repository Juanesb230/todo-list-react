import { useReducer } from "react";
import { ITodoResponse } from "../models";

interface FormState {
  inputValues: ITodoResponse
}

type FormReducerAction = {
  type: "changeValue"
  payload: {
    inputName: string,
    inputValue: string
  }
} | {
  type: "getTodo",
  payload: ITodoResponse
}

const formReducer = (state: FormState['inputValues'], action: FormReducerAction) => {
  switch(action.type) {
    case 'changeValue':
      const {inputName, inputValue} = action.payload
      return {...state, [inputName]: inputValue}
    case 'getTodo':
      return action.payload
  }
}

const useChangeForm = (initialState: ITodoResponse) => {
  return useReducer(formReducer, initialState)
}

export default useChangeForm