import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { createEntityAdapter, createSelector, EntityState } from '@reduxjs/toolkit'
import { BASE_URL, AUTHOR_ID } from '../../constants/app'
import { ITodoResponse } from '../../models'

const todosAdapter = createEntityAdapter<ITodoResponse>()
const initialState = todosAdapter.getInitialState()

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  tagTypes: ['Post'],
  endpoints: builder => ({
    getTodos: builder.query<EntityState<ITodoResponse>, void>({
      query: () => `?id_author=${AUTHOR_ID}`,
      transformResponse: (res: any) => {
        const data = (res as any).data.map((todo: ITodoResponse): ITodoResponse => ({
          id: todo.id,
          status: todo.status,
          description: todo.description,
          finish_at: new Date(todo.finish_at).toISOString().slice(0, 10)
        }))
        return todosAdapter.setAll(initialState, data)
      },
      providesTags: (result, _error, _arg) =>
        result
          ? [...result.ids.map((id) => ({ type: 'Post' as const, id })), 'Post']
          : ['Post'],

    }),
    addNewTodo: builder.mutation({
      query: (body: ITodoResponse) => ({
        url: `?id_author=${AUTHOR_ID}`,
        method: 'POST',
        body: { ...body, id_author: AUTHOR_ID }
      }),
      invalidatesTags: ['Post']
    }),
    updateTodo: builder.mutation({
      query: (body: ITodoResponse) => ({
        url: `${body.id}?id_author=${AUTHOR_ID}`,
        method: 'PUT',
        body: { ...body, id_author: AUTHOR_ID }
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Post', id: arg.id }],
    }),
    deleteTodo: builder.mutation({
      query: (todo: ITodoResponse) => ({
        url: `${todo.id}?id_author=${AUTHOR_ID}`,
        method: 'DELETE'
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const completeResult = dispatch(
          apiSlice.util.updateQueryData('getTodos', undefined, draft => {
            todosAdapter.removeOne(draft, body.id || -2)
          })
        )

        try {
          await queryFulfilled
        } catch {
          completeResult.undo()
        }
      }
    }),
    completedTodo: builder.mutation({
      query: (body: ITodoResponse) => ({
        url: `${body.id}?id_author=${AUTHOR_ID}`,
        method: 'PUT',
        body: { ...body, id_author: AUTHOR_ID }
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        const completeResult = dispatch(
          apiSlice.util.updateQueryData('getTodos', undefined, draft => {
            const post = draft.entities[body.id || -2]
            if (post) post.status = body.status
          })
        )

        try {
          await queryFulfilled
        } catch {
          completeResult.undo()
        }
      }
    })
  })
})

export const {
  useGetTodosQuery,
  useDeleteTodoMutation,
  useAddNewTodoMutation,
  useUpdateTodoMutation,
  useCompletedTodoMutation
} = apiSlice

export const selectTodosResult = apiSlice.endpoints.getTodos.select()

export const selectTodosData = createSelector(
  selectTodosResult,
  todosResult => todosResult.data
)

export const {
  selectAll,
  selectById
} = todosAdapter.getSelectors((state: any) => selectTodosData(state) ?? initialState)

export const selectNoCompleteTodos = createSelector(
  selectAll,
  (data) => data ? data.filter((todo: ITodoResponse) => todo?.status === 0) : [],
)

export const searchTodos = createSelector(
  (data: ITodoResponse[]) => data,
  (_data: ITodoResponse[], value: string) => value,
  (data, value) => {
    if (value === '') return data
    if (data) return data.filter(todo => todo?.description.toLowerCase().includes(value.toLowerCase()))
    return []
  }
)

export const searchAllTodos = createSelector(
  selectAll,
  (_data: ITodoResponse[], value: string) => value,
  (data, value) => searchTodos(data, value),
)

export const searchNoCompleteTodos = createSelector(
  selectNoCompleteTodos,
  (_data: ITodoResponse[], value: string) => value,
  (data, value) => searchTodos(data, value),
)
