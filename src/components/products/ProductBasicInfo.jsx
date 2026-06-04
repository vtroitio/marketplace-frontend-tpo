import { Select, Input, Textarea } from "../ui";

export function ProductBasicInfo({ product, onChange }) {
  return (
    <section className="flex flex-col gap-8 py-16">
      <Input
        label="Nombre de prenda"
        value={product.name}
        onChange={(e) => onChange("name", e.target.value)}
        placeholder="Remera Naruto"
      />

      <div className="flex gap-8">
        <Select
          label="Género"
          value={""}
          onChange={(e) => onChange("gender", e.target.value)}
          placeholder="Seleccionar"
        >
          <option value="male">Hombre</option>
          <option value="female">Mujer</option>
          <option value="unisex">Unisex</option>
        </Select>

        <Select
          label="Tipo de prenda"
          value={""}
          onChange={(e) => onChange("type", e.target.value)}
          placeholder="Seleccionar"
        >
          <option value="tshirt">Remera</option>
          <option value="hoodie">Buzo</option>
          <option value="pants">Pantalón</option>
        </Select>
      </div>

      <Textarea
        label="Descripción"
        value={product.description}
        onChange={(e) => onChange("description", e.target.value)}
        placeholder="Remera Naruto"
      />
    </section>
  );
}
