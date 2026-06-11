import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppLink, Spinner } from "../../components/ui";
import { LeftArrowIcon } from "../../components/icons";
import { ProductForm } from "../../components/products";
import { getProductForEdit } from "../../api/products";

export function EditProductPage() {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getProductForEdit(productId);
        setProduct(data);
      } catch (err) {
        setError("Ocurrió un error al cargar el producto.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleUpdateProduct = (updatedProduct) => {
    console.log("Producto actualizado:", updatedProduct);
  };

  if (loading) {
    return (
      <section className="container mx-auto py-64 ">
        <div className="w-full grow flex flex-col items-center justify-center gap-8">
          <Spinner />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto py-64 ">
        <div className="w-full grow flex flex-col items-center justify-center gap-8">
          <h1 className="font-logo uppercase text-8xl text-center">
            Producto no encontrado
          </h1>
          <AppLink to="/">
            <LeftArrowIcon />
            <span>Volver a la página de inicio</span>
          </AppLink>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-32 ">
      <AppLink to="/sell">
        <LeftArrowIcon />
        <span>Volver</span>
      </AppLink>
      <div className="border-b border-secondary pb-4">
        <h2>Editar Prenda</h2>
      </div>
      <ProductForm
        data={product}
        onSubmit={handleUpdateProduct}
        submitLabel="Actualizar Prenda"
      />
    </section>
  );
}
