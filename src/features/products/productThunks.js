import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getOwnedProducts,
  deleteProduct,
  activateProduct,
  deactivateProduct,
} from "../../api/products";

export const fetchOwnedProducts = createAsyncThunk(
  "products/fetchOwned",
  async (page = 0, { rejectWithValue }) => {
    try {
      return await getOwnedProducts(page);
    } catch (error) {
      return rejectWithValue(error.message || "Error al cargar productos");
    }
  }
);

export const removeProduct = createAsyncThunk(
  "products/remove",
  async (productId, { rejectWithValue }) => {
    try {
      await deleteProduct(productId);
      return productId;
    } catch (error) {
      return rejectWithValue(error.message || "Error al eliminar producto");
    }
  }
);

export const toggleProductActive = createAsyncThunk(
  "products/toggleActive",
  async ({ productId, isActive }, { rejectWithValue }) => {
    try {
      if (isActive) {
        await deactivateProduct(productId);
      } else {
        await activateProduct(productId);
      }
      return productId;
    } catch (error) {
      return rejectWithValue(error.message || "Error al cambiar estado");
    }
  }
);