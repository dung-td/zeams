import { configureStore } from "@reduxjs/toolkit"

import connectionReducer from "./slices/ConnectionSlice"
import authenticationReducer from "./slices/AuthenticationSlice"
import drawSlice from "./slices/DrawSlice"

export const store = configureStore({
  reducer: {
    connection: connectionReducer,
    authentication: authenticationReducer,
    draw: drawSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
