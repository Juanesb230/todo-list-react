import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from '@testing-library/user-event';
import App from "../App"
import { axiosMock } from '../setupTests';

describe('TodoList App tests', () => {

  it('Should render a list with several todos', async () => {
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
  })

  it('Should create a new todo', async () => {
    axiosMock.get.mockResolvedValue(
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
            }
          ]
        }
      });
    axiosMock.post.mockResolvedValueOnce(
      {data: {}}
    )
    render(<App />)
    screen.getByText('Todo List')
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


  })

  it('Should update a todo, description and date', async () => {

  })


  it('Should delete a todo', async () => {

  })

  /**
  * 
  * Probar que el formulario muestre los mensajes de requerimiento cuando 
  * el formulario no tenga la descripción y la fecha ingresada 
 */
  it('Should update the todo status ', async () => {

  })

  it('Should show an message when  the todo list is empty  ', async () => {

  })

  /**
  * 
  * Probar que la barra de estado cambia cuando se completa una tarea  
  * se puede probar por el cambio en texto o por porcentaje de completitud
 */
  it('Should the progress bar change its label text or percentage when a todo is completed ', async () => {

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