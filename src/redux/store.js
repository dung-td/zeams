import { configureStore } from "@reduxjs/toolkit"

import connectionReducer from "./slices/ConnectionSlice"
import authenticationReducer from "./slices/AuthenticationSlice"
import drawSlice from "./slices/DrawSlice"
import chatReducer from "./slices/ChatSlice"

export const store = configureStore({
  reducer: {
    connection: connectionReducer,
    authentication: authenticationReducer,
    draw: drawSlice,
    chat: chatReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
