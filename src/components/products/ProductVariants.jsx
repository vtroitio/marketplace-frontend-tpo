import { Button } from "../ui";
import { VariantForm } from "./VariantForm";

export function ProductVariants({
  variantGroups,
  attributes,
  onVariantGroupChange,
  onAddVariantGroup,
  onRemoveVariantGroup,
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4 border-b border-secondary pb-4">
        <h3>Variantes</h3>

        <Button type="button" variant="text" onClick={onAddVariantGroup}>
          + Agregar color
        </Button>
      </div>

      {variantGroups?.map((group, index) => {
        const usedColorIds = variantGroups
          .filter((_, i) => i !== index)
          .map((g) => g.colorAttributeValueId)
          .filter(Boolean);

        return (
          <VariantForm
            key={group.colorAttributeValueId ?? index}
            index={index}
            group={group}
            attributes={attributes}
            usedColorIds={usedColorIds}
            onChange={onVariantGroupChange}
            onRemoveVariantGroup={onRemoveVariantGroup}
            canRemove={variantGroups.length > 1}
          />
        );
      })}
    </section>
  );
}