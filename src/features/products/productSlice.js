import { createSlice } from "@reduxjs/toolkit";
import { fetchOwnedProducts, removeProduct, toggleProductActive } from "./productThunks";

const initialState = {
  items: [],
  page: 0,
  totalPages: 0,
  totalElements: 0,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    resetProductState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.content || [];
        state.totalPages = action.payload?.totalPages || 0;
        state.totalElements = action.payload?.totalElements || 0;
      })
      .addCase(fetchOwnedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
        state.totalElements = Math.max(0, state.totalElements - 1);
        state.totalPages = Math.ceil(state.totalElements / 5);
      })

      .addCase(toggleProductActive.fulfilled, (state, action) => {
        const product = state.items.find((p) => p.id === action.payload);
        if (product) product.active = !product.active;
      });
  },
});

export const { setPage, resetProductState } = productSlice.actions;
export default productSlice.reducer;