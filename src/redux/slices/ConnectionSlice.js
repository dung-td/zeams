import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  otherPeers: [],
  localStream: undefined,
  audio: true,
  video: true,
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
    },
    removePeer: (state, action) => {
      state.otherPeers.splice(action.payload.index, 1)
    },
    updateAudio: (state, action) => {
      state.audio = action.payload.audio
    },
    updateVideo: (state, action) => {
      state.video = action.payload.video
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  updateLocalStream,
  updateOtherPeers,
  addPeer,
  removePeer,
  updateAudio,
  updateVideo,
} = connectionSlice.actions

export const selectOtherPeers = (state) => state.connection.otherPeers
export const selectLocalStream = (state) => state.connection.localStream
export const selectAudio = (state) => state.connection.audio
export const selectVideo = (state) => state.connection.video

export default connectionSlice.reducer
