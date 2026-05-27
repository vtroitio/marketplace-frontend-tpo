import { CartIcon, ProfileIcon } from "../icons";
import { Logo, AppLink } from "../ui";

export function NavBar() {
  return (
    <nav className="flex items-center justify-between bg-neutral w-full px-16 h-20 border-b border-seco">
      <Logo />
      <ul className="flex flex-row gap-8">
        <li>
          <AppLink to="/explore">
            Explorar
          </AppLink>
        </li>
        <li>
          <AppLink to="/about">
            Nosotros
          </AppLink>
        </li>
        <li>
          <AppLink to="/sell">
            Vender
          </AppLink>
        </li>
      </ul>
      <div className="flex gap-2">
        <AppLink to="/profile">
          <ProfileIcon />
        </AppLink>
        <AppLink to="/cart">
          <CartIcon />
        </AppLink>
      </div>
    </nav>
  );
}
