import { useState } from "react";
import { Button } from "../ui";
import { ProductBasicInfo } from "./ProductBasicInfo";
import { ProductVariants } from "./ProductVariants";

const emptyVariant = {
  color: "",
  size: "",
  stock: "",
  price: "",
  images: [],
}

export function ProductForm({ data = [], onSubmit, submitLabel }) {
  const [product, setProduct] = useState(data);

  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          color: "",
          size: "",
          stock: "",
          price: "",
          images: [],
        },
      ],
    }));
  };

  const updateField = (field, value) => {
    setProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateVariant = (index, field, value) => {
    setProduct((prev) => {
      const variants = [...prev.variants];

      variants[index] = {
        ...variants[index],
        [field]: value,
      };

      return {
        ...prev,
        variants,
      };
    });
  };

  const removeVariant = (index) => {
    setProduct((prev) => {
      if (prev.variants.length <= 1) {
        return prev;
      }

      return {
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index),
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product);
  };

  return (
    <form onSubmit={handleSubmit}>
      <ProductBasicInfo product={product} onChange={updateField} />

      <ProductVariants
        variants={product.variants ?? [emptyVariant]}
        onVariantChange={updateVariant}
        onAddVariant={addVariant}
        onRemoveVariant={removeVariant}
      />

      <div className="flex justify-end w-full">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
