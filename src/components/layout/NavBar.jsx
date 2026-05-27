import { CartIcon, ProfileIcon } from "../icons";
import { Logo, Link } from "../ui";

export function NavBar() {
  return (
    <nav className="flex items-center justify-between bg-neutral w-full px-16 h-20 border-b border-seco">
      <Logo />
      <ul className="flex flex-row gap-8">
        <li>
          <Link href="#">
            Explorar
          </Link>
        </li>
        <li>
          <Link href="#">
            Nosotros
          </Link>
        </li>
        <li>
          <Link href="#">
            Vender
          </Link>
        </li>
      </ul>
      <div className="flex gap-2">
        <Link href="#">
          <ProfileIcon />
        </Link>
        <Link href="#">
          <CartIcon />
        </Link>
      </div>
    </nav>
  );
}
