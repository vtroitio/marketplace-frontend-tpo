import { Select, Input, Button } from "../ui";
import { ImageUploader } from "./ImageUploader";
import {
  getAttributeValues,
  ATTRIBUTES,
} from "../../helpers/productFormMapper";

export function VariantForm({
  index,
  group,
  attributes,
  onChange,
  onRemoveVariantGroup,
  canRemove,
}) {
  const colors = getAttributeValues(attributes, ATTRIBUTES.COLOR);
  const sizes = getAttributeValues(attributes, ATTRIBUTES.SIZE);

  function handleColorChange(value) {
    const color = colors.find((color) => color.code === value);

    onChange(index, "color", {
      colorAttributeValueId: color.id,
      colorCode: color.code,
      colorValue: color.value,
      hexColor: color.hexColor,
    });
  }

  function handleImagesChange(images) {
    onChange(index, "images", images);
  }

  function toggleSize(size) {
    const alreadySelected = group.sizes.some(
      (selectedSize) => selectedSize.sizeAttributeValueId === size.id,
    );

    if (alreadySelected) {
      const newSizes = group.sizes.filter(
        (selectedSize) => selectedSize.sizeAttributeValueId !== size.id,
      );

      onChange(index, "sizes", newSizes);
      return;
    }

    const newSizes = [
      ...group.sizes,
      {
        variantId: null,
        sku: "",
        sizeAttributeValueId: size.id,
        sizeCode: size.code,
        sizeValue: size.value,
        price: "",
        stock: "",
      },
    ];

    onChange(index, "sizes", newSizes);
  }

  function handleSizeFieldChange(sizeAttributeValueId, field, value) {
    const newSizes = group.sizes.map((size) => {
      if (size.sizeAttributeValueId !== sizeAttributeValueId) {
        return size;
      }

      return {
        ...size,
        [field]: value,
      };
    });

    onChange(index, "sizes", newSizes);
  }

  return (
    <div className={`relative flex flex-col gap-8 p-8 border border-[${group.hexColor}]! mb-8`}>
      {canRemove && (
        <Button
          variant="text"
          className="absolute top-2 right-0 p-2! text-secondary! font-normal text-2xl!"
          onClick={() => onRemoveVariantGroup(index)}
        >
          X
        </Button>
      )}

      <ImageUploader images={group.images} onChange={handleImagesChange} />

      <div className="flex flex-row gap-16 w-full items-center justify-between">
        <div className="w-1/2">
          <Select
            label="Color"
            value={group.colorCode ?? ""}
            onChange={(e) => handleColorChange(e.target.value)}
            placeholder="Seleccionar"
          >
            {colors.map((color) => (
              <option key={color.id} value={color.code}>
                {color.value}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-4 w-1/2">
          <p>
            <b>TALLAS DISPONIBLES</b>
          </p>

          <div className="flex gap-2">
            {sizes.map((size) => {
              const isSelected = group.sizes.some(
                (selectedSize) => selectedSize.sizeAttributeValueId === size.id,
              );

              return (
                <Button
                  key={size.id}
                  type="button"
                  variant="selection"
                  className={`${
                    isSelected ? "bg-secondary! text-neutral!" : ""
                  }`}
                  onClick={() => toggleSize(size)}
                >
                  {size.value}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {group.sizes.map((size) => (
        <div
          key={size.sizeAttributeValueId}
          className="flex flex-row w-full gap-4"
        >
          <div className="shrink">
            <Input label="Talla" value={size.sizeValue} disabled />
          </div>

          <Input
            label="Stock"
            type="number"
            value={size.stock}
            onChange={(e) =>
              handleSizeFieldChange(
                size.sizeAttributeValueId,
                "stock",
                e.target.value,
              )
            }
            placeholder="Ej. 10"
          />

          <Input
            label="Precio unitario"
            type="number"
            value={size.price}
            onChange={(e) =>
              handleSizeFieldChange(
                size.sizeAttributeValueId,
                "price",
                e.target.value,
              )
            }
            placeholder="$10.00"
          />
        </div>
      ))}
    </div>
  );
}
