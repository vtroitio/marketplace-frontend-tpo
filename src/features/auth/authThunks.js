import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, logout, restoreSession } from "../../api/auth";
import { getProfile } from "../../api/users";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { accessToken } = await login(credentials);
      const user = await getProfile(accessToken);
      return { accessToken, user };
    } catch (error) {
      return rejectWithValue(error.message || "Error al iniciar sesión");
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { accessToken } = await register(userData);
      const user = await getProfile(accessToken);
      return { accessToken, user };
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
      const { accessToken } = await restoreSession();
      const user = await getProfile(accessToken);
      return { accessToken, user };
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