import { CartIcon } from "../icons";
import { UserMenu } from "./UserMenu";
import { Logo, AppNavLink } from "../ui";
import { useCart } from "../../cart/CartContext";

export function NavBar() {
  const { totalArticles } = useCart();

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
          <AppNavLink to="/sell">Venta</AppNavLink>
        </li>
      </ul>
      <div className="flex gap-2">
        <UserMenu />
        <AppNavLink to="/cart">
          <div className="relative">
            <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-white">
              {totalArticles}
            </span>
            <CartIcon />
          </div>
        </AppNavLink>
      </div>
    </nav>
  );
}
