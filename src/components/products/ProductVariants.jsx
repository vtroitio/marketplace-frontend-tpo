import { Button } from "../ui";
import { VariantForm } from "./VariantForm";

export function ProductVariants({
  variants,
  onVariantChange,
  onAddVariant,
  onRemoveVariant,
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4 border-b border-secondary pb-4">
        <h3>Variantes</h3>

        <Button type="button" variant="text" onClick={onAddVariant}>
          + Agregar variante
        </Button>
      </div>

      {variants?.map((variant, index) => (
        <VariantForm
          key={index}
          index={index}
          variant={variant}
          onChange={onVariantChange}
          onRemoveVariant={onRemoveVariant}
          canRemove={variants.length > 1}
        />
      ))}
    </section>
  );
}
