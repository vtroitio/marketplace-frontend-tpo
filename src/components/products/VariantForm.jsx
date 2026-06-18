import { Select, Input, Button } from "../ui";
import { ImageUploader } from "./ImageUploader";
import {
  getAttributeValues,
  ATTRIBUTES,
} from "../../helpers/productFormMapper";

const STOCK_MAX = 9999;
const PRICE_MAX = 9999999;

function formatPrice(value) {
  if (!value && value !== 0) return "";
  const num = parseInt(String(value).replace(/\D/g, ""), 10);
  if (isNaN(num)) return "";
  return num.toLocaleString("de-DE");
}

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
      onChange(index, "sizes", group.sizes.filter(
        (selectedSize) => selectedSize.sizeAttributeValueId !== size.id,
      ));
      return;
    }

    onChange(index, "sizes", [
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
    ]);
  }

  function handleSizeFieldChange(sizeAttributeValueId, field, value) {
    const newSizes = group.sizes.map((size) => {
      if (size.sizeAttributeValueId !== sizeAttributeValueId) return size;
      return { ...size, [field]: value };
    });
    onChange(index, "sizes", newSizes);
  }

  function handlePriceChange(sizeAttributeValueId, rawValue) {
    const digits = rawValue.replace(/\D/g, "");
    const num = parseInt(digits, 10);
    if (!digits) {
      handleSizeFieldChange(sizeAttributeValueId, "price", "");
      return;
    }
    const clamped = Math.min(num, PRICE_MAX);
    handleSizeFieldChange(sizeAttributeValueId, "price", String(clamped));
  }

  function handleStockChange(sizeAttributeValueId, rawValue) {
    const digits = rawValue.replace(/\D/g, "");
    const num = parseInt(digits, 10);
    if (!digits) {
      handleSizeFieldChange(sizeAttributeValueId, "stock", "");
      return;
    }
    const clamped = Math.min(num, STOCK_MAX);
    handleSizeFieldChange(sizeAttributeValueId, "stock", String(clamped));
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
          <div><b>TALLAS DISPONIBLES</b></div>
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
        <div key={size.sizeAttributeValueId} className="flex flex-row w-full gap-4">
          <div className="shrink">
            <Input label="Talla" value={size.sizeValue} disabled />
          </div>

          <Input
            label="Stock"
            type="number"
            value={size.stock}
            onChange={(e) => handleStockChange(size.sizeAttributeValueId, e.target.value)}
            placeholder="Ej. 10"
            min={0}
            max={STOCK_MAX}
          />

          <div className="flex flex-col gap-1 w-full">
            <Input
              label="Precio unitario"
              type="text"
              value={size.price ? `$ ${formatPrice(size.price)}` : ""}
              onChange={(e) => handlePriceChange(size.sizeAttributeValueId, e.target.value)}
              placeholder="$ 0"
            />
            {size.price && (
              <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                Máximo: $ {formatPrice(String(PRICE_MAX))}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
