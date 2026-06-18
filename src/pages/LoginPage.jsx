import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { AppLink, Button, Input } from "../components/ui";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, login } = useAuth();

  const from = location.state?.from || "/";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      
      await login(form);

      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-neutral">
      <div className="grid w-full h-screen grid-cols-1 overflow-hidden bg-white text-black lg:grid-cols-[1200px_1fr]">
        <div className="hidden lg:block bg-[#fafafa]" />

        <div className="flex items-center justify-end px-8 py-20 sm:px-16">
          <div className="w-full max-w-[560px] space-y-12">
            <div className="space-y-4">
              <div>
                <h1>SKINDEX</h1>
                <div className="mt-3 text-sm uppercase tracking-[1.2px] text-secondary">
                  <p>Moda Geek Elevada</p>
                </div>
              </div>
            </div>

            <form className="space-y-6 max-w-[436px]" onSubmit={handleSubmit}>
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

              <Button fullWidth type="submit" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
              <p className="min-h-6 text-primary text-center">{error}</p>
            </form>
            <div className="text-center text-xs uppercase tracking-[1.2px] text-secondary">
              <p>
                ¿No tienes cuenta?{" "}
                <AppLink variant="underline" to="/register">
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
