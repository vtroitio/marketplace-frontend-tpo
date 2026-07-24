import { request } from "./client";

/**
 * Registers a new user with the provided data.
 *
 * @param {Object} userData - The data for the user to register.
 * @param {string} userData.email - The user's email address.
 * @param {string} userData.username - The user's username.
 * @param {string} userData.password - The user's password.
 * @param {string} userData.name - The user's name.
 * @param {string} userData.surname - The user's surname.
 * @returns {Promise<{ accessToken: string, user: Object }>} The response from the backend.
 */
export async function register(userData) {
  return await request("/auth/register", {
    method: "POST",
    body: userData,
    auth: false,
    skipAuthRefresh: true,
  });
}

/**
 * Login a user with the provided credentials.
 *
 * @param {Object} credentials - The user's login credentials.
 * @param {string} credentials.email - The user's email address.
 * @param {string} credentials.password - The user's password.
 * @returns {Promise<{ accessToken: string, user: Object }>} The response from the backend.
 */
export async function login(credentials) {
  return await request("/auth/login", {
    method: "POST",
    body: credentials,
    auth: false,
    skipAuthRefresh: true,
  });
}

/**
 * Logs out the current user.
 * @returns {Promise<void>} The response from the backend.
 */
export async function logout() {
  return await request("/auth/logout", {
    method: "POST",
    auth: false,
    skipAuthRefresh: true,
  });
}

/**
 * Restores the user's session using the refresh token cookie.
 *
 * @returns {Promise<string>} A Promise that resolves to the new access token.
 */
export async function restoreSession() {
  return request("/auth/refresh", {
    method: "POST",
    auth: false,
    skipAuthRefresh: true,
  });
}
