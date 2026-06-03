import { AppLink, Button, Input } from "../components/ui";

export function RegisterPage() {
  return (
    <div className="min-h-screen bg-neutral flex items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-full grid-cols-1 overflow-hidden rounded-[32px] border border-secondary bg-white text-black shadow-sm lg:w-[1280px] lg:h-[1105px] lg:grid-cols-[640px_640px]">
        <div className="hidden lg:block bg-[#fafafa]" />

        <div className="flex items-center justify-center px-8 py-20 sm:px-16">
          <div className="w-full max-w-[560px] space-y-10">
            <div className="space-y-4">
              <AppLink to="/home" variant="text">
                ← Volver al inicio
              </AppLink>
              <div className="space-y-3">
                <h1>Crear Cuenta</h1>
                <div className="text-sm uppercase tracking-[1.2px] text-secondary">
                  <p>Proporcione los datos solicitados.</p>
                </div>
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Nombre" type="text" placeholder="Juan" />
                <Input label="Apellido" type="text" placeholder="Doe" />
              </div>

              <Input label="Usuario" type="text" placeholder="juandoe01" />
              <Input label="Email" type="email" placeholder="juandoc@ejemplo.com" />
              <Input label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" />
              <Input
                label="Repetir Contraseña"
                type="password"
                placeholder="Mínimo 8 caracteres"
              />

              <Button type="submit" fullWidth>
                Crear Cuenta
              </Button>
            </form>

            <div className="text-center text-xs uppercase tracking-[1.2px] text-secondary">
              ¿Ya eres miembro? <AppLink variant="underline" to="/login">
                Inicia sesión
              </AppLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
