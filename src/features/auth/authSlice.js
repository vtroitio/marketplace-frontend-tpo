import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  restoreUserSession,
  logoutUser,
} from "./authThunks";

const initialState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAuthUser: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    clearAuthState: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.initialized = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.accessToken = null;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || "Error al iniciar sesión";
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.accessToken = null;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "Error al registrarse";
      })

      .addCase(restoreUserSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreUserSession.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(restoreUserSession.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.accessToken = null;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.accessToken = null;
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.initialized = true;
        state.error = null;
      });
  },
});

export const { updateAuthUser, clearAuthState } = authSlice.actions;

export default authSlice.reducer;
