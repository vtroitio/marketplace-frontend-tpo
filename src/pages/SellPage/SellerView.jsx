import { useState, useEffect } from "react";
import { Button, Spinner } from "../../components/ui";
import { InventoryTable } from "../../components/products";
import { SearchBar } from "../../components/ui/SearchBar";
import { getOwnedProducts } from "../../api/products";

export function SellerView() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOwnedProducts = async () => {
      try {
        setLoading(true);

        const data = await getOwnedProducts();
        setProducts(data?.content || []);
      } catch (error) {
        setError("Ocurrió un error al cargar tus productos");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOwnedProducts();
  }, []);

  const handleToggleActive = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? { ...product, isActive: !product.isActive }
          : product,
      ),
    );
  };

  const handleDeleteProduct = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId),
    );
  };

  return (
    <div className="container mx-auto py-32">
      <div className="flex flex-col gap-4 border-b border-secondary pb-8">
        <h1>GESTIÓN DE INVENTARIO</h1>
        <div className="flex items-end justify-between">
          <p className="w-2/3">
            Gestión centralizada de tu inventario de prendas. Publica, edita,
            pausa o elimina tus publicaciones y monitorea el estado de tus
            ventas en tiempo real.
          </p>
          {products.length !== 0 && (
            <Button to="/sell/new">Publicar prenda</Button>
          )}
        </div>
      </div>
      {loading ? (
        <div className="flex flex-col items-center gap-4 py-16">
          <Spinner />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-4 py-16">
          <h2>{error}</h2>
          <p className="text-center w-2/3">
            Por favor, intenta recargar la página o contacta al soporte si el
            problema persiste.
          </p>
        </div>
      ) : products.length ? (
        <div className="flex flex-col items-center gap-4 my-8">
          <SearchBar />
          <InventoryTable
            products={products}
            onToggleActive={handleToggleActive}
            onDeleteProduct={handleDeleteProduct}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-16">
          <h2>No tienes prendas publicadas</h2>
          <p className="text-center w-2/3">
            Comienza a vender tus prendas creando tu primera publicación. ¡Es
            rápido y fácil!
          </p>
          <Button to="/sell/new">Publicar prenda</Button>
        </div>
      )}
    </div>
  );
}
