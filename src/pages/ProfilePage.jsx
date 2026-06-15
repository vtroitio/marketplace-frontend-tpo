import { useState, useEffect } from "react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ProfileIcon } from "../components/icons";
import { getProfile, updateProfile } from "../api/users";

const emptyUserData = {
  username: "",
  name: "",
  surname: "",
  role: {},
};

export function ProfilePage() {
  const [formData, setFormData] = useState(emptyUserData);
  const [savedData, setSavedData] = useState(emptyUserData);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const user = await getProfile();

        const mappedUser = {
          id: user.id ?? "",
          username: user.username ?? "",
          email: user.email ?? "",
          name: user.name ?? "",
          surname: user.surname ?? "",
          role: user.role ?? {},
        };

        if (!ignore) {
          setFormData(mappedUser);
          setSavedData(mappedUser);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isSameData =
      formData.username === savedData.username &&
      formData.email === savedData.email &&
      formData.name === savedData.name &&
      formData.surname === savedData.surname;

    if (isSameData) return;

    try {
      setLoading(true);
      setError("");
      await updateProfile(formData);
    } catch (err) {
      setError(err.message);
      return;
    } finally {
      setLoading(false);
    }

    setSavedData({ ...formData });

    console.log("Datos guardados:", formData);
  };

  return (
    <div className="min-h-screen bg-neutral">
      <div className="mx-auto max-w-3xl px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="border border-secondary p-3">
            <ProfileIcon size={32} />
          </div>
          <h2>
            {savedData.name} {savedData.surname}
          </h2>
          <p>{savedData.role.name}</p>
        </div>

        <hr className="border-tertiary mb-10" />

        <section className="mb-12">
          <div className="mb-8">
            <h3>Gestión de datos</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nombre"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Apellido"
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="Usuario"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <div className="flex flex-col items-end gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar datos"}
              </Button>
              <p className="min-h-6 text-primary text-center">{error}</p>
            </div>
          </form>
        </section>

        <hr className="border-tertiary mb-10" />

        <section>
          <div className="mb-8">
            <h3>Seguridad</h3>
          </div>

          <div className="flex flex-col gap-4">
            <div className="border border-tertiary p-6 gap-16 flex items-center justify-between">
              <div className="w-full">
                <p>Email</p>
                <span className="text-sm text-tertiary">
                  Último cambio hace 3 meses
                </span>
              </div>
              <Button fullWidth variant="outline">Cambiar email</Button>
            </div>
            <div className="border border-tertiary p-6 gap-16 flex items-center justify-between">
              <div className="w-full">
                <p>Contraseña</p>
                <span className="text-sm text-tertiary">
                  Último cambio hace 3 meses
                </span>
              </div>
              <Button fullWidth variant="outline">Restablecer contraseña</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
