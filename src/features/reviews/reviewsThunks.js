import { createAsyncThunk } from "@reduxjs/toolkit";
import { getReviewsByProductId, createReview } from "../../api/reviews";

export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",                                      
  async (productId, { rejectWithValue }) => {
    try {
      const data = await getReviewsByProductId(productId);                   
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return rejectWithValue(error.message || "No se pudieron cargar las reseñas.");
    }
  },
);

export const createProductReview = createAsyncThunk(
  "reviews/createProductReview",
  async ({ productId, reviewData }, { dispatch, rejectWithValue }) => {
    try {
      const created = await createReview(productId, reviewData);
      dispatch(fetchReviews(productId));
      return created;
    } catch (error) {
      return rejectWithValue(error.message || "No se pudo publicar la reseña.");
    }
  },
);