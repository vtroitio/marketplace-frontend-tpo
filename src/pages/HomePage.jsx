import { useEffect } from "react";
import { Card, AppLink, Button, Spinner } from "../components/ui";
import { RightArrowIcon, CompassIcon } from "../components/icons";
import TitanImage from "../assets/home-titan.png";
// import hoodieImage from "../assets/product-hoodie.png";
// import tshirtImage from "../assets/product-tshirt.png";
import { useDispatch, useSelector } from "react-redux";
import { hasRole, ROLES } from "../helpers/roles";
import { selectUserRoleCode } from "../features/auth";
import { fetchExploreProducts } from "../features/products";

// const featuredProducts = [
//   {
//     id: 1,
//     title: 'Hoodie Type-01 "Ghost"',
//     price: 120,
//     image: hoodieImage,
//   },
//   {
//     id: 2,
//     title: "T-Shirt Unit-02",
//     price: 45,
//     image: tshirtImage,
//   },
//   {
//     id: 3,
//     title: "T-Shirt Unit-02",
//     price: 45,
//     image: tshirtImage,
//   },
// ];

function BecomeSellerSection() {
  return (
    <section className="flex items-center justify-center bg-secondary px-6 py-20 text-center text-neutral">
      <div className="mx-auto w-full max-w-4xl flex flex-col gap-4 items-center">
        <CompassIcon size={44} className="text-primary" />

        <h1>Crea tu legado. Únete como vendedor.</h1>

        <div className="flex flex-col gap-17 max-w-xl">
          <p>
            Buscamos diseñadores que entiendan el poder del minimalismo.
            Convierte tus visiones en vestimenta premium para una audiencia
            global.
          </p>

          <Button to="/sell">Aplicar ahora</Button>
        </div>
      </div>
    </section>
  );
}

function SellerDashboardSection() {
  return (
    <section className="flex items-center justify-center bg-secondary px-6 py-20 text-center text-neutral">
      <div className="mx-auto w-full max-w-4xl flex flex-col gap-4 items-center">
        <CompassIcon size={44} className="text-primary" />

        <h1>Tu tienda, tu legado.</h1>

        <div className="flex flex-col gap-8 max-w-xl">
          <p>
            Administrá tus productos, gestioná tu inventario y seguí el
            crecimiento de tu marca dentro de Skindex.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button to="/sell">Ir a mi panel</Button>
            <Button variant="inverted" to="/sell/new">
              Publicar producto
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRole = useSelector(selectUserRoleCode);
  const isSeller = isAuthenticated && hasRole(ROLES.SELLER, userRole);
  const featuredProducts = useSelector(
    (state) => state.products.featured.items,
  );
  const productsLoading = useSelector((state) => state.products.loading);

  const mainFeaturedProduct = featuredProducts[0];
  const secondaryFeaturedProducts = featuredProducts.slice(1, 3);

  useEffect(() => {
    dispatch(fetchExploreProducts());
  }, [dispatch]);

  return (
    <div className="bg-neutral">
      <section
        className="h-230 relative flex items-center justify-center overflow-hidden border-secondary bg-neutral px-6 py-16 text-center"
        style={{
          /* Aplicamos el gris hexadecimal seleccionado */
          backgroundColor: "#5f5e5e",
          backgroundImage: `linear-gradient(rgba(250,250,250,0.12), rgba(250,250,250,0.12)), url(${TitanImage})`,
          backgroundPosition: "center center, center bottom",
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundSize: "cover, auto 100%",
        }}
      >
        <div className="mx-auto w-full max-w-4xl">
          <div className="relative z-10 flex w-full flex-col items-center">
            <div className="border border-secondary bg-neutral/90 px-16 py-2">
              <h1>Moda Geek Elevada. Estética Minimalista.</h1>
            </div>

            <div className="max-w-2xl mt-4 mb-12 border border-secondary bg-neutral/90 px-8 py-3">
              <p>
                Redefinimos la cultura a través de líneas precisas y espacio
                negativo. Vestimenta premium para la nueva era digital.
              </p>
            </div>

            <Button to="/explore">Explorar colección</Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-295 px-8 py-20 md:px-12">
        <div className="mb-12 flex items-end justify-between gap-6 border-b border-secondary pb-4">
          <h2>Destacados</h2>

          <AppLink to="/explore">
            Ver todos
            <RightArrowIcon />
          </AppLink>
        </div>

        {productsLoading && featuredProducts.length === 0 ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)] md:items-stretch">
            {mainFeaturedProduct && (
              <Card
                className="md:h-full md:max-w-none"
                image={mainFeaturedProduct.coverImagePath}
                title={mainFeaturedProduct.name}
                price={mainFeaturedProduct.price}
                to={`/explore/${mainFeaturedProduct.id}`}
              />
            )}

            <div className="grid gap-6 md:h-full md:grid-rows-2">
              {secondaryFeaturedProducts.map((product) => (
                <Card
                  key={product.id}
                  variant="small"
                  className="md:h-full md:max-w-none"
                  image={product.coverImagePath}
                  title={product.name}
                  price={product.price}
                  to={`/explore/${product.id}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="py-20 text-center text-tertiary">
            No hay productos destacados disponibles.
          </div>
        )}
      </section>

      {isSeller ? <SellerDashboardSection /> : <BecomeSellerSection />}
    </div>
  );
}
