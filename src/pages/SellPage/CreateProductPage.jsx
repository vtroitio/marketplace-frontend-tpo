import { LeftArrowIcon } from "../../components/icons";
import { ProductForm } from "../../components/products";
import { AppLink } from "../../components/ui";

const handleUpdateProduct = (updatedProduct) => {
  console.log("Producto creado:", updatedProduct);
};

export function CreateProductPage() {
  return (
    <div className="container mx-auto py-32 ">
      <div className="pb-4 border-b border-secondary">
        <AppLink to="/sell?role=seller">
          <LeftArrowIcon />
          <span>Volver</span>
        </AppLink>
        <h2 className="uppercase">Publicar Nueva Prenda</h2>
      </div>
      <ProductForm
        data={{}}
        onSubmit={handleUpdateProduct}
        submitLabel="Publicar Prenda"
      />
    </div>
  );
}
