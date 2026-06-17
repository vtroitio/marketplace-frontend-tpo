import { request } from "./api";

export function getReviewsByProductId(productId) {
  return request(`/products/${productId}/reviews`, {
    method: "GET",
    auth: false,
  });
}

export function createReview(productId, reviewData) {
  return request(`/products/${productId}/reviews`, {
    method: "POST",
    auth: true,
    body: reviewData,
  });
}