import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { restoreUserSession } from "./authThunks";
import { clearAuthState } from "./authSlice";
import { Spinner } from "../../components/ui";

export function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const initialized = useSelector((state) => state.auth.initialized);

  useEffect(() => {
    dispatch(restoreUserSession());

    const handleSessionExpired = () => {
      dispatch(clearAuthState());
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, [dispatch]);

  if (!initialized) {
    return <Spinner></Spinner>;
  }

  return children;
}
