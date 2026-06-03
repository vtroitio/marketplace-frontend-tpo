import {
  DiamondIcon,
  MinimalismIcon,
  PerformanceIcon,
} from "../components/icons";
import hoodieImage from "../assets/product-hoodie.png";
import tshirtImage from "../assets/product-tshirt.png";

export function AboutPage() {
  return (
    <div className="container mx-auto py-32">
      <div className="border-b border-secondary pb-16">
        <h1>¿Qué es SKINDEX?</h1>
      </div>
      <div className="flex border-b border-secondary pt-8 pb-32">
        <div className="w-1/2 flex flex-col items-start justify-center">
          <h3 className="mb-6">El Concepto</h3>
          <p>
            <b>SKINDEX</b> es el marketplace definitivo para la cultura geek. Un
            espacio especializado donde la pasión por{" "}
            <b>los videojuegos, anime, cine y series</b> se encuentra con un
            comercio curado. Conectamos a vendedores especializados con una
            audiencia de nicho que valora la exclusividad y la calidad en cada
            articulo digital y fisico.
          </p>
        </div>
        <div className="w-1/2 flex items-center justify-center">
          <img src={hoodieImage} alt="SKINDEX" className="h-100" />
        </div>
      </div>
      <div className="flex border-b border-secondary pt-8 pb-32">
        <div className="w-1/2 flex items-center justify-center">
          <img src={tshirtImage} alt="SKINDEX" className="h-100" />
        </div>
        <div className="w-1/2 flex flex-col items-start justify-center">
          <h3 className="mb-6">LA EXPERIENCIA DE USUARIO</h3>
          <p>
            Nuestra plataforma está diseñada para facilitar la compra y venta de
            coleccionables y activos de cultura pop, garantizando una
            experiencia técnica superior para nuestra comunidad.
          </p>
        </div>
      </div>
      <div className="pt-32">
        <h3 className="mb-16 text-center">PILARES</h3>
        <div className="flex justify-center gap-4">
          <div className="w-1/3 flex flex-col items-center justify-start gap-4 border border-secondary p-16">
            <DiamondIcon size={40} className="text-primary" />
            <p>
              <b>EDICIONES ESPECIALES</b>
            </p>
            <p className="text-center">
              Enfoque en la escasez y el valor del diseño digital
            </p>
          </div>
          <div className="w-1/3 flex flex-col items-center justify-start gap-4 border border-secondary p-16">
            <PerformanceIcon size={40} className="text-primary" />
            <p>
              <b>RENDIMIENTO EXTREMO</b>
            </p>
            <p className="text-center">
              Arquitectura frontend optimizada para cargas ultra-veloces,
              reflejando la eficiencia del código limpio.
            </p>
          </div>
          <div className="w-1/3 flex flex-col items-center justify-start gap-4 border border-secondary p-16">
            <MinimalismIcon size={40} className="text-primary" />
            <p>
              <b>MINIMALISMO FUNCIONAL</b>
            </p>
            <p className="text-center">
              Cada elemento en pantalla tiene una razón de ser. Si no aporta
              precisión, es eliminado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
