import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProductById } from "../../api/products";

export const fetchProductById = createAsyncThunk(
  "productDetail/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      return await getProductById(productId);
    } catch (error) {
      return rejectWithValue(error.message || "No se pudo cargar el producto.");
    }
  },
);