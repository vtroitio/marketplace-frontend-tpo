import { Card } from "../components/ui";
import { RightArrowIcon } from "../components/icons";
import heroImage from "../assets/home-hero.png";
import hoodieImage from "../assets/product-hoodie.png";
import tshirtImage from "../assets/product-tshirt.png";
import compassIcon from "../assets/compass-icon.png";

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
        className="relative flex min-h-[590px] items-center justify-center overflow-hidden border-b border-secondary bg-neutral px-6 py-16 text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(250,250,250,0.12), rgba(250,250,250,0.12)), url(${heroImage}), url(${heroImage})`,
          backgroundPosition: "center top, center top, center center",
          backgroundRepeat: "no-repeat, no-repeat, no-repeat",
          backgroundSize: "auto 108%, auto 108%, cover",
        }}
      >
        <div className="relative z-10 flex w-full max-w-[560px] flex-col items-center">
          <h1 className="border border-secondary bg-neutral/90 px-6 py-2 text-[2.5rem] font-black leading-[0.98] tracking-normal text-secondary sm:px-8 sm:text-[3.25rem] md:text-[4.25rem]">
            Moda Geek Elevada. Estética Minimalista.
          </h1>

          <p className="mt-4 w-full max-w-[460px] border border-secondary bg-neutral/90 px-8 py-3 text-xs font-normal leading-5 text-tertiary">
            Redefinimos la cultura a través de líneas precisas y espacio
            negativo. Vestimenta premium para la nueva era digital.
          </p>

          <a
            href="/explore"
            className="mt-8 inline-flex items-center justify-center bg-primary px-8 py-5 text-xs font-bold uppercase leading-none tracking-[1.2px] text-neutral hover:bg-neutral hover:text-primary"
          >
            Explorar colección
          </a>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1180px] px-8 py-20 md:px-12">
        <div className="mb-12 flex items-end justify-between gap-6 border-b border-secondary pb-4">
          <h2 className="text-4xl font-black leading-none tracking-normal text-secondary">
            Destacados
          </h2>

          <a
            href="/explore"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase leading-none tracking-[1.2px] text-tertiary hover:text-primary"
          >
            Ver todos
            <RightArrowIcon size={13} />
          </a>
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

      <section className="flex min-h-[430px] items-center justify-center bg-secondary px-6 py-20 text-center text-neutral">
        <div className="flex max-w-[430px] flex-col items-center">
          <img
            src={compassIcon}
            alt=""
            aria-hidden="true"
            className="mb-6 h-8 w-8 object-contain"
          />

          <h2 className="text-[2.5rem] font-black normal-case leading-[0.98] tracking-normal text-neutral md:text-[4rem]">
            Crea tu legado. Únete como vendedor.
          </h2>

          <p className="mt-6 text-sm font-normal leading-6 text-neutral">
            Buscamos diseñadores que entiendan el poder del minimalismo.
            Convierte tus visiones en vestimenta premium para una audiencia
            global.
          </p>

          <a
            href="/sell"
            className="mt-10 inline-flex items-center justify-center bg-primary px-8 py-5 text-xs font-bold uppercase leading-none tracking-[1.2px] text-neutral hover:bg-neutral hover:text-primary"
          >
            Aplicar ahora
          </a>
        </div>
      </section>
    </div>
  );
}
