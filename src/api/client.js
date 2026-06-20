const API_URL = import.meta.env.VITE_API_URL;

let accessToken = null;
let refreshPromise = null;

/**
 * Retrieves the current access token.
 *
 * @returns {string|null} The access token or null if not set.
 */
export function getAccessToken() {
  return accessToken;
}

/**
 * Sets the access token.
 *
 * @param {string|null} token The access token or null to clear it.
 */
export function setAccessToken(token) {
  accessToken = token;
}

/**
 * Clears the access token.
 */
export function clearAccessToken() {
  accessToken = null;
}

function notifySessionExpired() {
  clearAccessToken();
  window.dispatchEvent(new Event("auth:session-expired"));
}

async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  if (contentType?.includes("text/")) {
    return response.text();
  }

  return null;
}

function buildError(data, fallbackMessage, response) {
  const error = new Error(data?.message || data || fallbackMessage);

  error.status = response?.status ?? null;
  error.errors = data?.errors ?? null;
  error.data = data ?? null;

  return error;
}

/**
 * Refreshes the access token using the refresh token.
 * Ensures that only one refresh request is made at a time.
 *
 * @returns {Promise<string>} A Promise that resolves to the new access token.
 * @throws {Error} If the refresh fails or the backend does not return a new access token.
 */
async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (response) => {
        const data = await parseResponse(response);

        if (!response.ok) {
          throw buildError(data, "No se pudo renovar la sesión", response);
        }

        if (!data?.accessToken) {
          throw new Error("El backend no devolvió un accessToken");
        }

        setAccessToken(data.accessToken);

        return data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

function buildRequestConfig(options) {
  const {
    body,
    headers = {},
    auth = true,
    ...customOptions
  } = options;

  const isFormData = body instanceof FormData;

  const requestHeaders = {
    ...(!isFormData && body !== undefined && body !== null
      ? { "Content-Type": "application/json" }
      : {}),
    ...headers,
    ...(auth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  return {
    ...customOptions,
    credentials: "include",
    headers: requestHeaders,
    body:
      body !== undefined && body !== null
        ? isFormData
          ? body
          : JSON.stringify(body)
        : undefined,
  };
}

async function sendRequest(endpoint, options = {}, retry = true) {
  const { auth = true, skipAuthRefresh = false } = options;

  const config = buildRequestConfig(options);

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await parseResponse(response);

  if (response.status === 401 && auth && !skipAuthRefresh) {
    if (!retry) {
      notifySessionExpired();
      throw new Error("Sesión expirada. Volvé a iniciar sesión.");
    }

    try {
      await refreshAccessToken();

      return sendRequest(endpoint, options, false);
    } catch (error) {
      notifySessionExpired();
      throw new Error("Sesión expirada. Volvé a iniciar sesión.");
    }
  }

  if (!response.ok) {
    throw buildError(data, "Error en la petición", response);
  }

  return data;
}

/**
 * Makes an API request to the specified endpoint with the given options.
 * Automatically handles token refresh on 401 responses.
 *
 * @param {string} endpoint API endpoint to call (e.g., "/users").
 * @param {Object} [options={}] Optional configuration for the request. see: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#options
 * @returns {Promise<any>} A Promise that resolves to the response data.
 * @throws {Error} If the request fails or the session is expired.
 */
export async function request(endpoint, options = {}) {
  return sendRequest(endpoint, options, true);
}
