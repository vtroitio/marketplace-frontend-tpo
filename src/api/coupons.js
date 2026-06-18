import { request } from "./api";

export function validateCoupon(code) {
  return request("/coupons/validate", {
    method: "POST",
    body: {
      code,
    },
  });
}