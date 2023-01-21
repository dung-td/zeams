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
    }
  }
})

export const {addPoint} = drawSlice.actions
export default drawSlice.reducer