import { Link } from "react-router-dom";

export function Logo() {
  return (
    <Link
      to="/"
      className="inline-block w-fit font-logo text-[2rem] leading-none tracking-normal text-secondary"
    >
      SKINDEX
    </Link>
  );
}
