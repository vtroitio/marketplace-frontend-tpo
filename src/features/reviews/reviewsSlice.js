import { createSlice } from "@reduxjs/toolkit";
import {
  fetchReviews,
  createProductReview,
  validateCanCreateReview,
} from "./reviewsThunks";

const initialState = {
  items: [],
  loadedProductId: null,

  loading: false,
  creating: false,
  error: null,

  purchaseValidation: {
    productId: null,
    loading: false,
    checked: false,
    hasPurchased: false,
    error: null,
  },
};

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    clearReviews: () => initialState,

    resetReviewsForNewProduct: (state, action) => {
      const productId = action.payload;

      if (String(state.loadedProductId) === String(productId)) {
        return;
      }

      state.items = [];
      state.loadedProductId = null;
      state.loading = false;
      state.error = null;

      state.purchaseValidation = {
        productId: null,
        loading: false,
        checked: false,
        hasPurchased: false,
        error: null,
      };
    },
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
        state.loadedProductId = action.meta.arg;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.loadedProductId = action.meta.arg;
        state.error = action.payload || "No se pudieron cargar las reseñas.";
      })

      .addCase(validateCanCreateReview.pending, (state, action) => {
        state.purchaseValidation = {
          productId: action.meta.arg,
          loading: true,
          checked: false,
          hasPurchased: false,
          error: null,
        };
      })
      .addCase(validateCanCreateReview.fulfilled, (state, action) => {
        state.purchaseValidation = {
          productId: action.meta.arg,
          loading: false,
          checked: true,
          hasPurchased: action.payload,
          error: null,
        };
      })
      .addCase(validateCanCreateReview.rejected, (state, action) => {
        state.purchaseValidation = {
          productId: action.meta.arg,
          loading: false,
          checked: true,
          hasPurchased: false,
          error: action.payload || "No se pudo validar la compra.",
        };
      })

      .addCase(createProductReview.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createProductReview.fulfilled, (state, action) => {
        state.creating = false;

        if (action.payload) {
          state.items = [action.payload, ...state.items];
        }

        state.purchaseValidation.hasPurchased = false;
        state.purchaseValidation.checked = true;
      })
      .addCase(createProductReview.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || "No se pudo publicar la reseña.";
      });
  },
});

export const { clearReviews, resetReviewsForNewProduct } = reviewsSlice.actions;
export default reviewsSlice.reducer;