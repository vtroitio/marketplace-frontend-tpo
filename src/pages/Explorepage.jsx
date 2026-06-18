import { useState, useEffect } from "react";
import { Card, Button, Spinner } from "../components/ui";
import { SearchBar } from "../components/ui/SearchBar";
import { getAllProducts, getAttributes, getCategories } from "../api/products";

export function ExplorePage() {
  const [loading, setLoading] = useState(true);
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
  const [filters, setFilters] = useState({
    page: 0,
    size: 12,
    categoryIds: [],
    sizeIds: [],
    colorIds: [],
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        setLoading(true);
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
        console.error("Error fetching filter options:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const productsData = await getAllProducts(filters);

        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters((prev) => {
        if (prev.search === search.trim()) {
          return prev;
        }

        return {
          ...prev,
          page: 0,
          search: search.trim(),
        };
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.some((selectedCat) => selectedCat.id === cat.id)
        ? prev.filter((selectedCat) => selectedCat.id !== cat.id)
        : [...prev, cat],
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.some((selectedSize) => selectedSize.id === size.id)
        ? prev.filter((selectedSize) => selectedSize.id !== size.id)
        : [...prev, size],
    );
  };

  const toggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.some((selectedColor) => selectedColor.id === color.id)
        ? prev.filter((selectedColor) => selectedColor.id !== color.id)
        : [...prev, color],
    );
  };

  const handleFilter = () => {
    const nextFilters = {
      ...filters,
      page: 0,
      categoryIds: selectedCategories.map((cat) => cat.id),
      sizeIds: selectedSizes.map((size) => size.id),
      colorIds: selectedColors.map((color) => color.id),
      minPrice,
      maxPrice,
    };

    setFilters(nextFilters);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-primary">Error: {error.message}</div>
      </div>
    );
  }

  if (loading) {
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
            placeholder="Buscar prendas..."
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12 items-start">
          {/* Sidebar Filtros */}
          <aside className="border border-secondary p-6 space-y-8">
            <div>
              <h3>Filtros</h3>
            </div>

            {/* Categoría */}
            <div className="space-y-3">
              <div className="text-sm font-bold uppercase tracking-[1.2px] text-tertiary">
                Categoría
              </div>
              {categories.map((cat) => (
                <label
                  key={cat.code}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.some(
                      (selectedCat) => selectedCat.id === cat.id,
                    )}
                    onChange={() => toggleCategory(cat)}
                    className="accent-primary w-4 h-4"
                  />
                  <div className="text-sm">{cat.name}</div>
                </label>
              ))}
            </div>

            {/* Talla */}
            <div className="space-y-3">
              <div className="text-sm font-bold uppercase tracking-[1.2px] text-tertiary">
                Talla
              </div>
              {sizes.map((size) => (
                <label
                  key={size.code}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedSizes.some(
                      (selectedSize) => selectedSize.id === size.id,
                    )}
                    onChange={() => toggleSize(size)}
                    className="accent-primary w-4 h-4"
                  />
                  <div className="text-sm">{size.value}</div>
                </label>
              ))}
            </div>

            {/* Color */}
            <div className="space-y-3">
              <div className="text-sm font-bold uppercase tracking-[1.2px] text-tertiary">
                Color
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const isSelected = selectedColors.some(
                    (selectedColor) => selectedColor.id === color.id,
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {products?.content?.length > 0 ? (
              products?.content?.map((product) => (
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
