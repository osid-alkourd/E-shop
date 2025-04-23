import { createReducer } from "@reduxjs/toolkit";
// action describe what happend while the reducer describe how states changes based on the action
const initialState = {
  isAuthenticated: false,
};

export const userReducer = createReducer(initialState, (builder) => {
    builder
      .addCase("LoadUserRequest", (state) => {
        state.loading = true;
      })
      .addCase("LoadUserSuccess", (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload;
      })
      .addCase("LoadUserFail", (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase("ClearError", (state) => {
        state.error = null;
      });
  });