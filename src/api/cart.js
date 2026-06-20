import { request } from "./client";

export function getCart() {
  return request("/cart", {
    method: "GET",
    auth: true,
  });
}

export function syncCart(items) {
  return request("/cart/sync", {
    method: "POST",
    auth: true,
    body: {
      items: items.map((item) => ({
        variantId: item.variantId ?? item.id,
        quantity: item.quantity,
      })),
    },
  });
}

export function addCartItem({ variantId, quantity }) {
  return request("/cart/items", {
    method: "POST",
    auth: true,
    body: {
      productVariantId: variantId,
      quantity,
    },
  });
}

export function updateCartItem(itemId, quantity) {
  return request(`/cart/items/${itemId}`, {
    method: "PATCH",
    auth: true,
    body: {
      quantity,
    },
  });
}

export function removeCartItem(itemId) {
  return request(`/cart/items/${itemId}`, {
    method: "DELETE",
    auth: true,
  });
}

export function clearBackendCart() {
  return request("/cart", {
    method: "DELETE",
    auth: true,
  });
}

export function validateCart() {
    return request("/cart/validate", {
      method: "POST",
      auth: true,
    });
}
