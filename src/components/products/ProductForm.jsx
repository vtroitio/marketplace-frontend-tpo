import { useState } from "react";
import { Button } from "../ui";
import { ProductBasicInfo } from "./ProductBasicInfo";
import { ProductVariants } from "./ProductVariants";

const createEmptyVariantGroup = () => ({
  colorAttributeValueId: null,
  colorCode: "",
  colorValue: "",
  hexColor: null,
  images: [],
  sizes: [],
});

const createEmptyProduct = () => ({
  name: "",
  description: "",
  coverImagePath: "",
  price: "",
  totalStock: 0,
  isActive: true,
  selectedGender: null,
  selectedType: null,
  variantGroups: [createEmptyVariantGroup()],
});

export function ProductForm({ data, onSubmit, submitLabel }) {
  const [product, setProduct] = useState(() => ({
    ...createEmptyProduct(),
    ...data,
    variantGroups:
      Array.isArray(data?.variantGroups) && data.variantGroups.length > 0
        ? data.variantGroups
        : [createEmptyVariantGroup()],
  }));

  const [formError, setFormError] = useState(null);

  function addVariantGroup() {
    setProduct((prev) => ({
      ...prev,
      variantGroups: [...(prev.variantGroups ?? []), createEmptyVariantGroup()],
    }));
  }

  function updateField(field, value) {
    setProduct((prev) => ({ ...prev, [field]: value }));
  }

  function updateVariantGroup(index, field, value) {
    setProduct((prev) => {
      const variantGroups = [...(prev.variantGroups ?? [])];
      if (field === "color") {
        variantGroups[index] = { ...variantGroups[index], ...value };
      } else {
        variantGroups[index] = { ...variantGroups[index], [field]: value };
      }
      return { ...prev, variantGroups };
    });
  }

  function removeVariantGroup(index) {
    setProduct((prev) => {
      const variantGroups = prev.variantGroups ?? [];
      if (variantGroups.length <= 1) return prev;
      return { ...prev, variantGroups: variantGroups.filter((_, i) => i !== index) };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);

    if (!product.name || product.name.trim().length < 3) {
      setFormError("El nombre debe tener al menos 3 caracteres.");
      return;
    }
    if (!product.selectedGender) {
      setFormError("Seleccioná un género.");
      return;
    }
    if (!product.selectedType) {
      setFormError("Seleccioná un tipo de prenda.");
      return;
    }
    if (!product.description || product.description.trim().length < 10) {
      setFormError("La descripción debe tener al menos 10 caracteres.");
      return;
    }

    const colorIds = (product.variantGroups ?? []).map((g) => g.colorAttributeValueId).filter(Boolean);
    const hasDuplicateColors = colorIds.some((id, i) => colorIds.indexOf(id) !== i);
    if (hasDuplicateColors) {
      setFormError("No puede haber dos variantes con el mismo color.");
      return;
    }

    for (const group of product.variantGroups ?? []) {
      if (!group.colorAttributeValueId) {
        setFormError("Seleccioná un color para todas las variantes.");
        return;
      }
      if (!group.sizes || group.sizes.length === 0) {
        setFormError("Cada variante debe tener al menos una talla seleccionada.");
        return;
      }
      for (const size of group.sizes) {
        if (!size.price || Number(size.price) <= 0) {
          setFormError("Todos los talles deben tener un precio mayor a 0.");
          return;
        }
        if (Number(size.price) > 9999999) {
          setFormError("El precio no puede superar $ 9.999.999.");
          return;
        }
        if (size.stock === "" || size.stock === null || Number(size.stock) < 0) {
          setFormError("El stock no puede ser negativo.");
          return;
        }
        if (Number(size.stock) > 9999) {
          setFormError("El stock no puede superar 9999 unidades.");
          return;
        }
      }
    }

    onSubmit(product);
  }

  return (
    <form onSubmit={handleSubmit}>
      <ProductBasicInfo product={product} onChange={updateField} />

      <ProductVariants
        variantGroups={product.variantGroups ?? []}
        attributes={product._attributes ?? []}
        onVariantGroupChange={updateVariantGroup}
        onAddVariantGroup={addVariantGroup}
        onRemoveVariantGroup={removeVariantGroup}
      />

      <div className="flex flex-col items-end gap-3 w-full">
        {formError && (
          <div className="w-full border border-red-400 bg-red-50 px-4 py-3">
            <span style={{ color: "#dc2626", fontSize: "0.9rem" }}>{formError}</span>
          </div>
        )}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}