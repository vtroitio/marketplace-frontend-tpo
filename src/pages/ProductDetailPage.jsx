import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Button, Spinner } from "../components/ui";
import { CartIcon, StarIcon } from "../components/icons";
import { getProductById } from "../api/products";
import { formatCurrency } from "../helpers/formatters";

const ATTRIBUTES = {
  COLOR: "COLOR",
  SIZE: "TALLE",
};

function getVariantAttributeValue(variant, attributeCode) {
  return (
    variant.attributeValues?.find(
      (attributeValue) => attributeValue.attributeCode === attributeCode,
    ) ?? null
  );
}

function getColor(variant) {
  return getVariantAttributeValue(variant, ATTRIBUTES.COLOR);
}

function getSize(variant) {
  return getVariantAttributeValue(variant, ATTRIBUTES.SIZE);
}

function getUniqueColors(variants = []) {
  const colorsMap = new Map();

  variants.forEach((variant) => {
    const color = getColor(variant);

    if (color && !colorsMap.has(color.id)) {
      colorsMap.set(color.id, color);
    }
  });

  return Array.from(colorsMap.values());
}

function getSizesByColor(variants = [], selectedColorId) {
  if (!selectedColorId) return [];

  const sizesMap = new Map();

  variants.forEach((variant) => {
    const color = getColor(variant);
    const size = getSize(variant);

    if (color?.id === selectedColorId && size && !sizesMap.has(size.id)) {
      sizesMap.set(size.id, size);
    }
  });

  return Array.from(sizesMap.values());
}

function findVariantByColorAndSize(
  variants = [],
  selectedColorId,
  selectedSizeId,
) {
  if (!selectedColorId || !selectedSizeId) return null;

  return (
    variants.find((variant) => {
      const color = getColor(variant);
      const size = getSize(variant);

      return color?.id === selectedColorId && size?.id === selectedSizeId;
    }) ?? null
  );
}

function getImagesByColor(variants = [], selectedColorId) {
  if (!selectedColorId) return [];

  const imagesMap = new Map();

  variants.forEach((variant) => {
    const color = getColor(variant);

    if (color?.id !== selectedColorId) return;

    variant.images?.forEach((image) => {
      if (!imagesMap.has(image.id)) {
        imagesMap.set(image.id, image);
      }
    });
  });

  return Array.from(imagesMap.values()).sort((a, b) => a.position - b.position);
}

export function ProductDetailPage() {
  const { productId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);

  const [selectedColorId, setSelectedColorId] = useState(null);
  const [selectedSizeId, setSelectedSizeId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getProductById(productId);
        setProduct(data);

        const firstVariant = data.variants?.[0] ?? null;
        const firstColor = firstVariant ? getColor(firstVariant) : null;
        const firstSize = firstVariant ? getSize(firstVariant) : null;
        const firstImage =
          firstVariant?.images?.[0]?.path ?? data.coverImagePath ?? null;

        setSelectedColorId(firstColor?.id ?? null);
        setSelectedSizeId(firstSize?.id ?? null);
        setSelectedImage(firstImage);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const colors = useMemo(() => {
    return getUniqueColors(product?.variants ?? []);
  }, [product]);

  const availableSizes = useMemo(() => {
    return getSizesByColor(product?.variants ?? [], selectedColorId);
  }, [product, selectedColorId]);

  const selectedVariant = useMemo(() => {
    return findVariantByColorAndSize(
      product?.variants ?? [],
      selectedColorId,
      selectedSizeId,
    );
  }, [product, selectedColorId, selectedSizeId]);

  const selectedColor = useMemo(() => {
    return colors.find((color) => color.id === selectedColorId) ?? null;
  }, [colors, selectedColorId]);

  const selectedColorImages = useMemo(() => {
    return getImagesByColor(product?.variants ?? [], selectedColorId);
  }, [product, selectedColorId]);

  const imagesToShow = selectedVariant?.images?.length
    ? selectedVariant.images
    : selectedColorImages;

  const reviews = product?.reviews ?? [];
  const rating = product?.rating ?? 0;
  const reviewCount = product?.reviewCount ?? reviews.length;

  useEffect(() => {
    if (selectedVariant?.images?.[0]?.path) {
      setSelectedImage(selectedVariant.images[0].path);
      return;
    }

    if (selectedColorImages?.[0]?.path) {
      setSelectedImage(selectedColorImages[0].path);
      return;
    }

    if (product?.coverImagePath) {
      setSelectedImage(product.coverImagePath);
    }
  }, [selectedVariant, selectedColorImages, product]);

  function handleColorSelect(colorId) {
    setSelectedColorId(colorId);

    const sizesForColor = getSizesByColor(product?.variants ?? [], colorId);
    const firstSize = sizesForColor[0] ?? null;

    setSelectedSizeId(firstSize?.id ?? null);
  }

  function handleAddToCart() {
    if (!selectedVariant) return;

    console.log("Agregar al carrito:", {
      productId: product.id,
      variantId: selectedVariant.id,
      sku: selectedVariant.sku,
      quantity: 1,
    });
  }

  if (loading) {
    return (
      <div className="bg-neutral min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-neutral min-h-screen flex items-center justify-center">
        <span className="text-primary">Error: {error.message}</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-neutral min-h-screen flex items-center justify-center">
        <span className="text-primary">No se encontró el producto.</span>
      </div>
    );
  }

  return (
    <div className="bg-neutral min-h-screen">
      <div className="mx-auto max-w-295 px-8 py-12 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-4">
            <div className="border border-secondary overflow-hidden aspect-square">
              <img
                src={selectedImage ?? product.coverImagePath}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex gap-4 overflow-x-auto">
              {imagesToShow.map((image, index) => (
                <button
                  key={image.id ?? index}
                  type="button"
                  onClick={() => setSelectedImage(image.path)}
                  className={`border-2 overflow-hidden w-24 h-24 flex-shrink-0 ${
                    selectedImage === image.path
                      ? "border-primary"
                      : "border-secondary"
                  }`}
                >
                  <img
                    src={image.path}
                    alt={`Vista ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1>{product.name}</h1>

              <div className="mt-2">
                <h3>{formatCurrency(selectedVariant?.price ?? product.price)}</h3>
              </div>

              <div className="mt-2 text-sm text-tertiary">
                Stock disponible: {selectedVariant?.stock ?? 0}
              </div>
            </div>

            <hr className="border-secondary/20" />

            <p>{product.description}</p>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="text-sm font-bold uppercase tracking-[1.2px]">
                  Color
                </div>

                <div className="text-sm text-tertiary">
                  {selectedColor?.value ?? "Seleccionar"}
                </div>
              </div>

              <div className="flex gap-3">
                {colors.map((color) => {
                  const isSelected = selectedColorId === color.id;

                  return (
                    <button
                      key={color.id}
                      type="button"
                      title={color.value}
                      onClick={() => handleColorSelect(color.id)}
                      className={`w-7 h-7 border-2 transition-all ${
                        isSelected
                          ? "border-primary scale-110"
                          : "border-secondary"
                      }`}
                      style={{ backgroundColor: color.hexColor }}
                    />
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold uppercase tracking-[1.2px]">
                  Talla
                </div>

                <div className="text-sm font-bold uppercase tracking-[1.2px] text-primary underline cursor-pointer">
                  Guía de tallas
                </div>
              </div>

              <div className="flex gap-3">
                {availableSizes.map((size) => {
                  const isSelected = selectedSizeId === size.id;

                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSizeId(size.id)}
                      className={`w-12 h-12 border text-sm font-bold uppercase tracking-[1.2px] transition-all ${
                        isSelected
                          ? "bg-secondary text-neutral border-secondary"
                          : "bg-transparent text-secondary border-secondary hover:border-primary hover:text-primary"
                      }`}
                    >
                      {size.value}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              fullWidth
              disabled={!selectedVariant || selectedVariant.stock <= 0}
              onClick={handleAddToCart}
            >
              <CartIcon size={18} />
              {selectedVariant?.stock > 0 ? "Añadir al carrito" : "Sin stock"}
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
                    className={
                      star <= Math.round(rating)
                        ? "text-primary"
                        : "text-tertiary"
                    }
                  />
                ))}

                <div className="text-sm text-tertiary ml-1">
                  {rating} ({reviewCount} reseñas)
                </div>
              </div>
            </div>

            <Button variant="outline">Escribir reseña</Button>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-8">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-secondary/20 pb-8"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        size={14}
                        className={
                          star <= review.rating
                            ? "text-primary"
                            : "text-tertiary"
                        }
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-bold uppercase tracking-[1.2px]">
                      {review.author}
                    </div>

                    <div className="text-sm text-tertiary">{review.date}</div>
                  </div>

                  <p>{review.comment}</p>
                </div>
              ))}

              <div className="mt-8 text-center">
                <Button variant="text">Ver todas las reseñas</Button>
              </div>
            </div>
          ) : (
            <div className="text-tertiary">
              Este producto todavía no tiene reseñas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}