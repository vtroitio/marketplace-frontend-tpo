import { createSlice } from "@reduxjs/toolkit";
import {
  applyCheckoutCoupon,
  confirmCheckout,
  initializeCheckout,
} from "./checkoutThunks";

const initialState = {
  initialized: false,

  order: null,

  couponCode: "",
  appliedCoupon: null,
  discountAmount: 0,

  validatingCheckout: false,
  applyingCoupon: false,
  submitting: false,

  error: null,
  couponError: null,
  submitError: null,

  issues: [],
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCouponCode: (state, action) => {
      state.couponCode = action.payload;
      state.couponError = null;
    },

    removeCheckoutCoupon: (state) => {
      state.couponCode = "";
      state.appliedCoupon = null;
      state.discountAmount = 0;
      state.couponError = null;
    },

    clearCheckoutErrors: (state) => {
      state.error = null;
      state.couponError = null;
      state.submitError = null;
    },

    clearCheckoutOrder: (state) => {
      state.order = null;
    },

    resetCheckoutState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeCheckout.pending, (state) => {
        state.validatingCheckout = true;
        state.error = null;
        state.issues = [];
      })
      .addCase(initializeCheckout.fulfilled, (state) => {
        state.validatingCheckout = false;
        state.initialized = true;
        state.error = null;
        state.issues = [];
      })
      .addCase(initializeCheckout.rejected, (state, action) => {
        state.validatingCheckout = false;
        state.initialized = true;
        state.error =
          action.payload?.message || "No se pudo inicializar el checkout.";
        state.issues = action.payload?.issues ?? [];
      })

      .addCase(applyCheckoutCoupon.pending, (state) => {
        state.applyingCoupon = true;
        state.couponError = null;
      })
      .addCase(applyCheckoutCoupon.fulfilled, (state, action) => {
        state.applyingCoupon = false;
        state.appliedCoupon = {
          code: action.payload.code,
          discountAmount: action.payload.discountAmount,
          totalAfterDiscount: action.payload.totalAfterDiscount,
        };
        state.discountAmount = action.payload.discountAmount;
        state.couponCode = action.payload.code;
        state.couponError = null;
      })
      .addCase(applyCheckoutCoupon.rejected, (state, action) => {
        state.applyingCoupon = false;
        state.appliedCoupon = null;
        state.discountAmount = 0;
        state.couponError =
          action.payload?.message || "No se pudo aplicar el cupón.";
      })

      .addCase(confirmCheckout.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
      })
      .addCase(confirmCheckout.fulfilled, (state, action) => {
        state.submitting = false;
        state.order = action.payload;
        state.submitError = null;

        state.couponCode = "";
        state.appliedCoupon = null;
        state.discountAmount = 0;
      })
      .addCase(confirmCheckout.rejected, (state, action) => {
        state.submitting = false;
        state.submitError =
          action.payload?.message || "No se pudo confirmar la compra.";
        state.issues = action.payload?.issues ?? [];
      });
  },
});

export const {
  setCouponCode,
  removeCheckoutCoupon,
  clearCheckoutErrors,
  clearCheckoutOrder,
  resetCheckoutState,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;