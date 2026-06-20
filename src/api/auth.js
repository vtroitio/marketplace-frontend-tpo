import {
  request,
  setAccessToken,
  clearAccessToken,
} from "./client";

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
export async function register(userData) {
  const data = await request("/auth/register", {
    method: "POST",
    body: userData,
    auth: false,
  });
  setAccessToken(data.accessToken);
  return data;
}

/**
 * Login a user with the provided credentials.
 *
 * @param {Object} credentials - The user's login credentials.
 * @param {string} credentials.email - The user's email address.
 * @param {string} credentials.password - The user's password.
 * @returns {Promise<{ accessToken: string }>} The response from the backend.
 */
export async function login(credentials) {
  const data = await request("/auth/login", {
    method: "POST",
    body: credentials,
    auth: false,
  });
  setAccessToken(data.accessToken);
  return data;
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
    clearAccessToken();
  }
}
