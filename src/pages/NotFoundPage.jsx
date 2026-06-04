import { LeftArrowIcon } from "../components/icons";
import { AppLink } from "../components/ui";

export function NotFoundPage() {
  return (
    <div className="w-full min-h-screen grow flex flex-col items-center justify-center gap-8">
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
