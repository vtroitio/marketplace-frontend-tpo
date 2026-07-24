import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getReviewsByProductId,
  createReview,
  validatePurchase,
} from "../../api/reviews";

export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (productId, { rejectWithValue }) => {
    try {
      const data = await getReviewsByProductId(productId);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return rejectWithValue(
        error.message || "No se pudieron cargar las reseñas.",
      );
    }
  },
  {
    condition: (productId, { getState }) => {
      const reviews = getState().reviews;

      if (reviews.loading) {
        return false;
      }

      if (String(reviews.loadedProductId) === String(productId)) {
        return false;
      }

      return true;
    },
  },
);

export const validateCanCreateReview = createAsyncThunk(
  "reviews/validateCanCreateReview",
  async (productId, { rejectWithValue }) => {
    try {
      const data = await validatePurchase(productId);
      return Boolean(data.purchased);
    } catch (error) {
      return rejectWithValue(
        error.message || "No se pudo validar la compra.",
      );
    }
  },
  {
    condition: (productId, { getState }) => {
      const validation = getState().reviews.purchaseValidation;

      const sameProduct =
        String(validation.productId) === String(productId);

      if (sameProduct && validation.loading) {
        return false;
      }

      if (sameProduct && validation.checked) {
        return false;
      }

      return true;
    },
  },
);

export const createProductReview = createAsyncThunk(
  "reviews/createProductReview",
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      return await createReview(productId, reviewData);
    } catch (error) {
      return rejectWithValue(
        error.message || "No se pudo publicar la reseña.",
      );
    }
  },
);