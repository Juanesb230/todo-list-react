import { fireEvent, render, screen, waitFor, cleanup, act } from "@testing-library/react"
import userEvent from '@testing-library/user-event';
import App from "../App"
import { axiosMock } from '../setupTests';

describe('TodoList App tests', () => {

  beforeEach(() => {
    axiosMock.get.mockResolvedValueOnce(
      {
        data: {
          data: [
            {
              description: 'Test 1',
              finish_at: 'Fri Jul 22 2022 11:26:29 GMT-0500 (hora de Ecuador)',
              id: 1,
              id_author: 1,
              status: 0
            },
            {
              description: 'Test 2',
              finish_at: new Date().toString(),
              id: 2,
              id_author: 1,
              status: 0
            }
          ]
        }
      });
  })

  afterEach(cleanup)

  it('Should render a list with several todos', async () => {
    render(<App />)
    screen.getByText('Todo List')
    await waitFor(() => {
      screen.getByText('Test 1')
      screen.getByText('Test 2')
    })
  })

  it('Should create a new todo', async () => {
    act(() => {
      axiosMock.get.mockResolvedValueOnce(
        {
          data: {
            data: [
              {
                description: 'Test 1',
                finish_at: new Date().toString(),
                id: 1,
                id_author: 1,
                status: 0
              },
              {
                description: 'Test 2',
                finish_at: new Date().toString(),
                id: 2,
                id_author: 1,
                status: 0
              },
              {
                description: 'Test 3',
                finish_at: new Date().toString(),
                id: 2,
                id_author: 1,
                status: 0
              }
            ]
          }
        })
    });
    render(<App />)
    screen.getByText('Todo List')
    await waitFor(() => {
      screen.getByText('Test 1')
      screen.getByText('Test 2')
    })
    fireEvent.click(screen.getByTestId('add-todo'))
    screen.getByText('Descripción')
    screen.getByText('Fecha limite')
    const inputDescription = screen.getByPlaceholderText('Descripción')
    const inputDate = screen.getByPlaceholderText('Fecha limite')
    userEvent.type(inputDescription, 'Test 3')
    userEvent.type(inputDate, '2020-07-22')
    expect(inputDescription).toHaveValue('Test 3')
    expect(inputDate).toHaveValue('2020-07-22')
    fireEvent.click(screen.getByText('Agregar'))
    await waitFor(() => { screen.getByText('Test 3') })
  })

  /**
  * 
  * Probar que el formulario muestre los mensajes de requerimiento cuando 
  * el formulario no tenga la descripción y la fecha ingresada 
 */
  it('Should validate the todo form, description and date required', async () => {
    axiosMock.get.mockResolvedValueOnce(
      {
        data: {
          data: [
            {
              description: 'Test 1',
              finish_at: new Date().toString(),
              id: 1,
              id_author: 1,
              status: 0
            },
            {
              description: 'Test 2',
              finish_at: new Date().toString(),
              id: 2,
              id_author: 1,
              status: 0
            },
            {
              description: 'Test 3',
              finish_at: new Date().toString(),
              id: 2,
              id_author: 1,
              status: 0
            }
          ]
        }
      });
    render(<App />)
    screen.getByText('Todo List')
    await waitFor(() => {
      screen.getByText('Test 1')
      screen.getByText('Test 2')
    })
    fireEvent.click(screen.getByTestId('add-todo'))
    screen.getByText('Descripción')
    screen.getByText('Fecha limite')
    const inputDescription = screen.getByPlaceholderText('Descripción')
    const inputDate = screen.getByPlaceholderText('Fecha limite')
    screen.getByText('Descripcion requerida')
    screen.getByText('Fecha requerida')
    userEvent.type(inputDescription, 'Test 3')
    userEvent.type(inputDate, '2020-07-22')
    expect(screen.queryByText('Descripcion requerida')).not.toBeInTheDocument()
    expect(screen.queryByText('Fecha requerida')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('Agregar'))
    await waitFor(() => { screen.getByText('Test 3') })
  })

  it('Should update a todo, description and date', async () => {
    axiosMock.get.mockResolvedValueOnce(
      {
        data: {
          data: [
            {
              description: 'Test 1 modificado',
              finish_at: 'Fri Jul 22 2022 11:26:29 GMT-0500 (hora de Ecuador)',
              id: 1,
              id_author: 1,
              status: 0
            },
            {
              description: 'Test 2',
              finish_at: new Date().toString(),
              id: 2,
              id_author: 1,
              status: 0
            }
          ]
        }
      });
    render(<App />)
    screen.getByText('Todo List')
    await waitFor(() => {
      screen.getByText('Test 1')
      screen.getByText('Test 2')
    })
    const editButtons = screen.getAllByTestId('fa-solid fa-pencil')
    fireEvent.click(editButtons[0])
    screen.getByText('Descripción')
    screen.getByText('Fecha limite')
    const inputDescription = screen.getByPlaceholderText('Descripción')
    const inputDate = screen.getByPlaceholderText('Fecha limite')
    expect(inputDescription).toHaveValue('Test 1')
    expect(inputDate).toHaveValue('2022-07-22')
    userEvent.type(inputDescription, 'Test 1 modificado')
    fireEvent.click(screen.getByText('Actualizar'))
    await waitFor(() => {
      screen.getByText('Test 1 modificado')
      screen.getByText('Test 2')
    })
  })


  it('Should delete a todo', async () => {
    render(<App />)
    screen.getByText('Todo List')
    await waitFor(() => {
      screen.getByText('Test 1')
      screen.getByText('Test 2')
    })
    const deleteButtons = screen.getAllByTestId('fa-solid fa-trash-can')
    fireEvent.click(deleteButtons[0])
    await waitFor(() => {
      expect(screen.queryByText('Test 1')).not.toBeInTheDocument()
    })
    fireEvent.click(deleteButtons[0])
    await waitFor(() => {
      screen.getByText('No hay todos en la lista')
    })
  })

  /**
  * 
  * Probar que el formulario muestre los mensajes de requerimiento cuando 
  * el formulario no tenga la descripción y la fecha ingresada 
 */
  it('Should update the todo status', async () => {
    render(<App />)
    screen.getByText('Todo List')
    await waitFor(() => {
      screen.getByText('Test 1')
      screen.getByText('Test 2')
    })
    const checks = screen.getAllByRole('checkbox')
    fireEvent.click(checks[0])
    await waitFor(() => {
      expect(checks[0]).toBeChecked()
    })
    fireEvent.click(checks[0])
    await waitFor(() => {
      expect(checks[0]).not.toBeChecked()
    })
  })

  /**
  * 
  * Probar que la barra de estado cambia cuando se completa una tarea  
  * se puede probar por el cambio en texto o por porcentaje de completitud
 */
  it('Should the progress bar change its label text or percentage when a todo is completed', async () => {
    render(<App />)
    screen.getByText('Todo List')
    await waitFor(() => {
      screen.getByText('Test 1')
      screen.getByText('Test 2')
    })
    screen.getByText('0 de 2 completados')
    const checks = screen.getAllByRole('checkbox')
    fireEvent.click(checks[0])
    await waitFor(() => {
      screen.getByText('1 de 2 completados')
    })
  })

  /**
   * 
   * Probar el filtro de las tareas por descripcion
  */
  it('Should filter the todo list by description', async () => {

  })

  /**
   * 
   * Probar el filtro de tareas que falta por completar y que una vez esten filtradas a dar click nuevamente 
   * sobre el boton del filtro se muestren todos la lista nuevamente 
  */
  it('Should filter the todo list by completed status and toggle functionality button', async () => {

  })

})