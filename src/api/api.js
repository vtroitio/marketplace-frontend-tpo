import {
  getAccessToken,
  saveAccessToken,
  clearSession,
} from "../helpers/authStorage";

const API_URL = import.meta.env.VITE_API_URL;

let refreshPromise = null;

function notifySessionExpired() {
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

/**
 * Refreshes the access token by making a request to the backend. If successful, it saves the new token and returns it.
 *
 * @returns {Promise<string>} The new access token.
 * @throws {Error} If the token refresh fails.
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
          throw new Error(data?.message || "No se pudo renovar la sesión");
        }

        saveAccessToken(data.accessToken);

        return data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function sendRequest(endpoint, options = {}, retry = true) {
  const { body, headers = {}, auth = true, ...customOptions } = options;

  const accessToken = getAccessToken();
  const isFormData = body instanceof FormData;

  const config = {
    ...customOptions,
    credentials: "include",
    headers: {
      ...(auth && accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {}),
      ...(!isFormData && body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await parseResponse(response);

  if (response.status === 401 && auth) {
    if (!retry) {
      clearSession();
      notifySessionExpired();
      throw new Error("Sesión expirada. Volvé a iniciar sesión.");
    }

    try {
      const newAccessToken = await refreshAccessToken();

      return sendRequest(
        endpoint,
        {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        },
        false,
      );
    } catch (error) {
      clearSession();
      notifySessionExpired();
      throw new Error("Sesión expirada. Volvé a iniciar sesión.");
    }
  }

  if (!response.ok) {
    const error = new Error(data?.message || data || "Error en la petición");
    error.errors = data?.errors || null;
    throw error;
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
