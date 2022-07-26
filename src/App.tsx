import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import useTodos from "./hooks/useTodos";
import useServer from "./hooks/useServer";
import Context from "./store";

import MessageBar from "./components/atoms/message-bar";
import Typography from "./components/atoms/typography";
import { COLORS } from "./shared/theme/colors";
import TodoForm from "./components/organism/todo-form";
import TodoList from "./components/organism/todo-list";
import './App.css'

const App = () => {

  const serverReducer = useServer()
  const todosReducer = useTodos()

  const store = {
    serverReducer,
    todosReducer
  }

  return (
    <Context.Provider value={store}>
      <div className="app-container">
        <MessageBar variant={serverReducer[0]} />
        <Typography align='center' fontSize='40' color={COLORS.textColor} lineHeight='48' className='title'>
          Todo List
        </Typography>
        <Router>
          <Switch>
            <Route exact path="/">
              <TodoList />
            </Route>
            <Route path="/create">
              <TodoForm />
            </Route>
            <Route path="/update/:id">
              <TodoForm />
            </Route>
          </Switch>
        </Router>
      </div>
    </Context.Provider>
  );
}

export default App;
