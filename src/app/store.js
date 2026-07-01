import { configureStore } from "@reduxjs/toolkit";
import {
  authReducer,
  cartReducer,
  productReducer,
  productDetailReducer,
  reviewsReducer,
  checkoutReducer,
} from "../features";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    productDetail: productDetailReducer,
    reviews: reviewsReducer,
    checkout: checkoutReducer,
  },
});