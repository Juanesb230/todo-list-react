import axios, { AxiosError } from "axios";

import { AUTHOR_ID, BASE_URL } from "../constants/app";
import { ITodoResponse } from "../models";

export class TodoService {
  static async getTodos() {
    const { data } = await axios.get<ITodoResponse[]>(`${BASE_URL}?id_author=${AUTHOR_ID}`)
    return (data as any).data.map((todo: ITodoResponse): ITodoResponse => ({
      id: todo.id,
      status: todo.status,
      description: todo.description,
      finish_at: new Date(todo.finish_at).toISOString().slice(0, 10)
    }))
  }
  static async deleteTodo(todo: ITodoResponse) {
    const { data } = await axios.delete(`${BASE_URL}${todo.id}`)
    if (!data.success) throw new AxiosError("error")
  }
  static async updateTodo(todo: ITodoResponse) {
    const { data } = await axios.put(`${BASE_URL}${todo.id}`, { ...todo, id_author: AUTHOR_ID })
    if (!data.success) throw new AxiosError("error")
  }
  static async createTodo(todo: ITodoResponse) {
    const { data } = await axios.post(`${BASE_URL}?id_author=${AUTHOR_ID}`, {...todo, id_author: AUTHOR_ID})
    if (!data.success) throw new AxiosError("error")
  }
}