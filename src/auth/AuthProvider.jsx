import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useToast } from "../toast/ToastContext";
import {
  clearSession,
  getAccessToken,
  saveSession,
} from "../helpers/authStorage";
import {
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from "../api/auth";
import { getProfile } from "../api/users";

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const toast = useToast();

  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const isAuthenticated = Boolean(currentUser);

  const clearAuthState = useCallback(() => {
    clearSession();
    setCurrentUser(null);
  }, []);

  const loadCurrentUser = useCallback(async () => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      setCurrentUser(null);
      setAuthLoading(false);
      return null;
    }

    try {
      setAuthLoading(true);

      const user = await getProfile();

      setCurrentUser(user);

      return user;
    } catch (error) {
      console.error(error);

      clearAuthState();

      return null;
    } finally {
      setAuthLoading(false);
    }
  }, [clearAuthState]);

  const startSession = useCallback(
    async (data) => {
      saveSession({
        accessToken: data.accessToken,
      });

      const user = await loadCurrentUser();

      return user;
    },
    [loadCurrentUser],
  );

  const login = useCallback(
    async (credentials) => {
      const data = await loginRequest(credentials);

      await startSession(data);

      return data;
    },
    [startSession],
  );

  const register = useCallback(
    async (userData) => {
      const data = await registerRequest(userData);

      if (data?.accessToken) {
        await startSession(data);
      }

      toast.success("Tu cuenta fue creada exitosamente.", {
        title: "Registro exitoso",
        duration: 3500,
      });

      return data;
    },
    [startSession, toast],
  );

  const handleSessionExpired = useCallback(() => {
    clearAuthState();

    toast.error("Tu sesión expiró. Volvé a iniciar sesión.", {
      title: "Sesión expirada",
      duration: 5000,
    });

    navigate("/", { replace: true });
  }, [clearAuthState, navigate, toast]);

  const logoutFrontend = useCallback(() => {
    clearAuthState();
    navigate("/", { replace: true });
  }, [clearAuthState, navigate]);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();

      toast.success("Cerraste sesión correctamente.", {
        title: "Sesión cerrada",
        duration: 3500,
      });
    } catch (error) {
      console.error(error);

      toast.warning("Se cerró la sesión localmente.", {
        title: "Sesión cerrada",
        duration: 4000,
      });
    } finally {
      logoutFrontend();
    }
  }, [logoutFrontend, toast]);

  useEffect(() => async () => {
    await loadCurrentUser();
  }, [loadCurrentUser]);

  useEffect(() => {
    window.addEventListener("auth:session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, [handleSessionExpired]);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated,
      authLoading,
      login,
      register,
      logout,
      logoutFrontend,
      reloadCurrentUser: loadCurrentUser,
    }),
    [
      currentUser,
      isAuthenticated,
      authLoading,
      login,
      register,
      logout,
      logoutFrontend,
      loadCurrentUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}