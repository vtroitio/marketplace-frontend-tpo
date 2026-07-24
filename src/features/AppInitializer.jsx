import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../components/ui";
import { restoreUserSession, clearAuthState } from "./auth";
import { initializeCart, resetCartState } from "./cart";

export function AppInitializer({ children }) {
  const dispatch = useDispatch();

  const authInitialized = useSelector((state) => state.auth.initialized);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.auth.user?.id);

  const cartInitialized = useSelector((state) => state.cart.initialized);

  const restoreStartedRef = useRef(false);
  const lastSessionKeyRef = useRef(null);

  useEffect(() => {
    if (restoreStartedRef.current) return;

    restoreStartedRef.current = true;

    dispatch(restoreUserSession());

    const handleSessionExpired = () => {
      dispatch(clearAuthState());
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, [dispatch]);

  useEffect(() => {
    if (!authInitialized) return;

    const sessionKey = isAuthenticated
      ? `user:${userId ?? "authenticated"}`
      : "guest";

    if (lastSessionKeyRef.current === sessionKey) return;

    lastSessionKeyRef.current = sessionKey;

    dispatch(resetCartState());
    dispatch(initializeCart());
  }, [dispatch, authInitialized, isAuthenticated, userId]);

  if (!authInitialized || !cartInitialized) {
    return <Spinner />;
  }

  return children;
}
