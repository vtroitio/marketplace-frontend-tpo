import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/auth/authThunks";
import { Button } from "../ui";
import { ProfileIcon } from "../icons";

export function UserMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const authLoading = useSelector((state) => state.auth.loading);

  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  function toggleMenu() {
    setOpen((prev) => !prev);
  }

  async function handleLogout() {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
    } finally {
      closeMenu();
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (!menuRef.current) return;

      if (!menuRef.current.contains(event.target)) {
        closeMenu();
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div
      ref={menuRef}
      className={`relative ${
        location.pathname === "/profile" ? "border-b-2 border-primary" : ""
      }`}
    >
      <button
        type="button"
        className="cursor-pointer size-6"
        onClick={toggleMenu}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Abrir menú de usuario"
      >
        <ProfileIcon
          className={
            location.pathname === "/profile"
              ? "text-primary"
              : "text-tertiary"
          }
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 min-w-64 border border-secondary bg-neutral p-2"
          role="menu"
        >
          {!isAuthenticated ? (
            <>
              <Button
                to="/login"
                className="text-secondary! hover:text-primary!"
                onClick={closeMenu}
                variant="text"
              >
                Iniciar sesión
              </Button>

              <Button
                to="/register"
                className="text-secondary! hover:text-primary!"
                onClick={closeMenu}
                variant="text"
              >
                Registrarse
              </Button>
            </>
          ) : (
            <>
              <Button
                to="/profile"
                className="text-secondary! hover:text-primary!"
                onClick={closeMenu}
                variant="text"
              >
                Perfil
              </Button>

              <Button
                className="text-secondary! hover:text-primary!"
                onClick={handleLogout}
                variant="text"
                disabled={authLoading}
              >
                {authLoading ? "Cerrando sesión..." : "Cerrar sesión"}
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}