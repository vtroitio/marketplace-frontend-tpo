import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, AppLink } from "../components/ui";
import { LeftArrowIcon } from "../components/icons";
import {
  ImageGallery,
  ColorSelector,
  SizeSelector,
  StarRating,
  ReviewCard,
} from "../components/products";
import { formatPrice, getRatingAverage } from "../helpers/formatters";
import { MOCK_PRODUCTS } from "../helpers/mockData";

export function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const product = MOCK_PRODUCTS.find((p) => p.id === Number(productId));

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  if (!product) {
    return (
      <div className="mx-auto max-w-295 px-4 sm:px-8 md:px-16 py-24 text-center">
        <p className="text-tertiary text-lg mb-6">Producto no encontrado</p>
        <Button variant="outline" onClick={() => navigate("/explore")}>
          <LeftArrowIcon />
          Volver a explorar
        </Button>
      </div>
    );
  }

  const avgRating = getRatingAverage(product.reviews);

  return (
    <div className="bg-neutral">
      <div className="mx-auto max-w-295 px-4 sm:px-8 md:px-16 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <AppLink to="/explore">
            <LeftArrowIcon />
            Explorar
          </AppLink>
        </div>

        {/* Contenido principal */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <ImageGallery images={product.images} productName={product.name} />

          <div>
            <h2 className="normal-case tracking-normal leading-tight mb-2">
              {product.name}
            </h2>
            <p className="text-2xl font-bold text-secondary mb-4">
              {formatPrice(product.price)}
            </p>

            <div className="border-t border-secondary pt-4 mb-6">
              <p className="text-sm text-tertiary leading-6">
                {product.description}
              </p>
            </div>

            <ColorSelector
              colors={product.colors}
              selectedColor={selectedColor}
              onSelect={setSelectedColor}
            />

            <SizeSelector
              sizes={product.sizes}
              selectedSize={selectedSize}
              onSelect={setSelectedSize}
            />

            <Button>Añadir al carrito</Button>
          </div>
        </div>

        {/* Reseñas */}
        <div className="border-t border-secondary pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[1.2px] text-secondary mb-1">
                Reseñas
              </p>
              {product.reviews.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-secondary">
                    {avgRating.toFixed(1)}
                  </span>
                  <div>
                    <StarRating rating={avgRating} size={16} />
                    <span className="text-xs text-tertiary">
                      ({product.reviews.length} reseñas)
                    </span>
                  </div>
                </div>
              )}
            </div>
            <Button variant="outline">Escribir reseña</Button>
          </div>

          {product.reviews.length === 0 ? (
            <p className="text-tertiary text-sm py-8 text-center">
              Este producto aún no tiene reseñas.
            </p>
          ) : (
            <div className="space-y-6 max-w-2xl">
              {product.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
