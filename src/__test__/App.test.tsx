import { screen, fireEvent } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import App from "../App"
import { setupStore } from '../redux/store'
import { renderWithProviders } from './tesyUtils'
import { apiSlice } from "../redux/api/apiSlices"
import { server } from '../__test__/server'


describe('TodoList App tests', () => {

  const store = setupStore()

  beforeAll(async () => {
    server.listen()
    store.dispatch(apiSlice.endpoints.getTodos.initiate())
  })
  afterAll(() => server.close())
  afterEach(() => server.resetHandlers())

  it('Should show an message when  the todo list is empty', async () => {
    renderWithProviders(<App />, { store })
    expect(screen.getByText('Todo List')).toBeVisible()
    await screen.findByText('No tienes tareas registradas')
  })

  it('Should create a new todo', async () => {
    renderWithProviders(<App />, { store })
    expect(screen.getByText('Todo List')).toBeVisible()
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    expect(screen.getByText('Descripción')).toBeVisible()
    expect(screen.getByText('Fecha limite')).toBeVisible()
    userEvent.type(screen.getByPlaceholderText('Descripción'), 'Test 1')
    userEvent.type(screen.getByPlaceholderText('Fecha limite'), '2021-12-04')
    const button = screen.getByText('Agregar')
    expect(button).toBeEnabled()
    fireEvent.click(button)
    await screen.findByText('Test 1')
  })

  it('Should validate the todo form, description and date required', async () => {
    renderWithProviders(<App />, { store })
    expect(screen.getByText('Todo List')).toBeVisible()
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    const button = screen.getByText('Agregar')
    expect(button).toBeDisabled()
    expect(screen.getByText('El campo descripcion es requerido')).toBeInTheDocument()
    expect(screen.getByText('El campo fecha es requerido')).toBeInTheDocument()
    userEvent.type(screen.getByPlaceholderText('Descripción'), 'Test 2')
    expect(screen.queryByText('El campo descripcion es requerido')).not.toBeInTheDocument()
    expect(screen.getByText('El campo fecha es requerido')).toBeInTheDocument()
    userEvent.type(screen.getByPlaceholderText('Fecha limite'), '2021-11-04')
    expect(screen.queryByText('El campo descripcion es requerido')).not.toBeInTheDocument()
    expect(screen.queryByText('El campo fecha es requerido')).not.toBeInTheDocument()
    expect(button).toBeEnabled()
    fireEvent.click(screen.getByText('Agregar'))
    await screen.findByText('Test 2')
  })

  it('Should render a list with several todos', async () => {
    renderWithProviders(<App />, { store })
    expect(screen.getByText('Todo List')).toBeVisible()
    await screen.findByText('Test 1')
    expect(screen.getByText('Test 2')).toBeVisible()
  })

  it('Should filter the todo list by description', async () => {
    renderWithProviders(<App />, { store })
    expect(screen.getByText('Todo List')).toBeVisible()
    expect(screen.getAllByTestId('todo-item')).toHaveLength(2)
    const input = screen.getByPlaceholderText('Buscar tarea')
    userEvent.type(input, '1')
    await expect(screen.getAllByTestId('todo-item')).toHaveLength(1)
    userEvent.clear(input)
    await expect(screen.getAllByTestId('todo-item')).toHaveLength(2)
    userEvent.type(input, '3')
    await screen.findByText('No tienes tareas registradas')
  })

  it('Should update a todo, description and date', async () => {
    renderWithProviders(<App />, { store })
    expect(screen.getByText('Todo List')).toBeVisible()
    const updateButtons = screen.getAllByTestId('fa-pencil')
    fireEvent.click(updateButtons[updateButtons.length - 1])
    const descriptionInput = screen.getByPlaceholderText('Descripción')
    expect(descriptionInput).toHaveValue('Test 2')
    const dateInput = screen.getByPlaceholderText('Fecha limite')
    expect(dateInput).toHaveValue('2021-11-04')
    userEvent.clear(descriptionInput)
    userEvent.clear(dateInput)
    userEvent.type(descriptionInput, 'Test 2 modificado')
    userEvent.type(dateInput, '2021-11-05')
    fireEvent.click(screen.getByText('Agregar'))
    await screen.findByText('Test 2 modificado')
    expect(screen.getByText('2021-11-05')).toBeInTheDocument()
  })

  it('Should update the todo status', async () => {
    renderWithProviders(<App />, { store })
    expect(screen.getByText('Todo List')).toBeVisible()
    const checkboxs = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxs[checkboxs.length -1])
    await expect(screen.getByText('Test 2 modificado')).toHaveStyle('text-decoration: line-through')
  })

  it('Should filter the todo list by completed status and toggle functionality button', async () => {
    renderWithProviders(<App />, { store })
    expect(screen.getByText('Todo List')).toBeVisible()
    expect(screen.getAllByTestId('todo-item')).toHaveLength(2)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[1])
    await expect(screen.queryByText('Test 2 modificado')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('todo-item')).toHaveLength(1)
    fireEvent.click(buttons[1])
    await expect(screen.getByText('Test 2 modificado')).toBeInTheDocument()
    expect(screen.getAllByTestId('todo-item')).toHaveLength(2)
  })

  it('Should the progress bar change its label text or percentage when a todo is completed', async () => {
    renderWithProviders(<App />, { store })
    const percentageBar = screen.getByText('1 de 2 tarea(s) completada(s)')
    expect(percentageBar).toBeInTheDocument()
    expect(percentageBar).toHaveStyle('background: linear-gradient(to right, yellow 0%, yellow 50%, white 50%, white 100%)')
  })

  it('Should delete a todo', async () => {
    renderWithProviders(<App />, { store })
    expect(screen.getByText('Todo List')).toBeVisible()
    const deleteButtons = screen.getAllByTestId('fa-trash-can')
    fireEvent.click(deleteButtons[deleteButtons.length - 1])
    await screen.findByText('Test 1')
    expect(screen.queryByText('Test 2 modificado')).not.toBeInTheDocument()
  })
})