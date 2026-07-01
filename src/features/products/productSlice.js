import { createSlice } from "@reduxjs/toolkit";
import {
  fetchExploreProducts,
  fetchOwnedProducts,
  fetchProductFilterOptions,
  removeProduct,
  toggleProductActive,
} from "./productThunks";
import { buildExploreQueryKey } from "./productHelper";

const defaultExploreFilters = {
  search: "",
  categoryIds: [],
  sizeIds: [],
  colorIds: [],
  minPrice: "",
  maxPrice: "",
};

const initialState = {
  items: [],
  page: 0,
  totalPages: 0,
  totalElements: 0,
  loading: false,
  error: null,

  featured: {
    items: [],
    initialized: false,
  },

  filterOptions: {
    categories: [],
    sizes: [],
    colors: [],
    loading: false,
    initialized: false,
    error: null,
  },

  explore: {
    content: [],
    page: 0,
    size: 12,
    totalPages: 0,
    totalElements: 0,
    loading: false,
    initialized: false,
    error: null,
    lastQueryKey: null,
    filters: defaultExploreFilters,
    draftFilters: defaultExploreFilters,
  },
};

function sameId(a, b) {
  return String(a) === String(b);
}

function toggleId(list, id) {
  const exists = list.some((currentId) => sameId(currentId, id));

  if (exists) {
    return list.filter((currentId) => !sameId(currentId, id));
  }

  return [...list, id];
}

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },

    resetProductState: () => initialState,

    setExplorePage: (state, action) => {
      state.explore.page = action.payload;
    },

    setExploreSearch: (state, action) => {
      state.explore.draftFilters.search = action.payload;
    },

    applyExploreSearch: (state) => {
      state.explore.page = 0;
      state.explore.filters.search = state.explore.draftFilters.search.trim();
    },

    toggleExploreCategory: (state, action) => {
      state.explore.draftFilters.categoryIds = toggleId(
        state.explore.draftFilters.categoryIds,
        action.payload,
      );
    },

    toggleExploreSize: (state, action) => {
      state.explore.draftFilters.sizeIds = toggleId(
        state.explore.draftFilters.sizeIds,
        action.payload,
      );
    },

    toggleExploreColor: (state, action) => {
      state.explore.draftFilters.colorIds = toggleId(
        state.explore.draftFilters.colorIds,
        action.payload,
      );
    },

    setExploreMinPrice: (state, action) => {
      state.explore.draftFilters.minPrice = action.payload;
    },

    setExploreMaxPrice: (state, action) => {
      state.explore.draftFilters.maxPrice = action.payload;
    },

    applyExploreFilters: (state) => {
      state.explore.page = 0;
      state.explore.filters = {
        ...state.explore.filters,
        categoryIds: state.explore.draftFilters.categoryIds,
        sizeIds: state.explore.draftFilters.sizeIds,
        colorIds: state.explore.draftFilters.colorIds,
        minPrice: state.explore.draftFilters.minPrice,
        maxPrice: state.explore.draftFilters.maxPrice,
      };
    },

    clearExploreFilters: (state) => {
      state.explore.page = 0;
      state.explore.filters = defaultExploreFilters;
      state.explore.draftFilters = defaultExploreFilters;
    },

    resetExploreProducts: (state) => {
      state.explore = initialState.explore;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload?.content || [];
        state.totalPages = action.payload?.totalPages || 0;
        state.totalElements = action.payload?.totalElements || 0;
      })
      .addCase(fetchOwnedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
        state.totalElements = Math.max(0, state.totalElements - 1);
        state.totalPages = Math.ceil(state.totalElements / 5);
      })

      .addCase(toggleProductActive.fulfilled, (state, action) => {
        const product = state.items.find((p) => p.id === action.payload);

        if (product) {
          product.active = !product.active;
        }
      })

      .addCase(fetchProductFilterOptions.pending, (state) => {
        state.filterOptions.loading = true;
        state.filterOptions.error = null;
      })
      .addCase(fetchProductFilterOptions.fulfilled, (state, action) => {
        state.filterOptions.loading = false;
        state.filterOptions.initialized = true;
        state.filterOptions.categories = action.payload.categories;
        state.filterOptions.sizes = action.payload.sizes;
        state.filterOptions.colors = action.payload.colors;
      })
      .addCase(fetchProductFilterOptions.rejected, (state, action) => {
        state.filterOptions.loading = false;
        state.filterOptions.initialized = false;
        state.filterOptions.error =
          action.payload || "Error al cargar opciones de filtros";
      })

      .addCase(fetchExploreProducts.pending, (state) => {
        state.explore.loading = true;
        state.explore.error = null;
      })
      .addCase(fetchExploreProducts.fulfilled, (state, action) => {
        state.explore.loading = false;
        state.explore.initialized = true;
        state.explore.content = action.payload?.content || [];
        state.explore.totalPages = action.payload?.totalPages || 0;
        state.explore.totalElements = action.payload?.totalElements || 0;

        if (!state.featured.initialized) {
          state.featured.items = (action.payload?.content || []).slice(0, 3);
        }
        state.featured.initialized = true;

        state.explore.lastQueryKey = buildExploreQueryKey(state.explore);
      })
      .addCase(fetchExploreProducts.rejected, (state, action) => {
        state.explore.loading = false;
        state.explore.error = action.payload || "Error al cargar productos";
      });
  },
});

export const {
  setPage,
  resetProductState,
  setExplorePage,
  setExploreSearch,
  applyExploreSearch,
  toggleExploreCategory,
  toggleExploreSize,
  toggleExploreColor,
  setExploreMinPrice,
  setExploreMaxPrice,
  applyExploreFilters,
  clearExploreFilters,
  resetExploreProducts,
} = productSlice.actions;

export default productSlice.reducer;
