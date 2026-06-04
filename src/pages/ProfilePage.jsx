import { useState } from "react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ProfileIcon } from "../components/icons";

export function ProfilePage() {
  const [formData, setFormData] = useState({
    nombre: "Juan",
    apellido: "Doe",
    usuario: "juandoe01",
    email: "juandoe@ejemplo.com",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos guardados:", formData);
  };

  return (
    <div className="min-h-screen bg-neutral">
      <div className="mx-auto max-w-3xl px-8 py-12">

        {/* Avatar + Nombre */}
        <div className="flex items-center gap-4 mb-8">
          <div className="border border-secondary p-3">
            <ProfileIcon size={32} />
          </div>
          <h2>{formData.nombre} {formData.apellido}</h2>
        </div>

        <hr className="border-secondary/20 mb-10" />

        {/* Gestión de datos */}
        <section className="mb-12">
          <div className="mb-8">
            <h3>Gestión de datos</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nombre"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Juan"
              />
              <Input
                label="Apellido"
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Doe"
              />
            </div>

            <Input
              label="Usuario"
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              placeholder="juandoe01"
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="juandoe@ejemplo.com"
            />

            <div className="flex justify-end">
              <Button type="submit">Guardar datos</Button>
            </div>
          </form>
        </section>

        <hr className="border-secondary/20 mb-10" />

        {/* Seguridad */}
        <section>
          <div className="mb-8">
            <h3>Seguridad</h3>
          </div>

          <div className="border border-secondary/20 p-6 flex items-center justify-between">
            <div>
              <p>Contraseña</p>
              <span className="text-sm text-tertiary">
                Último cambio hace 3 meses
              </span>
            </div>
            <Button variant="outline">
              Restablecer contraseña
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
}