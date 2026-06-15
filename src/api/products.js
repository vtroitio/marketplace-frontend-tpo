import { request } from "./api";

export function getAllProducts({
  page = 0,
  size = 20,
  search = "",
  categoryIds = [],
  sizeIds = [],
  colorIds = [],
  minPrice,
  maxPrice,
} = {}) {
  const params = new URLSearchParams();

  params.set("page", page);
  params.set("size", size);

  if (search.trim() !== "") {
    params.set("search", search.trim());
  }

  if (categoryIds.length > 0) {
    params.set("categoryIds", categoryIds.join(","));
  }

  if (sizeIds.length > 0) {
    params.set("sizeIds", sizeIds.join(","));
  }

  if (colorIds.length > 0) {
    params.set("colorIds", colorIds.join(","));
  }

  if (minPrice !== "" && minPrice != null) {
    params.set("minPrice", minPrice);
  }

  if (maxPrice !== "" && maxPrice != null) {
    params.set("maxPrice", maxPrice);
  }

  return request(`/products?${params.toString()}`, {
    auth: false,
  });
}

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
