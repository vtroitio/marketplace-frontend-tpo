import { request } from "./client";

export function getProfile(token = null) {
  return request("/users/me", {
    method: "GET",
    auth: !token,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function updateProfile(userData) {
  return request("/users/me", {
    method: "PATCH",
    auth: true,
    body: userData,
  });
}