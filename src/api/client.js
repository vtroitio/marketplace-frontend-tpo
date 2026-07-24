import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

let refreshPromise = null;
let storePromise = null;

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

function getStore() {
  if (!storePromise) {
    storePromise = import("../app/store").then((module) => module.store);
  }

  return storePromise;
}

async function getAccessTokenFromRedux() {
  const store = await getStore();
  return store.getState().auth.accessToken;
}

async function dispatchRedux(action) {
  const store = await getStore();
  store.dispatch(action);
}

function buildAxiosError(error, fallbackMessage = "Error en la petición") {
  const response = error.response;
  const data = response?.data;

  const message =
    data?.message ||
    data?.error ||
    (typeof data === "string" ? data : null) ||
    error.message ||
    fallbackMessage;

  const normalizedError = new Error(message);

  normalizedError.status = response?.status ?? null;
  normalizedError.errors = data?.errors ?? null;
  normalizedError.data = data ?? null;
  normalizedError.originalError = error;

  return normalizedError;
}

async function clearExpiredSession() {
  await dispatchRedux({
    type: "auth/clearAuthState",
  });

  window.dispatchEvent(new Event("auth:session-expired"));
}

/**
 * Refreshes the access token using the refresh token.
 * Ensures that only one refresh request is made at a time.
 *
 * @returns {Promise<string>} A Promise that resolves to the new access token.
 * @throws {Error} If the refresh fails or the backend does not return a new access token.
 */
export async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/auth/refresh")
      .then(async (response) => {
        const data = response.data;

        if (!data?.accessToken) {
          throw new Error("El backend no devolvió un accessToken");
        }

        await dispatchRedux({
          type: "auth/setAccessToken",
          payload: data.accessToken,
        });

        return data;
      })
      .catch((error) => {
        throw buildAxiosError(error, "No se pudo renovar la sesión");
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

apiClient.interceptors.request.use(async (config) => {
  const requiresAuth = config._requiresAuth !== false;

  if (!requiresAuth) {
    return config;
  }

  const accessToken = await getAccessTokenFromRedux();

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,

  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;
    const requiresAuth = originalRequest?._requiresAuth !== false;
    const skipAuthRefresh = Boolean(originalRequest?._skipAuthRefresh);

    if (status === 401 && requiresAuth && !skipAuthRefresh) {
      if (originalRequest._retry) {
        await clearExpiredSession();
        throw new Error("Sesión expirada. Volvé a iniciar sesión.");
      }

      originalRequest._retry = true;

      try {
        const data = await refreshAccessToken();

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return apiClient(originalRequest);
      } catch {
        await clearExpiredSession();
        throw new Error("Sesión expirada. Volvé a iniciar sesión.");
      }
    }

    throw buildAxiosError(error);
  },
);

/**
 * Makes an API request to the specified endpoint with the given options.
 * Automatically handles token refresh on 401 responses.
 *
 * @param {string} endpoint API endpoint to call (e.g., "/users").
 * @param {Object} [options={}] Optional configuration for the request.
 * @returns {Promise<any>} A Promise that resolves to the response data.
 * @throws {Error} If the request fails or the session is expired.
 */
export async function request(endpoint, options = {}) {
  const {
    body,
    method = "GET",
    headers,
    auth = true,
    skipAuthRefresh = false,
    ...customOptions
  } = options;

  return apiClient({
    url: endpoint,
    method,
    data: body,
    headers,
    _requiresAuth: auth,
    _skipAuthRefresh: skipAuthRefresh,
    ...customOptions,
  });
}