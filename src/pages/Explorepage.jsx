import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Card, Button, Spinner } from "../components/ui";
import { SearchBar } from "../components/ui/SearchBar";

import {
  applyExploreFilters,
  applyExploreSearch,
  clearExploreFilters,
  fetchExploreProducts,
  fetchProductFilterOptions,
  selectExploreActiveFiltersCount,
  selectExploreQueryKey,
  setExploreMaxPrice,
  setExploreMinPrice,
  setExploreSearch,
  toggleExploreCategory,
  toggleExploreColor,
  toggleExploreSize,
} from "../features/products";

function includesId(list, id) {
  return list.some((currentId) => String(currentId) === String(id));
}

function getErrorMessage(error) {
  if (!error) return "";
  if (typeof error === "string") return error;
  return error.message || "Ocurrió un error.";
}

export function ExplorePage() {
  const dispatch = useDispatch();
  const debounceRef = useRef(null);

  const filtersLoading = useSelector((state) => state.products.filterOptions.loading);
  const productsLoading = useSelector((state) => state.products.explore.loading);
  const error = useSelector((state) => state.products.explore.error);

  const products = useSelector((state) => state.products.explore.content);
  const categories = useSelector((state) => state.products.filterOptions.categories);
  const sizes = useSelector((state) => state.products.filterOptions.sizes);
  const colors = useSelector((state) => state.products.filterOptions.colors);

  const draftFilters = useSelector((state) => state.products.explore.draftFilters);
  const activeFiltersCount = useSelector(selectExploreActiveFiltersCount)
  const exploreQueryKey = useSelector(selectExploreQueryKey);

  useEffect(() => {
    dispatch(fetchProductFilterOptions());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchExploreProducts());
  }, [dispatch, exploreQueryKey]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      dispatch(applyExploreSearch());
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [dispatch, draftFilters.search]);

  const handleSearchKeyDown = (e) => {
    if (e.key !== "Enter") return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    dispatch(applyExploreSearch());
  };

  const handleClearFilters = () => {
    dispatch(clearExploreFilters());
  };

  const handleFilter = () => {
    dispatch(applyExploreFilters());
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-primary">Error: {getErrorMessage(error)}</div>
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
            value={draftFilters.search}
            onChange={(e) => dispatch(setExploreSearch(e.target.value))}
            onKeyDown={handleSearchKeyDown}
            placeholder="Buscar prendas..."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12 items-start">
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

            <div className="space-y-3">
              <div className="text-sm font-bold uppercase tracking-[1.2px] text-tertiary flex items-center gap-2">
                Categoría
                {draftFilters.categoryIds.length > 0 && (
                  <span className="bg-primary text-neutral text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {draftFilters.categoryIds.length}
                  </span>
                )}
              </div>

              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={includesId(draftFilters.categoryIds, cat.id)}
                    onChange={() => dispatch(toggleExploreCategory(cat.id))}
                    className="accent-primary w-4 h-4"
                  />

                  <div className="text-sm">{cat.name}</div>
                </label>
              ))}
            </div>

            <div className="space-y-3">
              <div className="text-sm font-bold uppercase tracking-[1.2px] text-tertiary flex items-center gap-2">
                Talla
                {draftFilters.sizeIds.length > 0 && (
                  <span className="bg-primary text-neutral text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {draftFilters.sizeIds.length}
                  </span>
                )}
              </div>

              {sizes.map((size) => (
                <label
                  key={size.id}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={includesId(draftFilters.sizeIds, size.id)}
                    onChange={() => dispatch(toggleExploreSize(size.id))}
                    className="accent-primary w-4 h-4"
                  />

                  <div className="text-sm">{size.value}</div>
                </label>
              ))}
            </div>

            <div className="space-y-3">
              <div className="text-sm font-bold uppercase tracking-[1.2px] text-tertiary flex items-center gap-2">
                Color
                {draftFilters.colorIds.length > 0 && (
                  <span className="bg-primary text-neutral text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {draftFilters.colorIds.length}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const isSelected = includesId(
                    draftFilters.colorIds,
                    color.id,
                  );

                  return (
                    <button
                      key={color.id}
                      type="button"
                      title={color.value}
                      onClick={() => dispatch(toggleExploreColor(color.id))}
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

            <div className="space-y-3">
              <div className="text-sm font-bold uppercase tracking-[1.2px] text-tertiary">
                Precio
              </div>

              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={draftFilters.minPrice}
                  onChange={(e) =>
                    dispatch(setExploreMinPrice(e.target.value))
                  }
                  className="w-full border border-secondary px-3 py-2 bg-transparent text-sm focus:outline-none"
                />

                <div className="text-tertiary">-</div>

                <input
                  type="number"
                  placeholder="Max"
                  value={draftFilters.maxPrice}
                  onChange={(e) =>
                    dispatch(setExploreMaxPrice(e.target.value))
                  }
                  className="w-full border border-secondary px-3 py-2 bg-transparent text-sm focus:outline-none"
                />
              </div>
            </div>

            <Button fullWidth onClick={handleFilter}>
              Filtrar
            </Button>
          </aside>

          <div
            className="grid grid-cols-2 md:grid-cols-3 gap-6"
            style={{
              opacity: productsLoading ? 0.5 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {productsLoading && products.length === 0 ? (
              <div className="col-span-3 flex justify-center py-20">
                <Spinner />
              </div>
            ) : products.length > 0 ? (
              products.map((product) => (
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