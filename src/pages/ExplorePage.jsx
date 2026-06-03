import { useState, useMemo } from "react";
import { Button, Card } from "../components/ui";
import { FilterSidebar } from "../components/filters";
import { SearchIcon } from "../components/icons";
import { formatPrice } from "../helpers/formatters";
import {
  MOCK_PRODUCTS,
  MOCK_CATEGORIES,
  MOCK_ALL_SIZES,
  MOCK_ALL_COLORS,
} from "../helpers/mockData";

export function ExplorePage() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const hasFilters =
    search ||
    selectedCategories.length ||
    selectedSizes.length ||
    selectedColors.length ||
    minPrice ||
    maxPrice;

  function toggle(setList, value) {
    setList((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    );
  }

  function clearFilters() {
    setSearch("");
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinPrice("");
    setMaxPrice("");
  }

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      if (
        search.trim() &&
        !product.name.toLowerCase().includes(search.trim().toLowerCase())
      )
        return false;

      if (selectedCategories.length > 0) {
        const ids = product.categories.map((c) => c.id);
        if (!selectedCategories.some((id) => ids.includes(id))) return false;
      }

      if (selectedSizes.length > 0) {
        const labels = product.sizes.map((s) => s.label);
        if (!selectedSizes.some((s) => labels.includes(s))) return false;
      }

      if (selectedColors.length > 0) {
        const colorIds = product.colors.map((c) => c.id);
        if (!selectedColors.some((id) => colorIds.includes(id))) return false;
      }

      if (minPrice !== "" && product.price < Number(minPrice)) return false;
      if (maxPrice !== "" && product.price > Number(maxPrice)) return false;

      return true;
    });
  }, [search, selectedCategories, selectedSizes, selectedColors, minPrice, maxPrice]);

  return (
    <div className="bg-neutral min-h-screen">
      {/* Barra de búsqueda */}
      <div className="border-b border-secondary px-4 sm:px-8 md:px-16 py-4">
        <div className="mx-auto max-w-295">
          <div className="relative">
            <SearchIcon
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-tertiary"
            />
            <input
              type="text"
              placeholder="Buscar prendas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-secondary bg-transparent py-3 pl-11 pr-4 text-base focus:outline-none focus:ring-2 placeholder:text-tertiary"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-295 px-4 sm:px-8 md:px-16 py-8">
        {/* Botón de filtros para mobile */}
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            fullWidth
            onClick={() => setShowFilters((prev) => !prev)}
          >
            {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <FilterSidebar
            categories={MOCK_CATEGORIES}
            sizes={MOCK_ALL_SIZES}
            colors={MOCK_ALL_COLORS}
            selectedCategories={selectedCategories}
            selectedSizes={selectedSizes}
            selectedColors={selectedColors}
            minPrice={minPrice}
            maxPrice={maxPrice}
            hasFilters={hasFilters}
            open={showFilters}
            onToggleCategory={(id) => toggle(setSelectedCategories, id)}
            onToggleSize={(s) => toggle(setSelectedSizes, s)}
            onToggleColor={(id) => toggle(setSelectedColors, id)}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            onClear={clearFilters}
          />

          {/* Grilla de productos */}
          <div className="flex-1 min-w-0 w-full">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-tertiary text-lg mb-4">
                  No se encontraron prendas
                </p>
                {hasFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Limpiar filtros
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    title={product.name}
                    price={formatPrice(product.price)}
                    image={product.images[0]}
                    to={`/explore/${product.id}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
