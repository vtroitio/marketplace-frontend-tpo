import { createSelector } from "@reduxjs/toolkit";
import { buildExploreQueryKey } from "./productHelper";

export const selectOwnedProducts = (state) => state.products.items;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectProductsPage = (state) => state.products.page;
export const selectProductsTotalPages = (state) => state.products.totalPages;
export const selectProductsTotalElements = (state) =>
  state.products.totalElements;

export const selectOwnedSearch = (state) => state.products.ownedSearch;

export const selectOwnedProductsFiltered = (state) => {
  const items = state.products.items;
  const search = state.products.ownedSearchApplied;
  if (!search) return items;
  return items.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );
};

export const selectExploreActiveFiltersCount = (state) => {
  const filters = state.products.explore.draftFilters;

  return (
    filters.categoryIds.length +
    filters.sizeIds.length +
    filters.colorIds.length +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0)
  );
};

export const selectExploreQueryKey = (state) => {
  const explore = state.products.explore;
  return buildExploreQueryKey(explore);
};

export const selectExploreError = (state) =>
  state.products.explore.error || state.products.filterOptions.error;

export const selectFilterCategories = (state) =>
  state.products.filterOptions.categories;
export const selectFilterSizes = (state) => state.products.filterOptions.sizes;
export const selectFilterColors = (state) =>
  state.products.filterOptions.colors;

export const selectFilterOptionsInitialized = (state) =>
  state.products.filterOptions.initialized;

export const selectProducts = (state) => state.products.items;

export const selectOwnedSearchApplied = (state) =>
  state.products.ownedSearchApplied;

export const selectFeaturedProducts = (state) =>
  state.products.featured.items;

export const selectFilterOptions = (state) => state.products.filterOptions;
export const selectFilterOptionsLoading = (state) =>
  state.products.filterOptions.loading;
export const selectFilterOptionsError = (state) =>
  state.products.filterOptions.error;

export const selectProductFormOptions = (state) =>
  state.products.productFormOptions;

export const selectProductFormOptionsLoading = (state) =>
  state.products.productFormOptions.loading;

export const selectProductFormOptionsError = (state) =>
  state.products.productFormOptions.error;

export const selectCreateProductLoading = (state) =>
  state.products.createStatus.loading;

export const selectCreateProductError = (state) =>
  state.products.createStatus.error;

export const selectCreatedProduct = (state) =>
  state.products.createStatus.createdProduct;

export const selectExploreProducts = (state) =>
  state.products.explore.content;

export const selectExploreLoading = (state) =>
  state.products.explore.loading;

export const selectExplorePage = (state) => state.products.explore.page;

export const selectExploreTotalPages = (state) =>
  state.products.explore.totalPages;

export const selectExploreTotalElements = (state) =>
  state.products.explore.totalElements;

export const selectExploreFilters = (state) =>
  state.products.explore.filters;

export const selectExploreDraftFilters = (state) =>
  state.products.explore.draftFilters;

export const selectAllFilterCategories = (state) =>
  state.products.filterOptions.allCategories;

export const selectFilterAttributes = (state) =>
  state.products.filterOptions.attributes;

export const selectProductFormDataFromFilterOptions = createSelector(
  [
    selectAllFilterCategories,
    selectFilterAttributes,
    selectFilterSizes,
    selectFilterColors,
  ],
  (allCategories, attributes, sizes, colors) => ({
    _categories: allCategories,
    _attributes:
      attributes.length > 0
        ? attributes
        : [
            {
              code: "TALLE",
              values: sizes,
            },
            {
              code: "COLOR",
              values: colors,
            },
          ],
  }),
);