import { NavLink } from "react-router-dom";

export function AppNavLink({ children, className = "", ...props }) {
  return (
    <NavLink
      className={({ isActive }) =>
        `inline-flex w-fit items-center gap-2 transition pb-1 ${
          isActive
            ? "text-primary border-primary! border-b-2"
            : "text-terciary hover:text-primary"
        } ${className}`
      }
      {...props}
    >
      {children}
    </NavLink>
  );
}
