import { createSlice } from "@reduxjs/toolkit";

const drawSlice = createSlice({
  name: 'drawSlice',
  initialState: {
    arrPoint: []
  },
  reducers: {
    addPoint: (state, action) => {
      state.arrPoint = [
        ...state.arrPoint,
        action.payload.data
      ]
    },
    setPoints: (state, action) => {
      state.arrPoint = [...action.payload.data]
    }
  }
})

export const {addPoint, setPoints} = drawSlice.actions
export default drawSlice.reducer