/**
 * Retrieves the access token from localStorage for authenticated requests.
 *
 * @returns {string | null} Token de acceso o null si no existe.
 */
export function getAccessToken() {
  return localStorage.getItem("accessToken");
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
 * Removes the access token from localStorage, effectively logging out the user.
 *
 * @returns {void}
 */
export function clearSession() {
  localStorage.removeItem("accessToken");
}
