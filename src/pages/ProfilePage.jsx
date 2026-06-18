import { useState } from "react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ProfileIcon } from "../components/icons";
import { useAuth } from "../auth/AuthContext";
import { updateProfile } from "../api/users";

const emptyUserData = {
  username: "",
  name: "",
  surname: "",
  role: {},
};

function mapUserToFormData(user) {
  if (!user) return emptyUserData;

  return {
    username: user.username ?? "",
    name: user.name ?? "",
    surname: user.surname ?? "",
    role: user.role ?? {},
  };
}

export function ProfilePage() {
  const { currentUser, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral">
        <div className="mx-auto max-w-3xl px-8 py-12">
          <p>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-neutral">
        <div className="mx-auto max-w-3xl px-8 py-12">
          <p>No hay un usuario autenticado.</p>
        </div>
      </div>
    );
  }

  return (
    <ProfileForm
      key={currentUser.id}
      initialData={mapUserToFormData(currentUser)}
    />
  );
}

function ProfileForm({ initialData }) {
  const [formData, setFormData] = useState(initialData);
  const [savedData, setSavedData] = useState(initialData);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roleName =
    typeof savedData.role === "string" ? savedData.role : savedData.role?.name;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isSameData =
      formData.username === savedData.username &&
      formData.name === savedData.name &&
      formData.surname === savedData.surname;

    if (isSameData) return;

    try {
      setLoading(true);
      setError("");

      await updateProfile({
        username: formData.username,
        name: formData.name,
        surname: formData.surname,
      });

      setSavedData({ ...formData });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

          <p>{roleName}</p>
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
      </div>
    </div>
  );
}
