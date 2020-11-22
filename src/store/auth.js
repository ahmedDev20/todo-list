import { createSelector, createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: null,
    loggedIn: false,
    loading: false,
    lastLogin: null,
  },
  reducers: {
    authRequested: (auth, action) => {
      auth.loading = true;
    },
    userLoggedIn: (auth, action) => {
      auth.loading = false;
      auth.loggedIn = true;
      auth.currentUser = action.payload;
      auth.lastLogin = action.payload.lastSignIn;
    },
    userLoggedOut: (auth, action) => {
      auth.loading = false;
      auth.loggedIn = false;
      auth.currentUser = null;
      auth.lastLogin = null;
    },
  },
});

export default slice.reducer;
export const { authRequested, userLoggedIn, userLoggedOut } = slice.actions;

export const getCurrentUser = createSelector(
  state => state.auth,
  auth => auth
);
