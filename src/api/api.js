const API_URL = import.meta.env.VITE_API_URL;

/**
 * Obtiene el access token guardado en localStorage.
 *
 * @returns {string | null} Token de acceso o null si no existe.
 */
function getAccessToken() {
  return localStorage.getItem("accessToken");
}

/**
 * Guarda el access token en localStorage.
 *
 * @param {string} accessToken Token de acceso.
 * @returns {void}
 */
function saveAccessToken(accessToken) {
  localStorage.setItem("accessToken", accessToken);
}

/**
 * Elimina el access token de la sesión local.
 *
 * @returns {void}
 */
function clearSession() {
  localStorage.removeItem("accessToken");
}

/**
 * Renueva el access token usando la cookie de refresh.
 *
 * @returns {Promise<string>} Nuevo access token.
 * @throws {Error} Si no se pudo renovar la sesión.
 */
async function refreshAccessToken() {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  const contentType = response.headers.get("content-type");

  const data = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(data?.message || "No se pudo renovar la sesión");
  }

  saveAccessToken(data.accessToken);

  return data.accessToken;
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

  const contentType = response.headers.get("content-type");

  let data = null;

  if (contentType?.includes("application/json")) {
    data = await response.json();
  } else if (contentType?.includes("text/")) {
    data = await response.text();
  }

  if (response.status === 401 && auth && retry) {
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
      throw new Error("Sesión expirada. Volvé a iniciar sesión.");
    }
  }

  if (!response.ok) {
    throw new Error(data?.message || data || "Error en la petición");
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
