import { buildExploreQueryKey } from "./productHelper";

export const selectOwnedProducts = (state) => state.products.items;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectProductsPage = (state) => state.products.page;
export const selectProductsTotalPages = (state) => state.products.totalPages;
export const selectProductsTotalElements = (state) => state.products.totalElements;

export const selectOwnedSearch = (state) => state.products.ownedSearch;

export const selectOwnedProductsFiltered = (state) => {
  const items = state.products.items;
  const search = state.products.ownedSearchApplied;
  if (!search) return items;
  return items.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
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