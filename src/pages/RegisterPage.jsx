import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { LeftArrowIcon } from "../components/icons";
import { useAuth } from "../auth/AuthContext";
import { AppLink, Button, Input } from "../components/ui";
import RyukLight from "../assets/register-ryuklight.png";

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, register } = useAuth();

  const from = location.state?.from
    ? location.state.from.pathname + location.state.from.search
    : "/";

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    name: "",
    surname: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [repeatPassword, setRepeatPassword] = useState("");

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== repeatPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await register(form);

      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || "Error al crear cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral">
      <div className="grid w-full min-h-screen grid-cols-1 bg-white text-black lg:grid-cols-[45%_55%] xl:grid-cols-[50%_50%]">
        
        <div className="hidden lg:flex w-full h-full bg-[#fafafa]">
          <img 
            src={RyukLight} 
            alt="Ryuk & Light" 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Panel Derecho: Formulario */}
        <div className="flex items-center justify-center p-6 sm:p-10 md:p-16 lg:p-20">
          <div className="w-full max-w-[480px] sm:max-w-[560px] space-y-8 md:space-y-10">
            <div className="space-y-4">
              <AppLink to="/" variant="text">
                <LeftArrowIcon />
                <span>Volver al inicio</span>
              </AppLink>
              <div className="space-y-3 text-center lg:text-left">
                <h1>Crear Cuenta</h1>
                <div className="text-sm uppercase tracking-[1.2px] text-secondary">
                  <p>Proporcione los datos solicitados.</p>
                </div>
              </div>
            </div>

            <form className="space-y-5 md:space-y-6 w-full max-w-full" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Nombre"
                  type="text"
                  placeholder="Juan"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
                <Input
                  label="Apellido"
                  type="text"
                  placeholder="Doe"
                  value={form.surname}
                  onChange={(e) =>
                    setForm({ ...form, surname: e.target.value })
                  }
                  required
                />
              </div>

              <Input
                label="Usuario"
                type="text"
                placeholder="juandoe01"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                placeholder="juandoc@ejemplo.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                label="Contraseña"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <Input
                label="Repetir Contraseña"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                required
              />

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
              <p className="min-h-6 text-primary text-center">{error}</p>
            </form>

            <div className="text-center text-xs uppercase tracking-[1.2px] text-secondary">
              ¿Ya eres miembro?{" "}
              <AppLink variant="underline" to="/login">
                Inicia sesión
              </AppLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}