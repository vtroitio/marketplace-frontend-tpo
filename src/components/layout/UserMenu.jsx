import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../../helpers/authStorage";
import { Button } from "../ui";
import { ProfileIcon } from "../icons";
import { logout } from "../../api/auth";

export function UserMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);

  const isLoggedIn = isAuthenticated();

  function closeMenu() {
    setOpen(false);
  }

  function toggleMenu() {
    setOpen((prev) => !prev);
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      closeMenu();
      navigate("/");
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
      className={`relative ${location.pathname === "/profile" && "border-b-2 border-primary"}`}
    >
      <button
        type="button"
        className={`cursor-pointer size-6`}
        onClick={toggleMenu}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Abrir menú de usuario"
      >
        <ProfileIcon
          className={`${location.pathname === "/profile" ? "text-primary" : "text-tertiary"}`}
        />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 min-w-64 border border-secondary bg-neutral p-2"
          role="menu"
        >
          {!isLoggedIn ? (
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
              >
                Cerrar sesión
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
