import { useState, useEffect } from "react";
import { Button, Spinner } from "../../components/ui";
import { InventoryTable } from "../../components/products";
import { SearchBar } from "../../components/ui/SearchBar";
import {
  getOwnedProducts,
  deleteProduct,
  activateProduct,
  deactivateProduct,
} from "../../api/products";

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
  const [products, setProducts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchOwnedProducts = async () => {
      try {
        if (page === 0 && totalElements === 0) {
          setInitialLoading(true);
        } else {
          setPageLoading(true);
        }
        const data = await getOwnedProducts(page);
        setProducts(data?.content || []);
        setTotalPages(data?.totalPages || 0);
        setTotalElements(data?.totalElements || 0);
      } catch (error) {
        setError("Ocurrió un error al cargar tus productos");
      } finally {
        setInitialLoading(false);
        setPageLoading(false);
      }
    };
    fetchOwnedProducts();
  }, [page, refreshKey]);

  const handleToggleActive = async (productId, isActive) => {
    try {
      if (isActive) {
        await deactivateProduct(productId);
      } else {
        await activateProduct(productId);
      }
      setProducts((prev) =>
        prev.map((p) => p.id === productId ? { ...p, isActive: !p.isActive } : p)
      );
    } catch (error) {
      // error al cambiar estado
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      const newTotal = totalElements - 1;
      const newTotalPages = Math.ceil(newTotal / PAGE_SIZE);
      const newPage = page >= newTotalPages ? Math.max(0, newTotalPages - 1) : page;
      setTotalElements(newTotal);
      setTotalPages(newTotalPages);
      if (newPage !== page) {
        setPage(newPage);
      } else {
        setRefreshKey((k) => k + 1);
      }
    } catch (error) {
      // error al eliminar
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

      {initialLoading ? (
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
      ) : products.length || pageLoading ? (
        <div className="flex flex-col gap-4 my-8">
          <SearchBar />
          <div
            style={{
              opacity: pageLoading ? 0.4 : 1,
              transition: "opacity 0.15s",
              minHeight: `${TABLE_MIN_HEIGHT}px`,
            }}
          >
            <InventoryTable
              products={products}
              onToggleActive={handleToggleActive}
              onDeleteProduct={handleDeleteProduct}
            />
          </div>
          <div className="flex items-center justify-center gap-2 py-4">
            {totalPages > 1 && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  ‹
                </Button>
                {pageWindow.map((i) => (
                  <Button
                    key={i}
                    variant={i === page ? "primary" : "outline"}
                    onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
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
