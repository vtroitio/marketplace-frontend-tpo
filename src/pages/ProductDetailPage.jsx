import { useState } from "react";
import { Button } from "../components/ui";
import { CartIcon, StarIcon } from "../components/icons";
import mainImage from "../assets/product-detail-main.png";
import zoomImage from "../assets/product-detail-zoom.png";
import backImage from "../assets/product-detail-back.png";

const product = {
  name: "Sudadera 'Cyber-Neo' Edición Limitada",
  price: "$145.00",
  description:
    "Diseñada con precisión geométrica y una filosofía de espacio negativo. La sudadera Cyber-Neo fusiona la estética técnica con el minimalismo japonés. Cortada en un tejido estructurado que mantiene su forma arquitectónica, ofreciendo un refugio contra el ruido visual del entorno urbano.",
  colors: [
    { name: "Negro", value: "#1a1a1a" },
    { name: "Gris", value: "#888888" },
    { name: "Blanco", value: "#ffffff" },
  ],
  sizes: ["S", "M", "L", "XL"],
  images: [mainImage, zoomImage, backImage],
  rating: 4.8,
  reviewCount: 12,
  reviews: [
    {
      id: 1,
      author: "Hiroshi T.",
      date: "12 OCT 2023",
      rating: 5,
      comment:
        "La calidad del tejido es excepcional. Mantiene su forma perfectamente y el corte geométrico es muy favorecedor. Un básico elevado.",
    },
    {
      id: 2,
      author: "Elena M.",
      date: "05 OCT 2023",
      rating: 4,
      comment:
        "Minimalismo en su máxima expresión. Me encanta la estructura de los hombros y el acabado mate del color negro.",
    },
  ],
};

export function ProductDetailPage() {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  return (
    <div className="bg-neutral min-h-screen">
      <div className="mx-auto max-w-295 px-8 py-12 md:px-12">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <div className="space-y-4">
            <div className="border border-secondary overflow-hidden aspect-square">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`border-2 overflow-hidden w-24 h-24 flex-shrink-0 ${
                    selectedImage === img ? "border-primary" : "border-secondary"
                  }`}
                >
                  <img src={img} alt={`Vista ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1>{product.name}</h1>
              <div className="mt-2">
                <h3>{product.price}</h3>
              </div>
            </div>

            <hr className="border-secondary/20" />

            <p>{product.description}</p>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="text-sm font-bold uppercase tracking-[1.2px]">Color</div>
                <div className="text-sm text-tertiary">{selectedColor.name}</div>
              </div>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-7 h-7 border-2 transition-all ${
                      selectedColor.value === color.value
                        ? "border-primary scale-110"
                        : "border-secondary"
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold uppercase tracking-[1.2px]">Talla</div>
                <div className="text-sm font-bold uppercase tracking-[1.2px] text-primary underline cursor-pointer">
                  Guía de tallas
                </div>
              </div>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border text-sm font-bold uppercase tracking-[1.2px] transition-all ${
                      selectedSize === size
                        ? "bg-secondary text-neutral border-secondary"
                        : "bg-transparent text-secondary border-secondary hover:border-primary hover:text-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <Button fullWidth>
              <CartIcon size={18} />
              Añadir al carrito
            </Button>
          </div>
        </div>

        <div className="mt-20">
          <hr className="border-secondary/20 mb-10" />

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="mb-1">
                <h3>Reseñas</h3>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    size={16}
                    className={star <= Math.round(product.rating) ? "text-primary" : "text-tertiary"}
                  />
                ))}
                <div className="text-sm text-tertiary ml-1">
                  {product.rating} ({product.reviewCount} reseñas)
                </div>
              </div>
            </div>
            <Button variant="outline">Escribir reseña</Button>
          </div>

          <div className="space-y-8">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b border-secondary/20 pb-8">
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      size={14}
                      className={star <= review.rating ? "text-primary" : "text-tertiary"}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-bold uppercase tracking-[1.2px]">{review.author}</div>
                  <div className="text-sm text-tertiary">{review.date}</div>
                </div>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="text">Ver todas las reseñas</Button>
          </div>
        </div>

      </div>
    </div>
  );
}