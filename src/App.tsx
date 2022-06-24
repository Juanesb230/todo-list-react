import { useState } from "react";
import Typography from "./components/atoms/typography";
import { COLORS } from "./shared/theme/colors";
import TodoForm from "./components/organism/todo-form";
import TodoList from "./components/organism/todo-list";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css'
import { ITodoResponse } from "./models";

const App = () => {

  const [initialValue, setinitialValue] = useState({ description: '', finish_at: '', status: 0 })

  const updateTodo = async (todo: ITodoResponse) => {
    await setinitialValue(todo)
  }

  return (
    <div className="app-container">
      <Typography align='center' fontSize='40' color={COLORS.textColor} lineHeight='48' className='title'>
        Todo List
      </Typography>
      <Router>
        <Switch>
          <Route exact path="/">
            <TodoList updateTodo={updateTodo}></TodoList>
          </Route>
          <Route path="/create">
            <TodoForm initialValue={{ description: '', finish_at: '', status: 0 }}></TodoForm>
          </Route>
          <Route path="/update">
            <TodoForm initialValue={initialValue}></TodoForm>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
