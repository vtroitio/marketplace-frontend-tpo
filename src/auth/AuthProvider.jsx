import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useToast } from "../toast/ToastContext";
import {
  clearSession,
  getAccessToken,
  getUserRole,
  saveSession,
} from "../helpers/authStorage";
import {
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from "../api/auth";

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const toast = useToast();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(getAccessToken());
  });

  const [userRole, setUserRole] = useState(() => {
    return getUserRole();
  });

  const clearAuthState = useCallback(() => {
    clearSession();
    setIsAuthenticated(false);
    setUserRole(null);
  }, []);

  const startSession = useCallback((data) => {
    const role = getUserRole(data.accessToken);

    saveSession({
      accessToken: data.accessToken,
      userRole: role,
    });

    setIsAuthenticated(true);
    setUserRole(role);
  }, []);

  const login = useCallback(
    async (credentials) => {
      const data = await loginRequest(credentials);

      startSession(data);

      return data;
    },
    [startSession],
  );

  const register = useCallback(
    async (userData) => {
      const data = await registerRequest(userData);

      if (data?.accessToken) {
        startSession(data);
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

  useEffect(() => {
    window.addEventListener("auth:session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, [handleSessionExpired]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      userRole,
      login,
      register,
      logout,
      logoutFrontend,
    }),
    [isAuthenticated, userRole, login, register, logout, logoutFrontend],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
