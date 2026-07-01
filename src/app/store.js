import { configureStore } from "@reduxjs/toolkit";
import {
  authReducer,
  cartReducer,
  productDetailReducer,
  reviewsReducer,
  checkoutReducer,
} from "../features";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    productDetail: productDetailReducer,
    reviews: reviewsReducer,
    checkout: checkoutReducer,
  },
});
