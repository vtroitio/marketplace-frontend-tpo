import { selectCartSubtotal } from "../cart";

export const CHECKOUT_SHIPPING_COST = 15.0;

export const selectCheckoutTotal = (state) =>
  selectCartSubtotal(state) -
  state.checkout.discountAmount +
  CHECKOUT_SHIPPING_COST;

export const selectCheckoutLoading = (state) =>
  state.checkout.validatingCheckout ||
  state.checkout.applyingCoupon ||
  state.checkout.submitting;
