import { FilterSection } from "./FilterSection";
import { CheckboxItem } from "./CheckboxItem";

export function FilterSidebar({
  categories,
  sizes,
  colors,
  selectedCategories,
  selectedSizes,
  selectedColors,
  minPrice,
  maxPrice,
  hasFilters,
  open = false,
  onToggleCategory,
  onToggleSize,
  onToggleColor,
  onMinPriceChange,
  onMaxPriceChange,
  onClear,
}) {
  return (
    <aside
      className={`w-full md:w-52 shrink-0 ${open ? "block" : "hidden"} md:block`}
    >
      <div className="border border-secondary p-5">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs font-bold uppercase tracking-[1.2px] text-secondary">
            Filtros
          </p>
          {hasFilters && (
            <button
              onClick={onClear}
              className="text-xs text-primary uppercase tracking-[1.2px] font-bold hover:underline"
            >
              Limpiar
            </button>
          )}
        </div>

        <FilterSection title="Categoría">
          {categories.map((cat) => (
            <CheckboxItem
              key={cat.id}
              label={cat.name}
              checked={selectedCategories.includes(cat.id)}
              onChange={() => onToggleCategory(cat.id)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Talla">
          {sizes.map((s) => (
            <CheckboxItem
              key={s}
              label={s}
              checked={selectedSizes.includes(s)}
              onChange={() => onToggleSize(s)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Color">
          {colors.map((c) => (
            <CheckboxItem
              key={c.id}
              label={c.value}
              colorHex={c.hexColor}
              checked={selectedColors.includes(c.id)}
              onChange={() => onToggleColor(c.id)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Precio">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Mín"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className="w-full border border-secondary bg-transparent px-2 py-2 text-sm focus:outline-none focus:ring-1"
            />
            <span className="text-tertiary text-xs">-</span>
            <input
              type="number"
              placeholder="Máx"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="w-full border border-secondary bg-transparent px-2 py-2 text-sm focus:outline-none focus:ring-1"
            />
          </div>
        </FilterSection>
      </div>
    </aside>
  );
}
