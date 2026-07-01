import { useState, useEffect, useRef } from "react";
import { Card, Button, Spinner } from "../components/ui";
import { SearchBar } from "../components/ui/SearchBar";
import { getAllProducts, getAttributes, getCategories } from "../api/products";

const REFRESH_INTERVAL = 30_000;

export function ExplorePage() {
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [filters, setFilters] = useState({
    page: 0,
    size: 12,
    categoryIds: [],
    sizeIds: [],
    colorIds: [],
    minPrice: "",
    maxPrice: "",
  });

  const debounceRef = useRef(null);

  // Carga opciones de filtros una sola vez
  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        setFiltersLoading(true);
        const [attributesData, categoriesData] = await Promise.all([
          getAttributes(),
          getCategories(),
        ]);
        setCategories(categoriesData);
        setSizes(
          attributesData.find((attr) => attr.code === "TALLE")?.values || [],
        );
        setColors(
          attributesData.find((attr) => attr.code === "COLOR")?.values || [],
        );
      } catch (error) {
        setError(error);
      } finally {
        setFiltersLoading(false);
      }
    }
    fetchFilterOptions();
  }, []);

  // Carga productos cuando cambian los filtros o el refreshKey
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        const productsData = await getAllProducts(filters);
        setProducts(productsData);
      } catch (error) {
        setError(error);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, [filters, refreshKey]);

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey((k) => k + 1);
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Debounce de búsqueda al tipear
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters((prev) => {
        if (prev.search === search.trim()) return prev;
        return { ...prev, page: 0, search: search.trim() };
      });
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  // Búsqueda inmediata al presionar Enter
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setFilters((prev) => ({ ...prev, page: 0, search: search.trim() }));
    }
  };

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.some((c) => c.id === cat.id)
        ? prev.filter((c) => c.id !== cat.id)
        : [...prev, cat],
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.some((s) => s.id === size.id)
        ? prev.filter((s) => s.id !== size.id)
        : [...prev, size],
    );
  };

  const toggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.some((c) => c.id === color.id)
        ? prev.filter((c) => c.id !== color.id)
        : [...prev, color],
    );
  };

  const handleFilter = () => {
    setFilters({
      ...filters,
      page: 0,
      categoryIds: selectedCategories.map((cat) => cat.id),
      sizeIds: selectedSizes.map((size) => size.id),
      colorIds: selectedColors.map((color) => color.id),
      minPrice,
      maxPrice,
    });
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinPrice("");
    setMaxPrice("");
    setFilters((prev) => ({
      ...prev,
      page: 0,
      categoryIds: [],
      sizeIds: [],
      colorIds: [],
      minPrice: "",
      maxPrice: "",
    }));
  };

  const activeFiltersCount =
    selectedCategories.length +
    selectedSizes.length +
    selectedColors.length +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-primary">Error: {error.message}</div>
      </div>
    );
  }

  if (filtersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-neutral min-h-screen">
      <div className="mx-auto max-w-295 px-8 py-12 md:px-12">
        <div className="mb-8">
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Buscar prendas..."
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12 items-start">
          {/* Sidebar Filtros */}
          <aside className="border border-secondary p-6 space-y-8">
            <div>
              <h3>Filtros</h3>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs text-primary underline hover:opacity-70 cursor-pointer mt-1"
                >
                  Limpiar filtros ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* Categoría */}
            <div className="space-y-3">
              <div className="text-sm font-bold uppercase tracking-[1.2px] text-tertiary flex items-center gap-2">
                Categoría
                {selectedCategories.length > 0 && (
                  <span className="bg-primary text-neutral text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {selectedCategories.length}
                  </span>
                )}
              </div>
              {categories.map((cat) => (
                <label
                  key={cat.code}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.some((c) => c.id === cat.id)}
                    onChange={() => toggleCategory(cat)}
                    className="accent-primary w-4 h-4"
                  />
                  <div className="text-sm">{cat.name}</div>
                </label>
              ))}
            </div>

            {/* Talla */}
            <div className="space-y-3">
              <div className="text-sm font-bold uppercase tracking-[1.2px] text-tertiary flex items-center gap-2">
                Talla
                {selectedSizes.length > 0 && (
                  <span className="bg-primary text-neutral text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {selectedSizes.length}
                  </span>
                )}
              </div>
              {sizes.map((size) => (
                <label
                  key={size.code}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedSizes.some((s) => s.id === size.id)}
                    onChange={() => toggleSize(size)}
                    className="accent-primary w-4 h-4"
                  />
                  <div className="text-sm">{size.value}</div>
                </label>
              ))}
            </div>

            {/* Color */}
            <div className="space-y-3">
              <div className="text-sm font-bold uppercase tracking-[1.2px] text-tertiary flex items-center gap-2">
                Color
                {selectedColors.length > 0 && (
                  <span className="bg-primary text-neutral text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {selectedColors.length}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const isSelected = selectedColors.some(
                    (c) => c.id === color.id,
                  );
                  return (
                    <button
                      key={color.code}
                      type="button"
                      title={color.value}
                      onClick={() => toggleColor(color)}
                      className={`w-6 h-6 border-2 transition-all ${
                        isSelected
                          ? "border-primary scale-110"
                          : "border-secondary"
                      }`}
                      style={{ backgroundColor: color.hexColor }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Precio */}
            <div className="space-y-3">
              <div className="text-sm font-bold uppercase tracking-[1.2px] text-tertiary">
                Precio
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full border border-secondary px-3 py-2 bg-transparent text-sm focus:outline-none"
                />
                <div className="text-tertiary">-</div>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full border border-secondary px-3 py-2 bg-transparent text-sm focus:outline-none"
                />
              </div>
            </div>

            <Button fullWidth onClick={handleFilter}>
              Filtrar
            </Button>

          </aside>

          {/* Grid de productos */}
          <div
            className="grid grid-cols-2 md:grid-cols-3 gap-6"
            style={{
              opacity: productsLoading ? 0.5 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {productsLoading && products?.content?.length === 0 ? (
              <div className="col-span-3 flex justify-center py-20">
                <Spinner />
              </div>
            ) : products?.content?.length > 0 ? (
              products.content.map((product) => (
                <Card
                  key={product.id}
                  image={product.coverImagePath}
                  title={product.name}
                  price={product.price}
                  to={`/explore/${product.id}`}
                  className="max-w-none"
                />
              ))
            ) : (
              <div className="col-span-3 py-20 text-center">
                <div className="text-tertiary">
                  No se encontraron productos.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
