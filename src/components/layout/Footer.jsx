import { Logo, Link } from "../ui";

export function Footer() {
  return (
    <footer className="w-full h-115 bg-neutral border-t border-secondary">
      <div className="px-16 py-16 md:px-16 md:py-32">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-1 font-light leading-[160%] text-tertiary">
              MODA GEEK ELEVADA
            </p>
          </div>

          <nav className="flex flex-col gap-4">
            <Link href="#">Inicio</Link>
            <Link href="#">Explorar</Link>
          </nav>

          <nav className="flex flex-col gap-4">
            <Link href="#">Nosotros</Link>
            <Link href="#">Vender</Link>
          </nav>
        </div>

        <div className="mt-16 border-t border-secondary pt-8">
          <p className="text-xs font-bold uppercase leading-none tracking-[1.2px] text-terciary">
            © 2026 SKINDEX. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
