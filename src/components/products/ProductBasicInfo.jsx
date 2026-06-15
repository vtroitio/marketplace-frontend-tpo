import { Select, Input, Textarea } from "../ui";
import { isGenderCategory, isTypeCategory } from "../../helpers/productFormMapper";

export function ProductBasicInfo({ product, onChange }) {
  const categories = product._categories || [];

  const gender = product.selectedGender?.code ?? "";
  const type = product.selectedType?.code ?? "";

  function handleFieldChange(field, value) {
    onChange(field, value);
  }

  function handleGenderChange(value) {
    const genderCategory = categories.find(
      (category) => category.code === value,
    );
    onChange("selectedGender", genderCategory);
    onChange("selectedType", null);
  }

  function handleTypeChange(value) {
    const typeCategory = categories.find((category) => category.code === value);
    onChange("selectedType", typeCategory);
  }

  return (
    <section className="flex flex-col gap-8 py-16">
      <Input
        label="Nombre de prenda"
        value={product.name || ""}
        onChange={(e) => handleFieldChange("name", e.target.value)}
        placeholder="Remera Naruto"
      />

      <div className="flex gap-8">
        <Select
          label="Género"
          value={gender}
          onChange={(e) => handleGenderChange(e.target.value)}
          placeholder="Seleccionar"
        >
          {categories.filter(isGenderCategory).map((category) => (
            <option key={category.id} value={category.code}>
              {category.name}
            </option>
          ))}
        </Select>

        <Select
          label="Tipo de prenda"
          value={type}
          onChange={(e) => handleTypeChange(e.target.value)}
          placeholder="Seleccionar"
          disabled={gender === ""}
        >
          {categories
            .filter((category) => isTypeCategory(category, gender))
            .map((category) => (
              <option key={category.id} value={category.code}>
                {category.name}
              </option>
            ))}
        </Select>
      </div>

      <Textarea
        label="Descripción"
        value={product.description || ""}
        onChange={(e) => handleFieldChange("description", e.target.value)}
        placeholder="Remera Naruto"
      />
    </section>
  );
}
