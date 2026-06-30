export const selectOwnedProducts = (state) => state.products.items;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectProductsPage = (state) => state.products.page;
export const selectProductsTotalPages = (state) => state.products.totalPages;
export const selectProductsTotalElements = (state) => state.products.totalElements;