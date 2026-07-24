import { request } from "./client";

export function checkoutOrder(data) {
  return request("/orders", {
    method: "POST",
    body: data,
  });
}