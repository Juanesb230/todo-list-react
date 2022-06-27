import { rest } from 'msw'
import { BASE_URL } from '../../constants/app'
import { ITodoResponse } from '../../models'

let mockAllTodos: ITodoResponse[] = []
let mockAddTodo: ITodoResponse | null = null
let count = 0

const handlers = [
  rest.get(BASE_URL, (_req, res, ctx) => {
    if (mockAddTodo) {
      mockAllTodos.push(mockAddTodo)
      mockAddTodo = null
    }
    const mockApiResponse = {
        data: mockAllTodos
    }
    return res(ctx.json(mockApiResponse))
  }),
  rest.post(BASE_URL, (req, res, ctx) => {
    mockAddTodo = req.body as ITodoResponse
    count++
    mockAddTodo = { ...mockAddTodo, id: count }
    const mockApiResponse = { data: mockAddTodo }
    return res(ctx.json(mockApiResponse))
  }),
  rest.put(`${BASE_URL}2`, (req, res, ctx) => {
    const body: any = req.body
    mockAllTodos.pop()
    mockAllTodos.push({...body, id: count})
    const mockApiResponse = { data: {...body, id: count} }
    return res(ctx.json(mockApiResponse))
  }),
  rest.delete(`${BASE_URL}2`, (_req, res, ctx) => {
    mockAllTodos.pop()
    return res(ctx.json({data: []}))
  })
]

export { handlers }