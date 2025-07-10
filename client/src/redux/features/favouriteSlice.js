import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: [] }

const favouriteSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    setFavouriteList: (state, action) => {
      state.value = action.payload
    },
    updateFavourite: (state, action) => {
      const changes = action.payload
      const idx = state.value.findIndex(f => f.id === changes.id)
      if (idx !== -1) {
        state.value[idx] = { ...state.value[idx], ...changes }
      }
    },
    removeFavourite: (state, action) => {
      state.value = state.value.filter(f => f.id !== action.payload)
    },
  }
})

export const { setFavouriteList, updateFavourite, removeFavourite } = favouriteSlice.actions
export default favouriteSlice.reducer
