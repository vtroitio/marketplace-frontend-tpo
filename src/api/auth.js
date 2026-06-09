import { clearSession } from "../helpers/authStorage";
import { request } from "./api";

/**
 * Registers a new user with the provided data.
 *
 * @param {Object} userData - The data for the user to register.
 * @param {string} userData.email - The user's email address.
 * @param {string} userData.username - The user's username.
 * @param {string} userData.password - The user's password.
 * @param {string} userData.name - The user's name.
 * @param {string} userData.surname - The user's surname.
 * @returns {Promise<{ accessToken: string }>} The response from the backend.
 */
export function register(userData) {
  return request("/auth/register", {
    method: "POST",
    body: userData,
    auth: false,
  });
}

/**
 * Login a user with the provided credentials.
 *
 * @param {Object} credentials - The user's login credentials.
 * @param {string} credentials.email - The user's email address.
 * @param {string} credentials.password - The user's password.
 * @returns {Promise<{ accessToken: string }>} The response from the backend.
 */
export function login(credentials) {
  return request("/auth/login", {
    method: "POST",
    body: credentials,
    auth: false,
  });
}

/**
 * Logs out the current user.
 * @returns {Promise<void>} The response from the backend.
 */
export async function logout() {
  try {
    await request("/auth/logout", {
      method: "POST",
      auth: false,
    });
  } finally {
    clearSession();
  }
}
