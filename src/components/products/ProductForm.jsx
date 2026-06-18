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

  function addVariantGroup() {
    setProduct((prev) => ({
      ...prev,
      variantGroups: [...(prev.variantGroups ?? []), createEmptyVariantGroup()],
    }));
  }

  function updateField(field, value) {
    setProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateVariantGroup(index, field, value) {
    setProduct((prev) => {
      const variantGroups = [...(prev.variantGroups ?? [])];

      if (field === "color") {
        variantGroups[index] = {
          ...variantGroups[index],
          ...value,
        };
      } else {
        variantGroups[index] = {
          ...variantGroups[index],
          [field]: value,
        };
      }

      return {
        ...prev,
        variantGroups,
      };
    });
  }

  function removeVariantGroup(index) {
    setProduct((prev) => {
      const variantGroups = prev.variantGroups ?? [];

      if (variantGroups.length <= 1) {
        return prev;
      }

      return {
        ...prev,
        variantGroups: variantGroups.filter((_, i) => i !== index),
      };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
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

      <div className="flex justify-end w-full">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
