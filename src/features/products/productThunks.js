import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllProducts,
  getAttributes,
  getCategories,
  getOwnedProducts,
  deleteProduct,
  activateProduct,
  deactivateProduct,
} from "../../api/products";
import { buildExploreQueryKey } from "./productHelper";

export const fetchOwnedProducts = createAsyncThunk(
  "products/fetchOwned",
  async (page = 0, { rejectWithValue }) => {
    try {
      return await getOwnedProducts(page);
    } catch (error) {
      return rejectWithValue(error.message || "Error al cargar productos");
    }
  },
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
  },
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
  },
);

export const fetchProductFilterOptions = createAsyncThunk(
  "products/fetchFilterOptions",
  async (_, { rejectWithValue }) => {
    try {
      const [attributesData, categoriesData] = await Promise.all([
        getAttributes(),
        getCategories(),
      ]);

      return {
        categories: categoriesData,
        sizes:
          attributesData.find((attribute) => attribute.code === "TALLE")
            ?.values || [],
        colors:
          attributesData.find((attribute) => attribute.code === "COLOR")
            ?.values || [],
      };
    } catch (error) {
      return rejectWithValue(
        error.message || "Error al cargar opciones de filtros",
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const filterOptions = getState().products.filterOptions;

      return !filterOptions.initialized && !filterOptions.loading;
    },
  },
);

export const fetchExploreProducts = createAsyncThunk(
  "products/fetchExplore",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { page, size, filters } = getState().products.explore;

      return await getAllProducts({
        page,
        size,
        search: filters.search,
        categoryIds: filters.categoryIds,
        sizeIds: filters.sizeIds,
        colorIds: filters.colorIds,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
      });
    } catch (error) {
      return rejectWithValue(error.message || "Error al cargar productos");
    }
  },
  {
    condition: (_, { getState }) => {
      const explore = getState().products.explore;
      const queryKey = buildExploreQueryKey(explore);

      if (explore.loading) {
        return false;
      }

      if (explore.initialized && explore.lastQueryKey === queryKey) {
        return false;
      }

      return true;
    },
  },
);
