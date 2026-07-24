import { request } from "./client";

export function validateCoupon(code) {
  return request("/coupons/validate", {
    method: "POST",
    body: {
      code,
    },
  });
}