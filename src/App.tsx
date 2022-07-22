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

const App = () => {

  const [initialValue, setinitialValue] = useState({ description: '', finish_at: '', status: 0 })

  return (
    <div className="app-container">
      <Typography align='center' fontSize='40' color={COLORS.textColor} lineHeight='48' className='title'>
        Todo List
      </Typography>
      <Router>
        <Switch>
          <Route exact path="/">
            <TodoList updateTodo={(todo) => setinitialValue(todo)}></TodoList>
          </Route>
          <Route path="/create">
            <TodoForm></TodoForm>
          </Route>
          <Route path="/update">
            <TodoForm initialTodo={initialValue}></TodoForm>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
