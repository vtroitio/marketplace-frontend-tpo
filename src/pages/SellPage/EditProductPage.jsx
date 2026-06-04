import { useParams } from "react-router-dom";
import { sellerProducts } from "../../data/sellerProdcuts";
import { AppLink } from "../../components/ui";
import { LeftArrowIcon } from "../../components/icons";
import { ProductForm } from "../../components/products";

export function EditProductPage() {
  const { productId } = useParams();

  const product = sellerProducts.find(
    (product) => product.id === Number(productId),
  );

  const handleUpdateProduct = (updatedProduct) => {
    console.log("Producto actualizado:", updatedProduct);
  };

  if (!product) {
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
      <AppLink to="/sell?role=seller">
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
