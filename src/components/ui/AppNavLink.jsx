import { NavLink } from "react-router-dom";

export function AppNavLink({ children, ...props }) {
  return (
    <NavLink
      className={({ isActive }) =>
        `inline-flex w-fit items-center gap-2 text-lg uppercase font-bold tracking-[1.2px] leading-6 hover:text-primary ${
          isActive ? "text-primary border-b-2 border-primary pb-1" : "text-tertiary"
        }`
      }
      {...props}
    >
      {children}
    </NavLink>
  );
}