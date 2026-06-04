import { useParams } from "react-router-dom";
import { sellerProducts } from "../../data/sellerProdcuts";
import { AppLink } from "../../components/ui";
import { LeftArrowIcon } from "../../components/icons";

export function EditProductPage() {
  const { productId } = useParams();

  const product = sellerProducts.find(
    (product) => product.id === Number(productId),
  );

  if (!product) {
    return (
      <section className="container mx-auto py-64 ">
        <div className="w-full grow flex flex-col items-center justify-center gap-8">
          <h1 className="font-logo uppercase text-8xl text-center">
            Producto no encontrado
          </h1>
          <AppLink to="/home">
            <LeftArrowIcon />
            <span>Volver a la página de inicio</span>
          </AppLink>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-32 ">
      <div className="border-b border-secondary pb-4">
        <h1>{product.name}</h1>
      </div>
    </section>
  );
}
