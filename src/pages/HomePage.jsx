import { Card, AppLink, Button } from "../components/ui";
import { RightArrowIcon, CompassIcon } from "../components/icons";
import heroImage from "../assets/home-hero.png";
import hoodieImage from "../assets/product-hoodie.png";
import tshirtImage from "../assets/product-tshirt.png";

const featuredProducts = [
  {
    title: 'Hoodie Type-01 "Ghost"',
    price: "$120.00",
    image: hoodieImage,
  },
  {
    title: "T-Shirt Unit-02",
    price: "$45.00",
    image: tshirtImage,
  },
  {
    title: "T-Shirt Unit-02",
    price: "$45.00",
    image: tshirtImage,
  },
];

export function HomePage() {
  return (
    <div className="bg-neutral">
      <section
        className="h-230 relative flex items-center justify-center overflow-hidden border-b border-secondary bg-neutral px-6 py-16 text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(250,250,250,0.12), rgba(250,250,250,0.12)), url(${heroImage}), url(${heroImage})`,
          backgroundPosition: "center top, center top, center center",
          backgroundRepeat: "no-repeat, no-repeat, no-repeat",
          backgroundSize: "auto 108%, auto 108%, cover",
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

        <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)] md:items-stretch">
          <Card
            className="md:h-full md:max-w-none"
            image={featuredProducts[0].image}
            title={featuredProducts[0].title}
            price={featuredProducts[0].price}
          />

          <div className="grid gap-6 md:h-full md:grid-rows-2">
            {featuredProducts.slice(1).map((product, index) => (
              <Card
                key={`${product.title}-${index}`}
                variant="small"
                className="md:h-full md:max-w-none"
                image={product.image}
                title={product.title}
                price={product.price}
              />
            ))}
          </div>
        </div>
      </section>

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
    </div>
  );
}
