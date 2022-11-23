import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  otherPeers: [],
  localStream: undefined,
}

export const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    updateLocalStream: (state, action) => {
      state.localStream = action.payload.localStream
    },
    updateOtherPeers: (state, action) => {
      state.otherPeers = action.payload.otherPeers
    },
    addPeer: (state, action) => {
      state.otherPeers = [...state.otherPeers, action.payload.peer]
    }
  },
})

// Action creators are generated for each case reducer function
export const { updateLocalStream, updateOtherPeers, addPeer } = connectionSlice.actions

export const selectOtherPeers = (state) => state.connection.otherPeers
export const selectLocalStream = (state) => state.connection.localStream

export default connectionSlice.reducer
