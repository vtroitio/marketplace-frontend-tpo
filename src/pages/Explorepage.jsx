import { useState } from "react";
import { Card, Button } from "../components/ui";
import { SearchIcon } from "../components/icons";
import hoodieImage from "../assets/product-hoodie.png";
import tshirtImage from "../assets/product-tshirt.png";

const allProducts = [
  { id: 1, title: 'Hoodie Type-01 "Ghost"', price: "$120.00", image: hoodieImage, category: "Hoodies", sizes: ["S", "M", "L", "XL"], colors: ["#000000"] },
  { id: 2, title: "T-Shirt Unit-02", price: "$45.00", image: tshirtImage, category: "Camisetas", sizes: ["S", "M", "L"], colors: ["#000000", "#e60012"] },
  { id: 3, title: "T-Shirt Unit-02", price: "$45.00", image: tshirtImage, category: "Camisetas", sizes: ["M", "L", "XL"], colors: ["#e5a100"] },
  { id: 4, title: 'Hoodie Type-01 "Ghost"', price: "$120.00", image: hoodieImage, category: "Hoodies", sizes: ["S", "L"], colors: ["#000000", "#3b82f6"] },
  { id: 5, title: "T-Shirt Unit-02", price: "$45.00", image: tshirtImage, category: "Camisetas", sizes: ["S", "M"], colors: ["#22c55e"] },
  { id: 6, title: "T-Shirt Unit-02", price: "$45.00", image: tshirtImage, category: "Camisetas", sizes: ["XL"], colors: ["#ffffff"] },
  { id: 7, title: 'Hoodie Type-01 "Ghost"', price: "$120.00", image: hoodieImage, category: "Hoodies", sizes: ["S", "M", "L", "XL"], colors: ["#000000", "#e60012"] },
  { id: 8, title: "T-Shirt Unit-02", price: "$45.00", image: tshirtImage, category: "Accesorios", sizes: ["S", "M"], colors: ["#3b82f6"] },
  { id: 9, title: "T-Shirt Unit-02", price: "$45.00", image: tshirtImage, category: "Accesorios", sizes: ["L", "XL"], colors: ["#e5a100", "#22c55e"] },
];

const CATEGORIES = ["Camisetas", "Hoodies", "Accesorios"];
const SIZES = ["S", "M", "L", "XL"];
const COLORS = ["#000000", "#e60012", "#e5a100", "#22c55e", "#3b82f6", "#ffffff"];

export function ExplorePage() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    categories: [],
    sizes: [],
    colors: [],
    minPrice: "",
    maxPrice: "",
  });

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleFilter = () => {
    setAppliedFilters({
      search,
      categories: selectedCategories,
      sizes: selectedSizes,
      colors: selectedColors,
      minPrice,
      maxPrice,
    });
  };

  const filtered = allProducts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(appliedFilters.search.toLowerCase());
    const matchCategory = appliedFilters.categories.length === 0 || appliedFilters.categories.includes(p.category);
    const matchSize = appliedFilters.sizes.length === 0 || p.sizes.some((s) => appliedFilters.sizes.includes(s));
    const matchColor = appliedFilters.colors.length === 0 || p.colors.some((c) => appliedFilters.colors.includes(c));
    const price = parseFloat(p.price.replace("$", ""));
    const matchMin = appliedFilters.minPrice === "" || price >= parseFloat(appliedFilters.minPrice);
    const matchMax = appliedFilters.maxPrice === "" || price <= parseFloat(appliedFilters.maxPrice);
    return matchSearch && matchCategory && matchSize && matchColor && matchMin && matchMax;
  });

  return (
    <div className="bg-neutral min-h-screen">
      <div className="mx-auto max-w-295 px-8 py-12 md:px-12">

        {/* Buscador */}
        <div className="mb-8 border border-secondary flex items-center px-4 gap-3">
          <SearchIcon size={20} className="text-tertiary flex-shrink-0" />
          <input
            className="w-full py-4 bg-transparent text-lg focus:outline-none placeholder:text-tertiary"
            placeholder="Buscar Prendas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setAppliedFilters((prev) => ({ ...prev, search }));
              }
            }}
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
              {CATEGORIES.map((cat) => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="accent-primary w-4 h-4"
                  />
                  <div className="text-sm">{cat}</div>
                </label>
              ))}
            </div>

            {/* Talla */}
            <div className="space-y-3">
              <div className="text-sm font-bold uppercase tracking-[1.2px] text-tertiary">
                Talla
              </div>
              {SIZES.map((size) => (
                <label key={size} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size)}
                    onChange={() => toggleSize(size)}
                    className="accent-primary w-4 h-4"
                  />
                  <div className="text-sm">{size}</div>
                </label>
              ))}
            </div>

            {/* Color */}
            <div className="space-y-3">
              <div className="text-sm font-bold uppercase tracking-[1.2px] text-tertiary">
                Color
              </div>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={`w-6 h-6 border-2 transition-all ${
                      selectedColors.includes(color)
                        ? "border-primary scale-110"
                        : "border-secondary"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
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
            {filtered.length > 0 ? (
              filtered.map((product) => (
                <Card
                  key={product.id}
                  image={product.image}
                  title={product.title}
                  price={product.price}
                  to={`/explore/${product.id}`}
                  className="max-w-none"
                />
              ))
            ) : (
              <div className="col-span-3 py-20 text-center">
                <div className="text-tertiary">No se encontraron productos.</div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}