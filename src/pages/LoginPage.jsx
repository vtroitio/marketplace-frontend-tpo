import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppLink, Button, Input } from "../components/ui";
import { loginUser } from "../features/auth/authThunks";
import ryukImage from "../assets/login-ryuk.png";

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const from = location.state?.from?.pathname || "/";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser(form));

    if (loginUser.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral">
      <div className="grid w-full min-h-screen grid-cols-1 bg-white text-black lg:grid-cols-[45%_55%] xl:grid-cols-[50%_50%]">
        <div className="hidden lg:flex w-full h-full bg-natural">
          <img
            src={ryukImage}
            alt="Ryuk"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10 md:p-16 lg:p-20">
          <div className="w-full max-w-120 sm:max-w-140 space-y-10 md:space-y-12">
            <div className="space-y-4">
              <div className="text-center lg:text-left">
                <h1>SKINDEX</h1>
                <div className="mt-3 text-sm uppercase tracking-[1.2px] text-secondary">
                  <p>Moda Geek Elevada</p>
                </div>
              </div>
            </div>

            <form
              className="space-y-5 md:space-y-6 w-full"
              onSubmit={handleSubmit}
            >
              <Input
                label="Email"
                type="email"
                placeholder="juandoc@ejemplo.com"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                required
              />

              <Input
                label="Contraseña"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                required
              />

              <Button fullWidth type="submit" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>

              <p className="min-h-6 text-primary text-center">
                {error}
              </p>
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