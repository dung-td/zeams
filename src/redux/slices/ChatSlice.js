import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  messages: []
}

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages = [...state.messages, action.payload.newMessage]
    },
    updateMessages: (state, action) => {
      state.messages = [...action.payload.messages]
    }
  },
})

// Action creators are generated for each case reducer function
export const { addMessage, updateMessages } = chatSlice.actions

export const selectMessages = (state) => state.chat.messages

export default chatSlice.reducer
