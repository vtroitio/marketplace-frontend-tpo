import { jwtDecode } from "jwt-decode";

/**
 * Retrieves the access token from localStorage for authenticated requests.
 *
 * @returns {string | null} Token de acceso o null si no existe.
 */
export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function getAccessTokenPayload(accessToken = getAccessToken()) {
  if (!accessToken) {
    return null;
  }

  try {
    return jwtDecode(accessToken);
  } catch (error) {
    console.error("Error decoding access token:", error);
    return null;
  }
}

/**
 * Checks if the user is currently authenticated by verifying the presence of an access token in localStorage.
 *
 * @returns {boolean} True if the user is authenticated, false otherwise.
 */
export function isAuthenticated() {
  return !!localStorage.getItem("accessToken");
}

/**
 * Saves the access token to localStorage for future authenticated requests.
 *
 * @param {string} accessToken
 * @returns {void}
 */
export function saveAccessToken(accessToken) {
  localStorage.setItem("accessToken", accessToken);
}

/**
 * Saves the user's role to localStorage.
 *
 * @param {string} userRole
 * @returns {void}
 */
// export function saveUserRole(userRole) {
//   localStorage.setItem("userRole", userRole);
// }

/**
 * Saves the user's session information, including the access token and user role, to localStorage.
 */
export function saveSession({ accessToken }) {
  saveAccessToken(accessToken);
}

/**
 * Retrieves the user's role from localStorage.
 *
 * @returns {string | null} User's role or null if not found.
 */
// export function getUserRole(accessToken = getAccessToken()) {
//   const payload = getAccessTokenPayload(accessToken);
//   return payload?.role || null;
// }

/**
 * Removes the access token from localStorage, effectively logging out the user.
 *
 * @returns {void}
 */
export function clearSession() {
  // localStorage.removeItem("userRole");
  localStorage.removeItem("accessToken");
}
