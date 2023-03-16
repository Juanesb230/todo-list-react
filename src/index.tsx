import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { setupStore } from './redux/store';
import { apiSlice } from './redux/api/apiSlices';
import './index.css';
import App from './App';
import { worker } from './__test__/server/mock';

async function start() {

  if (process.env.NODE_ENV === 'development') {
    worker.start()
  }

  const store = setupStore()
  store.dispatch(apiSlice.endpoints.getTodos.initiate())

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

start()


