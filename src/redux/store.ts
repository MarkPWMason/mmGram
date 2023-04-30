import { configureStore } from '@reduxjs/toolkit'
import postReducer from './slices/postSlice'

const store = configureStore({
  reducer: {
    postSlice: postReducer//exampleSlice has to match the value in exampleSlice.ts
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default  store