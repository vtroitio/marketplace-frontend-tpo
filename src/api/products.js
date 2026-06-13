import { request } from "./api";

export function getOwnedProducts() {
  return request("/products/me", {
    method: "GET",
    auth: true,
  });
}

export function getProductById(productId) {
  return request(`/products/${productId}`, {
    method: "GET",
    auth: false,
  });
}

export function getProductForEdit(productId) {
  return request(`/products/${productId}/edit`, {
    method: "GET",
    auth: true,
  });
}

export function getAttributes() {
  return request("/attributes", {
    method: "GET",
    auth: false,
  });
}

export function getCategories() {
  return request("/categories", {
    method: "GET",
    auth: false,
  });
}
