import { request } from "./client";

export function getReviewsByProductId(productId) {
  return request(`/products/${productId}/reviews`, {
    method: "GET",
    auth: false,
  });
}

export function validatePurchase(productId) {
  return request(`/products/${productId}/reviews/purchase-validation`, {
    method: "GET",
    auth: true,
  });
}

export function createReview(productId, reviewData) {
  return request(`/products/${productId}/reviews`, {
    method: "POST",
    auth: true,
    body: reviewData,
  });
}
