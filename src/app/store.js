import { configureStore } from "@reduxjs/toolkit";
import { authReducer, cartReducer, productDetailReducer } from "../features";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    productDetail: productDetailReducer
  },
});
