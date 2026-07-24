export const selectReviews = (state) => state.reviews.items;

export const selectReviewsLoading = (state) => state.reviews.loading;

export const selectReviewsCreating = (state) => state.reviews.creating;

export const selectReviewsError = (state) => state.reviews.error;

export const selectHasPurchasedProduct = (productId) => (state) => {
  const validation = state.reviews.purchaseValidation;

  if (String(validation.productId) !== String(productId)) {
    return false;
  }

  return Boolean(validation.hasPurchased);
};

export const selectReviewPurchaseValidating = (productId) => (state) => {
  const validation = state.reviews.purchaseValidation;

  if (String(validation.productId) !== String(productId)) {
    return false;
  }

  return Boolean(validation.loading);
};