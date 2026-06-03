import { CartIcon, ProfileIcon } from "../icons";
import { Logo, AppNavLink } from "../ui";

export function NavBar() {
  return (
    <nav className="relative flex h-20 w-full items-center justify-between border-b border-secondary bg-neutral px-16">
      <Logo />
      <ul className="flex gap-8">
        <li>
          <AppNavLink to="/explore">Explorar</AppNavLink>
        </li>
        <li>
          <AppNavLink to="/about">Nosotros</AppNavLink>
        </li>
        <li>
          <AppNavLink to="/sell">Vender</AppNavLink>
        </li>
      </ul>
      <div className="flex gap-2">
        <AppNavLink to="/profile">
          <ProfileIcon />
        </AppNavLink>
        <AppNavLink to="/cart">
          <CartIcon />
        </AppNavLink>
      </div>
    </nav>
  );
}
