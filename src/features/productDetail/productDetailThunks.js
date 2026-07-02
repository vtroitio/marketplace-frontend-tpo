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
  {
    condition: (productId, { getState }) => {
      const productDetail = getState().productDetail;

      const isSameProduct =
        String(productDetail.productId) === String(productId) ||
        String(productDetail.product?.id) === String(productId);

      if (productDetail.loading && isSameProduct) {
        return false;
      }

      if (productDetail.initialized && isSameProduct && productDetail.product) {
        return false;
      }

      return true;
    },
  },
);
