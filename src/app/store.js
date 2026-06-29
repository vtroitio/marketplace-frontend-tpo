import { configureStore } from "@reduxjs/toolkit";
import { authReducer, cartReducer } from "../features";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});
