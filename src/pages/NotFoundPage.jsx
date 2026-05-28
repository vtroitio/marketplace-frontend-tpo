import { LeftArrowIcon } from "../components/icons";
import { AppLink } from "../components/ui";

export function NotFoundPage() {
  return (
    <div className="min-h-screen container mx-auto gap-8 flex flex-col items-center justify-center">
      <h1 className="font-logo uppercase text-8xl text-center">
        404 - Página no encontrada
      </h1>
      <AppLink to="/home">
        <LeftArrowIcon />
        <span>Volver a la página de inicio</span>
      </AppLink>
    </div>
  );
}
