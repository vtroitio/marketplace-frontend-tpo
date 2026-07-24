import { createSlice } from "@reduxjs/toolkit";
import {
  addItem,
  clearCart,
  decreaseItem,
  increaseItem,
  initializeCart,
  reloadCart,
  removeItem,
  validateCartForCheckout,
} from "./cartThunks";

const initialState = {
  items: [],
  loading: false,
  initialized: false,
  error: "",
  syncResults: [],
  syncedUserId: null,
  checkoutIssues: [],
};

function applyCartPayload(state, action) {
  const payload = action.payload ?? {};

  state.loading = false;

  if (Array.isArray(payload.items)) {
    state.items = payload.items;
  }

  if (Array.isArray(payload.syncResults)) {
    state.syncResults = payload.syncResults;
  }

  if (Array.isArray(payload.issues)) {
    state.checkoutIssues = payload.issues;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "initialized")) {
    state.initialized = payload.initialized;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "syncedUserId")) {
    state.syncedUserId = payload.syncedUserId;
  }

  state.error = payload.ok === false ? payload.message ?? "" : "";
}

function setCartPending(state) {
  state.loading = true;
  state.error = "";
}

function setCartRejected(state, action) {
  state.loading = false;
  state.error =
    action.payload?.message ||
    action.error?.message ||
    "Ocurrió un error con el carrito.";
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = "";
    },

    clearSyncResults: (state) => {
      state.syncResults = [];
    },

    clearCheckoutIssues: (state) => {
      state.checkoutIssues = [];
    },

    resetCartState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeCart.pending, setCartPending)
      .addCase(initializeCart.fulfilled, applyCartPayload)
      .addCase(initializeCart.rejected, setCartRejected)

      .addCase(reloadCart.pending, setCartPending)
      .addCase(reloadCart.fulfilled, applyCartPayload)
      .addCase(reloadCart.rejected, setCartRejected)

      .addCase(addItem.pending, setCartPending)
      .addCase(addItem.fulfilled, applyCartPayload)
      .addCase(addItem.rejected, setCartRejected)

      .addCase(increaseItem.pending, setCartPending)
      .addCase(increaseItem.fulfilled, applyCartPayload)
      .addCase(increaseItem.rejected, setCartRejected)

      .addCase(decreaseItem.pending, setCartPending)
      .addCase(decreaseItem.fulfilled, applyCartPayload)
      .addCase(decreaseItem.rejected, setCartRejected)

      .addCase(removeItem.pending, setCartPending)
      .addCase(removeItem.fulfilled, applyCartPayload)
      .addCase(removeItem.rejected, setCartRejected)

      .addCase(clearCart.pending, setCartPending)
      .addCase(clearCart.fulfilled, applyCartPayload)
      .addCase(clearCart.rejected, setCartRejected)

      .addCase(validateCartForCheckout.pending, setCartPending)
      .addCase(validateCartForCheckout.fulfilled, applyCartPayload)
      .addCase(validateCartForCheckout.rejected, setCartRejected);
  },
});

export const {
  clearCartError,
  clearSyncResults,
  clearCheckoutIssues,
  resetCartState,
} = cartSlice.actions;

export default cartSlice.reducer;