import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Input } from "../components/ui";

const API_BASE = "http://localhost:8080";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

function getProductImage(product) {
  return product.images?.[0]?.url ?? null;
}

// Extrae valores únicos de atributo por código (ej: "color", "size")
function extractAttributeOptions(products, attrCode) {
  const seen = new Map();
  for (const p of products) {
    for (const v of p.variants ?? []) {
      for (const av of v.attributeValues ?? []) {
        if (av.attributeCode === attrCode && !seen.has(av.id)) {
          seen.set(av.id, av);
        }
      }
    }
  }
  return [...seen.values()];
}

// ── Sub-componentes ───────────────────────────────────────────────────────────

function StarIcon({ filled }) {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.44.91-5.32-3.87-3.77 5.34-.78L10 1z"
        fill={filled ? "#e60012" : "none"}
        stroke="#e60012"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FilterSection({ title, children }) {
  return (
    <div className="border-b border-secondary pb-5 mb-5 last:border-0 last:mb-0">
      <p className="text-xs font-bold uppercase tracking-[1.2px] text-secondary mb-3">
        {title}
      </p>
      {children}
    </div>
  );
}

function CheckboxItem({ label, checked, onChange, colorHex }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group mb-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
          checked ? "border-primary bg-primary" : "border-secondary bg-transparent"
        }`}
      >
        {checked && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path
              d="M1 3l2 2 4-4"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {colorHex ? (
        <span className="flex items-center gap-2">
          <span
            className="w-4 h-4 border border-secondary"
            style={{ backgroundColor: colorHex }}
          />
          <span className="text-sm text-secondary group-hover:text-primary transition-colors">
            {label}
          </span>
        </span>
      ) : (
        <span className="text-sm text-secondary group-hover:text-primary transition-colors">
          {label}
        </span>
      )}
    </label>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="border border-secondary animate-pulse">
      <div className="aspect-[394/369] bg-secondary/10" />
      <div className="px-3 py-3 border-t border-secondary space-y-2">
        <div className="h-3 bg-secondary/10 w-3/4" />
        <div className="h-3 bg-secondary/10 w-1/3" />
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────

export function ExplorePage() {
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Opciones derivadas de los productos
  const [sizeOptions, setSizeOptions] = useState([]);
  const [colorOptions, setColorOptions] = useState([]);

  // ── Carga de datos ────────────────────────────────────────────────────────

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE}/products?size=100`),
          fetch(`${API_BASE}/categories`),
        ]);

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error("Error al cargar los datos");
        }

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        const products = productsData.content ?? [];
        setAllProducts(products);
        setCategories(categoriesData);
        setSizeOptions(extractAttributeOptions(products, "size"));
        setColorOptions(extractAttributeOptions(products, "color"));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // ── Filtrado ──────────────────────────────────────────────────────────────

  const filteredProducts = useCallback(() => {
    return allProducts.filter((product) => {
      // Búsqueda por nombre
      if (
        search.trim() &&
        !product.name.toLowerCase().includes(search.trim().toLowerCase())
      ) {
        return false;
      }

      // Filtro por categoría
      if (selectedCategories.length > 0) {
        const productCategoryIds = (product.categories ?? []).map((c) => c.id);
        const hasCategory = selectedCategories.some((id) =>
          productCategoryIds.includes(id)
        );
        if (!hasCategory) return false;
      }

      // Filtro por talle
      if (selectedSizes.length > 0) {
        const productSizeIds = (product.variants ?? []).flatMap((v) =>
          (v.attributeValues ?? [])
            .filter((av) => av.attributeCode === "size")
            .map((av) => av.id)
        );
        const hasSize = selectedSizes.some((id) => productSizeIds.includes(id));
        if (!hasSize) return false;
      }

      // Filtro por color
      if (selectedColors.length > 0) {
        const productColorIds = (product.variants ?? []).flatMap((v) =>
          (v.attributeValues ?? [])
            .filter((av) => av.attributeCode === "color")
            .map((av) => av.id)
        );
        const hasColor = selectedColors.some((id) =>
          productColorIds.includes(id)
        );
        if (!hasColor) return false;
      }

      // Filtro por precio
      const price = product.price ?? 0;
      if (minPrice !== "" && price < Number(minPrice)) return false;
      if (maxPrice !== "" && price > Number(maxPrice)) return false;

      return true;
    });
  }, [
    allProducts,
    search,
    selectedCategories,
    selectedSizes,
    selectedColors,
    minPrice,
    maxPrice,
  ])();

  // ── Toggle helpers ────────────────────────────────────────────────────────

  function toggleItem(list, setList, id) {
    setList((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
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

  const hasFilters =
    search ||
    selectedCategories.length ||
    selectedSizes.length ||
    selectedColors.length ||
    minPrice ||
    maxPrice;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="bg-neutral min-h-screen">
      {/* Barra de búsqueda */}
      <div className="border-b border-secondary px-8 md:px-16 py-4">
        <div className="mx-auto max-w-295">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-tertiary"
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
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

      <div className="mx-auto max-w-295 px-8 md:px-16 py-8">
        <div className="flex gap-8 items-start">
          {/* ── Sidebar de filtros ── */}
          <aside className="w-52 shrink-0 hidden md:block">
            <div className="border border-secondary p-5">
              <div className="flex items-center justify-between mb-5">
                <p className="text-xs font-bold uppercase tracking-[1.2px] text-secondary">
                  Filtros
                </p>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary uppercase tracking-[1.2px] font-bold hover:underline"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Categorías */}
              {categories.length > 0 && (
                <FilterSection title="Categoría">
                  {categories.map((cat) => (
                    <CheckboxItem
                      key={cat.id}
                      label={cat.name}
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() =>
                        toggleItem(
                          selectedCategories,
                          setSelectedCategories,
                          cat.id
                        )
                      }
                    />
                  ))}
                </FilterSection>
              )}

              {/* Talles */}
              {sizeOptions.length > 0 && (
                <FilterSection title="Talla">
                  {sizeOptions.map((s) => (
                    <CheckboxItem
                      key={s.id}
                      label={s.value}
                      checked={selectedSizes.includes(s.id)}
                      onChange={() =>
                        toggleItem(selectedSizes, setSelectedSizes, s.id)
                      }
                    />
                  ))}
                </FilterSection>
              )}

              {/* Colores */}
              {colorOptions.length > 0 && (
                <FilterSection title="Color">
                  {colorOptions.map((c) => (
                    <CheckboxItem
                      key={c.id}
                      label={c.value}
                      colorHex={c.hexColor}
                      checked={selectedColors.includes(c.id)}
                      onChange={() =>
                        toggleItem(selectedColors, setSelectedColors, c.id)
                      }
                    />
                  ))}
                </FilterSection>
              )}

              {/* Precio */}
              <FilterSection title="Precio">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full border border-secondary bg-transparent px-2 py-2 text-sm focus:outline-none focus:ring-1"
                  />
                  <span className="text-tertiary text-xs">-</span>
                  <input
                    type="number"
                    placeholder="Máx"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full border border-secondary bg-transparent px-2 py-2 text-sm focus:outline-none focus:ring-1"
                  />
                </div>
              </FilterSection>
            </div>
          </aside>

          {/* ── Grilla de productos ── */}
          <div className="flex-1 min-w-0">
            {error && (
              <div className="border border-primary/40 bg-primary/5 px-6 py-4 text-sm text-secondary mb-6">
                {error}
              </div>
            )}

            {!loading && !error && filteredProducts.length === 0 && (
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
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {loading
                ? Array.from({ length: 9 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))
                : filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      title={product.name}
                      price={formatPrice(product.price)}
                      image={getProductImage(product)}
                      to={`/explore/${product.id}`}
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
