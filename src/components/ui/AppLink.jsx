import { Link } from "react-router-dom";

export function AppLink({ children, variant = "primary", ...props }) {
  const variants = {
    primary: "hover:text-primary",
    underline: "underline hover:text-primary",
  };

  return (
    <Link
      className={`inline-flex w-fit items-center gap-2 text-terciary ${variants[variant] || variants.primary}`}
      {...props}
    >
      {children}
    </Link>
  );
}
