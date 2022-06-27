import { configureStore, combineReducers } from '@reduxjs/toolkit';
import type { PreloadedState } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlices';

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer
})

export const setupStore = (preloadedState?: PreloadedState<RootState>) => (
  configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(apiSlice.middleware),
    preloadedState
  })
);


export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
