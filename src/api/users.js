import { request } from "./client";

/**
 * Fetches the current user's profile.
 * @returns {Promise<{
 *   id: string,
 *   username: string,
 *   email: string,
 *   name: string,
 *   surname: string,
 *   role: string,
 *   active: boolean
 * }>} The user's profile data.
 */
export function getProfile() {
  return request("/users/me", {
    method: "GET",
    auth: true,
  });
}

/**
 * Updates the current user's profile.
 * @param {Object} userData - The user data to update.
 * @param {string} userData.username - The user's username.
 * @param {string} userData.name - The user's first name.
 * @param {string} userData.surname - The user's last name.
 * @returns {Promise<{
 *   id: string,
 *   username: string,
 *   email: string,
 *   name: string,
 *   surname: string,
 *   role: string,
 *   active: boolean
 * }>} The updated user data.
 */
export function updateProfile(userData) {
  return request("/users/me", {
    method: "PATCH",
    auth: true,
    body: userData,
  });
}
