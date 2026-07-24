import { createSlice } from "@reduxjs/toolkit";
import { fetchProductById } from "./productDetailThunks";

const initialState = {
  product: null,
  productId: null,
  loading: false,
  initialized: false,
  error: null,
};

const productDetailSlice = createSlice({
  name: "productDetail",       
  initialState,
  reducers: {
    clearProductDetail: () => initialState, 
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state, action) => {
        state.loading = true;  
        state.error = null;
        state.productId = action.meta.arg;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.product = action.payload;
        state.productId = action.meta.arg;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.product = null;
        state.error = action.payload || "Error al cargar el producto.";   
        state.productId = action.meta.arg;
      });
  },
});

export const { clearProductDetail } = productDetailSlice.actions;  
export default productDetailSlice.reducer;               