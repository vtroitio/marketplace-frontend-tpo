import { AppLink, Button, Input } from "../components/ui";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral flex items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-full grid-cols-1 overflow-hidden rounded-[32px] border border-secondary bg-white text-black shadow-sm lg:w-[1280px] lg:h-[1105px] lg:grid-cols-[640px_640px]">
        <div className="hidden lg:block bg-[#fafafa]" />

        <div className="flex items-center justify-center px-8 py-20 sm:px-16">
          <div className="w-full max-w-[560px] space-y-12">
            <div className="space-y-4">
              <div>
                <h1>SKINDEX</h1>
                <div className="mt-3 text-sm uppercase tracking-[1.2px] text-secondary">
                  <p>Moda Geek Elevada</p>
                </div>
              </div>
            </div>

            <form className="space-y-6 max-w-[436px]">
              <Input
                label="Email"
                type="email"
                placeholder="juandoc@ejemplo.com"
              />

              <Input
                label="Contraseña"
                type="password"
                placeholder="Mínimo 8 caracteres"
              />

              <Button fullWidth>
                Iniciar sesión
              </Button>
         
            </form>
            <div className="text-center text-xs uppercase tracking-[1.2px] text-secondary">
              <p>
                ¿No tienes cuenta? <AppLink variant="underline" to="/register">
                  CREA UNA
                </AppLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
