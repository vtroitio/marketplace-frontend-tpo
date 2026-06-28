import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  login,
  register,
  logout,
  restoreSession,
} from "../../api/auth";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await login(credentials);
    } catch (error) {
      return rejectWithValue(error.message || "Error al iniciar sesión");
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      return await register(userData);
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Error al registrarse",
        errors: error.errors || null,
      });
    }
  }
);

export const restoreUserSession = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      return await restoreSession();
    } catch (error) {
      return rejectWithValue(error.message || "Sesión expirada");
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logout();
      return true;
    } catch (error) {
      return rejectWithValue(error.message || "Error al cerrar sesión");
    }
  },
);
