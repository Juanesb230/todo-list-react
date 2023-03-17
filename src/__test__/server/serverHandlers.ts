import { rest } from 'msw'
import { BASE_URL } from '../../constants/app'
import { ITodoResponse } from '../../models'

let mockAllTodos: ITodoResponse[] = []
let mockAddTodo: ITodoResponse | null = null
let count = 0

const handlers = [
  rest.get(BASE_URL, (_req, res, ctx) => {
    const mockApiResponse = {
        data: mockAllTodos
    }
    return res(ctx.json(mockApiResponse))
  }),
  rest.post(BASE_URL, (req, res, ctx) => {
    mockAddTodo = req.body as ITodoResponse
    count++
    mockAddTodo = { ...mockAddTodo, id: count }
    mockAllTodos.push(mockAddTodo)
    const mockApiResponse = { data: mockAddTodo }
    return res(ctx.json(mockApiResponse))
  }),
  rest.put(`${BASE_URL}/:id`, (req, res, ctx) => {
    const { id } = req.params
    const body: any = req.body
    mockAllTodos = mockAllTodos.map(m => m.id?.toString() === id ? body: m)
    const mockApiResponse = { data: {...body, id } }
    return res(ctx.json(mockApiResponse))
  }),
  rest.delete(`${BASE_URL}/:id`, (req, res, ctx) => {
    const {id } = (req.params)
    mockAllTodos = mockAllTodos.filter(m => id !== m.id?.toString())
    return res(ctx.json({data: []}))
  })
]

export { handlers }