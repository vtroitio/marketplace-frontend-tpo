import { createSlice } from "@reduxjs/toolkit";
import { fetchProductById } from "./productDetailThunks";

const initialState = {
  product: null,      
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
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;  
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.product = null;
        state.error = action.payload || "Error al cargar el producto.";   
      });
  },
});

export const { clearProductDetail } = productDetailSlice.actions;  
export default productDetailSlice.reducer;               