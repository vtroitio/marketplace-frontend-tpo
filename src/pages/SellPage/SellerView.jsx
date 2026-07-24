import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Spinner } from "../../components/ui";
import { InventoryTable } from "../../components/products";
import { SearchBar } from "../../components/ui/SearchBar";
import {
  fetchOwnedProducts,
  removeProduct,
  toggleProductActive,
  setPage,
  setOwnedSearch,
  applyOwnedSearch,
  selectOwnedSearch,
  selectOwnedProductsFiltered,
  selectProductsLoading,
  selectProductsError,
  selectProductsPage,
  selectProductsTotalPages,
  selectProductsTotalElements,
} from "../../features/products";

const PAGE_SIZE = 5;
const ROW_HEIGHT = 144;
const HEADER_HEIGHT = 42;
const TABLE_MIN_HEIGHT = PAGE_SIZE * ROW_HEIGHT + HEADER_HEIGHT;

function getPageWindow(page, totalPages) {
  let start = Math.max(0, page - 1);
  let end = start + 3;
  if (end > totalPages) {
    end = totalPages;
    start = Math.max(0, end - 3);
  }
  return Array.from({ length: end - start }, (_, i) => start + i);
}

export function SellerView() {
  const dispatch = useDispatch();

  const search = useSelector(selectOwnedSearch);
  const filteredProducts = useSelector(selectOwnedProductsFiltered);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const page = useSelector(selectProductsPage);
  const totalPages = useSelector(selectProductsTotalPages);
  const totalElements = useSelector(selectProductsTotalElements);

  useEffect(() => {
    dispatch(fetchOwnedProducts(page));
  }, [dispatch, page]);

  const handleToggleActive = (productId, isActive) => {
    dispatch(toggleProductActive({ productId, isActive }));
  };

  const handleDeleteProduct = (productId) => {
    dispatch(removeProduct(productId));
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      dispatch(applyOwnedSearch());
    }
  };

  const pageWindow = getPageWindow(page, totalPages);

  return (
    <div className="container mx-auto py-32">
      <div className="flex flex-col gap-4 border-b border-secondary pb-8">
        <h1>GESTIÓN DE INVENTARIO</h1>
        <div className="flex items-end justify-between">
          <div className="w-2/3">
            <p>
              Gestión centralizada de tu inventario de prendas. Publica, edita,
              pausa o elimina tus publicaciones y monitorea el estado de tus
              ventas en tiempo real.
            </p>
          </div>
          {totalElements > 0 && (
            <Button to="/sell/new">Publicar prenda</Button>
          )}
        </div>
      </div>

      {loading && filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-4 py-16">
          <h2>{error}</h2>
          <div className="text-center w-2/3">
            <p>
              Por favor, intenta recargar la página o contacta al soporte si el
              problema persiste.
            </p>
          </div>
        </div>
      ) : totalElements > 0 || loading ? (
        <div className="flex flex-col gap-4 my-8">
          <SearchBar
            value={search}
            onChange={(e) => dispatch(setOwnedSearch(e.target.value))}
            onKeyDown={handleSearchKeyDown}
            placeholder="Buscar producto..."
          />
          <div
            style={{
              opacity: loading ? 0.4 : 1,
              transition: "opacity 0.15s",
              minHeight: `${TABLE_MIN_HEIGHT}px`,
            }}
          >
            <InventoryTable
              products={filteredProducts}
              onToggleActive={handleToggleActive}
              onDeleteProduct={handleDeleteProduct}
            />
          </div>
          <div className="flex items-center justify-center gap-2 py-4">
            {totalPages > 1 && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(Math.max(0, page - 1))}
                  disabled={page === 0}
                >
                  ‹
                </Button>
                {pageWindow.map((i) => (
                  <Button
                    key={i}
                    variant={i === page ? "primary" : "outline"}
                    onClick={() => handlePageChange(i)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(Math.min(totalPages - 1, page + 1))}
                  disabled={page === totalPages - 1}
                >
                  ›
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-16">
          <h2>No tenés productos publicados</h2>
          <Button to="/sell/new">Publicar tu primera prenda</Button>
        </div>
      )}
    </div>
  );
}