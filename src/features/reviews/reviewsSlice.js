import { createSlice } from "@reduxjs/toolkit";
import { fetchReviews, createProductReview } from "./reviewsThunks";

const initialState = {
  items: [],
  loading: false,    
  creating: false,  
  error: null,      
};

const reviewsSlice = createSlice({
  name: "reviews",     
  initialState,
  reducers: {
    clearReviews: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;   
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "No se pudieron cargar las reseñas.";
      })
      .addCase(createProductReview.pending, (state) => {
        state.creating = true;  
        state.error = null;
      })
      .addCase(createProductReview.fulfilled, (state) => {
        state.creating = false;
      })
      .addCase(createProductReview.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || "No se pudo publicar la reseña.";
      });
  },
});

export const { clearReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;