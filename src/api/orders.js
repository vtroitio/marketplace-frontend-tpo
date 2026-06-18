import { request } from "./api";

export function checkoutOrder(data) {
  return request("/orders", {
    method: "POST",
    body: data,
  });
}