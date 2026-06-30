import { configureStore } from "@reduxjs/toolkit";
import { authReducer, cartReducer, productReducer } from "../features";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
  },
});