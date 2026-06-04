import { useState } from "react";
import { Select, Input, Button } from "../ui";
import { ImageUploader } from "./ImageUploader";

const SIZES = ["S", "M", "L", "XL"];

export function VariantForm({
  index,
  variant,
  onChange,
  onRemoveVariant,
  canRemove,
}) {
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");

  const toggleSize = (size) => {
    setSelectedSizes((prev) => {
      if (prev.includes(size)) {
        return prev.filter((selectedSize) => selectedSize !== size);
      }

      return [...prev, size];
    });
  };

  return (
    <div className="relative flex flex-col gap-8 p-8 border border-secondary mb-8">
      {canRemove && (
        <Button
          variant="text"
          className="absolute top-2 right-0 p-2! text-secondary! font-normal text-2xl!"
          onClick={() => onRemoveVariant(index)}
        >
          X
        </Button>
      )}
      <ImageUploader
        images={variant.images}
        onChange={(images) => onChange(index, "images", images)}
      />
      <div className="flex flex-row gap-16 w-full items-center justify-between">
        <div className="w-1/2">
          <Select
            label="Color"
            value={selectedColor || variant.color}
            onChange={(e) => {
              setSelectedColor(e.target.value);
              onChange(index, "color", e.target.value);
            }}
            placeholder="Seleccionar"
          >
            <option value="black">Negro</option>
            <option value="white">Blanco</option>
            <option value="red">Rojo</option>
          </Select>
        </div>
        <div className="flex flex-col gap-4 w-1/2">
          <p>
            <b>TALLAS DISPONIBLES</b>
          </p>

          <div className="flex gap-2 size-12">
            {SIZES.map((size) => {
              const isSelected = selectedSizes.includes(size);

              return (
                <Button
                  key={size}
                  type="button"
                  variant="selection"
                  className={`${isSelected ? "bg-secondary! text-neutral!" : ""}`}
                  onClick={() => toggleSize(size)}
                >
                  {size}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedSizes.map((size) => (
        <div key={size} className="flex flex-row w-full gap-4">
          <div className="shrink">
            <Input label="Talla" value={size} disabled />
          </div>
          <Input
            label="Stock"
            type="number"
            value={variant.stock}
            onChange={(e) => onChange(index, "stock", e.target.value)}
            placeholder="Ej. 10"
          />

          <Input
            label="Precio unitario"
            type="number"
            value={variant.price}
            onChange={(e) => onChange(index, "price", e.target.value)}
            placeholder="$10.00"
          />
        </div>
      ))}
    </div>
  );
}
