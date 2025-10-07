import { createSlice } from '@reduxjs/toolkit'

const initialState = { value: [] }

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoards: (state, action) => {
      state.value = action.payload
    },
    addBoard: (state, action) => {
      state.value.unshift(action.payload)
    },
    updateBoard: (state, action) => {
      const changes = action.payload
      const idx = state.value.findIndex(b => b.id === changes.id)
      if (idx !== -1) {
        state.value[idx] = { ...state.value[idx], ...changes }
      }
    },
    removeBoard: (state, action) => {
      state.value = state.value.filter(b => b.id !== action.payload)
    },
  }
})

export const { setBoards, addBoard, updateBoard, removeBoard } = boardSlice.actions
export default boardSlice.reducer
