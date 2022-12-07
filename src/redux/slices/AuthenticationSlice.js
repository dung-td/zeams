import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  email: null,
  userId: null,
  username: null,
  loggedIn: false,
}

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setSignIn: (state, action) => {
      state.email = action.payload.email
      state.loggedIn = action.payload.loggedIn
    },
    setSignOut: (state) => {
      state.email = null
      state.loggedIn = false
    },
    setUserId: (state, action) => {
      state.userId = action.payload.userId
    },
    setUsername: (state, action) => {
      state.username = action.payload.username
    },
  },
})

// Action creators are generated for each case reducer function
export const { setSignIn, setSignOut, setUserId, setUsername } =
  authenticationSlice.actions

export const selectAuthenState = (state) => state.authentication.loggedIn
export const selectUserEmail = (state) => state.authentication.email
export const selectUserId = (state) => state.authentication.userId
export const selectUsername = (state) => state.authentication.username

export default authenticationSlice.reducer
