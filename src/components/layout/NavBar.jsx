import { CartIcon, ProfileIcon } from "../icons";
import { Logo, AppLink } from "../ui";

export function NavBar() {
  return (
    <nav className="relative flex h-20 w-full items-center justify-between border-b border-seco bg-neutral px-16">
      <Logo />
      <ul className="absolute left-1/2 flex -translate-x-1/2 flex-row gap-8">
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
