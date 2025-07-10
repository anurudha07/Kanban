import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/userSlice'
import boardReducer from './features/boardSlice'
import favouriteReducer from './features/favouriteSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    board: boardReducer,          // matches slice.name = 'board'
    favourites: favouriteReducer, // matches slice.name = 'favourites'
  }
})
