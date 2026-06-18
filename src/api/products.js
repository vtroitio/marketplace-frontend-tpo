import { request } from "./api";

export function getOwnedProducts(page = 0) {
  return request(`/products/me?size=5&page=${page}`, {
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

export function createProduct(dto) {
  return request("/products", {
    method: "POST",
    auth: true,
    body: dto,
  });
}

export function updateProduct(productId, dto) {
  return request(`/products/${productId}`, {
    method: "PATCH",
    auth: true,
    body: dto,
  });
}

export function deleteProduct(productId) {
  return request(`/products/${productId}`, {
    method: "DELETE",
    auth: true,
  });
}

export function activateProduct(productId) {
  return request(`/products/${productId}/activate`, {
    method: "PATCH",
    auth: true,
  });
}

export function deactivateProduct(productId) {
  return request(`/products/${productId}/deactivate`, {
    method: "PATCH",
    auth: true,
  });
}

export function uploadVariantImages(productId, variantId, files) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  return request(`/products/${productId}/variants/${variantId}/images`, {
    method: "POST",
    auth: true,
    body: formData,
  });
}

export function setCoverImage(productId, imageId) {
  return request(`/products/${productId}/cover-image/${imageId}`, {
    method: "PATCH",
    auth: true,
  });
}


