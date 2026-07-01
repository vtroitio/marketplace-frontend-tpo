import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCart } from "../cart/CartContext";
import { useToast } from "../toast/ToastContext";
import { Button, Spinner } from "../components/ui";
import { CartIcon, PencilIcon, StarIcon } from "../components/icons";
import { formatCurrency } from "../helpers/formatters";
import { ROLES } from "../helpers/roles";

import {
  fetchProductById,
  selectProduct,
  selectProductLoading,
  selectProductError,
} from "../features/productDetail";

import {
  fetchReviews,
  createProductReview,
  selectReviews,
  selectReviewsLoading,
  selectReviewsCreating,
} from "../features/reviews";

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

function SizeGuideModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="bg-neutral border border-secondary max-w-lg w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-tertiary hover:text-primary text-xl leading-none cursor-pointer"
          aria-label="Cerrar guía de tallas"
        >
          ✕
        </button>

        <h3 className="mb-6">Guía de Tallas</h3>

        <p className="text-sm text-tertiary mb-4">
          Medidas en centímetros. Para una mejor experiencia, medí tu cuerpo y
          compará con la tabla.
        </p>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-secondary/40">
              <th className="text-left py-2 pr-4 font-bold uppercase tracking-[1.2px] text-xs">
                Talla
              </th>
              <th className="text-left py-2 pr-4 font-bold uppercase tracking-[1.2px] text-xs">
                Pecho (cm)
              </th>
              <th className="text-left py-2 pr-4 font-bold uppercase tracking-[1.2px] text-xs">
                Cintura (cm)
              </th>
              <th className="text-left py-2 font-bold uppercase tracking-[1.2px] text-xs">
                Largo (cm)
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              { size: "XS", chest: "84–88", waist: "68–72", length: "65" },
              { size: "S", chest: "88–92", waist: "72–76", length: "67" },
              { size: "M", chest: "92–96", waist: "76–80", length: "69" },
              { size: "L", chest: "96–102", waist: "80–86", length: "71" },
              { size: "XL", chest: "102–108", waist: "86–92", length: "73" },
              { size: "XXL", chest: "108–116", waist: "92–100", length: "75" },
            ].map((row) => (
              <tr key={row.size} className="border-b border-secondary/20">
                <td className="py-2 pr-4 font-bold">{row.size}</td>
                <td className="py-2 pr-4 text-tertiary">{row.chest}</td>
                <td className="py-2 pr-4 text-tertiary">{row.waist}</td>
                <td className="py-2 text-tertiary">{row.length}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-xs text-tertiary mt-6">
          * Las medidas pueden variar ±1 cm según la prenda. En caso de duda,
          recomendamos elegir la talla superior.
        </p>
      </div>
    </div>
  );
}

function ReviewModal({ productId, onClose }) {
  const dispatch = useDispatch();
  const toast = useToast();
  const creating = useSelector(selectReviewsCreating);

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (rating === 0) {
      toast.warning("Por favor seleccioná una puntuación.");
      return;
    }

    try {
      await dispatch(
        createProductReview({
          productId,
          reviewData: { rating, title, description },
        }),
      ).unwrap();

      toast.success("¡Reseña publicada correctamente!", {
        title: "Reseña enviada",
      });
      onClose();
    } catch (error) {
      toast.error(error || "No se pudo publicar la reseña.", {
        title: "Error",
      });
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="bg-neutral border border-secondary max-w-lg w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-tertiary hover:text-primary text-xl leading-none cursor-pointer"
          aria-label="Cerrar"
        >
          ✕
        </button>

        <h3 className="mb-6">Escribir reseña</h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-[1.2px]">
              Puntuación (1–10)
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-lg leading-none transition-colors ${
                    star <= (hoveredRating || rating)
                      ? "text-primary"
                      : "text-secondary"
                  }`}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  aria-label={`${star} puntos`}
                >
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-xs text-tertiary">{rating} / 10</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-[1.2px] block">
              Título
            </label>
            <input
              type="text"
              required
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resumen de tu experiencia"
              className="w-full border border-secondary bg-transparent px-4 py-3 text-sm text-secondary placeholder:text-tertiary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-[1.2px] block">
              Comentario
            </label>
            <textarea
              required
              maxLength={500}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contanos tu experiencia con el producto..."
              className="w-full border border-secondary bg-transparent px-4 py-3 text-sm text-secondary placeholder:text-tertiary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          <Button type="submit" fullWidth disabled={creating}>
            {creating ? "Publicando..." : "Publicar reseña"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export function ProductDetailPage() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { addItem } = useCart();
  const toast = useToast();

  const product = useSelector(selectProduct);
  const productLoading = useSelector(selectProductLoading);
  const productError = useSelector(selectProductError);

  const reviews = useSelector(selectReviews);
  const reviewsLoading = useSelector(selectReviewsLoading);

  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [selectedColorId, setSelectedColorId] = useState(null);
  const [selectedSizeId, setSelectedSizeId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const isOwner = useMemo(
    () => Boolean(product) && product.owner?.id === user?.id,
    [product, user],
  );

  const canReview =
    isAuthenticated && user?.role?.code === ROLES.BUYER && !isOwner;

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    dispatch(fetchReviews(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (!product) return;

    const firstVariant = product.variants?.[0] ?? null;
    const firstColor = firstVariant ? getColor(firstVariant) : null;
    const firstSize = firstVariant ? getSize(firstVariant) : null;
    const firstImage =
      product.coverImagePath ?? firstVariant?.images?.[0]?.path ?? null;

    setSelectedColorId(firstColor?.id ?? null);
    setSelectedSizeId(firstSize?.id ?? null);
    setSelectedImage(firstImage);
  }, [product]);

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

  const selectedSize = useMemo(() => {
    return availableSizes.find((size) => size.id === selectedSizeId) ?? null;
  }, [availableSizes, selectedSizeId]);

  const selectedColor = useMemo(() => {
    return colors.find((color) => color.id === selectedColorId) ?? null;
  }, [colors, selectedColorId]);

  const selectedColorImages = useMemo(() => {
    const images = getImagesByColor(product?.variants ?? [], selectedColorId);
    const cover = product?.coverImagePath;
    if (!cover) return images;
    return [
      ...images.filter((img) => img.path === cover),
      ...images.filter((img) => img.path !== cover),
    ];
  }, [product, selectedColorId]);

  const imagesToShow = selectedColorImages;

  const rating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  const displayedImage = useMemo(() => {
    return selectedColorImages?.[0]?.path ?? product?.coverImagePath;
  }, [selectedColorImages, product]);

  function handleColorSelect(colorId) {
    setSelectedColorId(colorId);
    const sizesForColor = getSizesByColor(product?.variants ?? [], colorId);
    const firstSize = sizesForColor[0] ?? null;
    setSelectedSizeId(firstSize?.id ?? null);
    setSelectedImage(null);
  }

  const handleAddToCart = async () => {
    const result = await addItem({
      id: selectedVariant.id,
      productId: product.id,
      name: product.name,
      size: selectedSize,
      color: selectedColor,
      price: selectedVariant.price,
      quantity: 1,
      maxStock: selectedVariant.stock,
      image: product.coverImagePath,
    });

    if (!result.ok) {
      if (result.status === "STOCK_LIMIT") {
        toast.error(result.message, {
          title: "Limite de stock alcanzado",
          duration: 3500,
        });
      }
      return;
    }

    toast.success(result.message, {
      title: "¡Éxito!",
      duration: 3500,
    });
  };

  const productMatches =
    Boolean(product) && String(product.id) === String(productId);

  if (productError && !productMatches) {
    return (
      <div className="bg-neutral min-h-screen flex items-center justify-center">
        <span className="text-primary">Error: {productError}</span>
      </div>
    );
  }

  if (!productMatches || productLoading) {
    return (
      <div className="bg-neutral min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-neutral min-h-screen">
      {showSizeGuide && (
        <SizeGuideModal onClose={() => setShowSizeGuide(false)} />
      )}
      {showReviewModal && (
        <ReviewModal
          productId={productId}
          onClose={() => setShowReviewModal(false)}
        />
      )}

      <div className="mx-auto max-w-295 px-8 py-12 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-4">
            <div className="border border-secondary overflow-hidden aspect-square relative group">
              <img
                src={selectedImage ?? displayedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {imagesToShow.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      const current = selectedImage ?? displayedImage;
                      const idx = imagesToShow.findIndex(
                        (img) => img.path === current,
                      );
                      const prev =
                        imagesToShow[
                          (idx - 1 + imagesToShow.length) % imagesToShow.length
                        ];
                      setSelectedImage(prev.path);
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white border border-secondary w-9 h-9 flex items-center justify-center transition-opacity cursor-pointer"
                    aria-label="Imagen anterior"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const current = selectedImage ?? displayedImage;
                      const idx = imagesToShow.findIndex(
                        (img) => img.path === current,
                      );
                      const next =
                        imagesToShow[(idx + 1) % imagesToShow.length];
                      setSelectedImage(next.path);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white border border-secondary w-9 h-9 flex items-center justify-center transition-opacity cursor-pointer"
                    aria-label="Imagen siguiente"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            <div className="flex gap-4 overflow-x-auto">
              {imagesToShow.map((image, index) => (
                <button
                  key={image.id ?? index}
                  type="button"
                  onClick={() => setSelectedImage(image.path)}
                  className={`border-2 overflow-hidden w-24 h-24 flex-shrink-0 ${
                    (selectedImage ?? displayedImage) === image.path
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
                <h3>
                  {formatCurrency(selectedVariant?.price ?? product.price)}
                </h3>
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

                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="text-sm font-bold uppercase tracking-[1.2px] text-primary underline cursor-pointer hover:opacity-70 transition-opacity"
                >
                  Guía de tallas
                </button>
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

            {!isOwner ? (
              <Button
                fullWidth
                disabled={!selectedVariant || selectedVariant.stock <= 0}
                onClick={handleAddToCart}
              >
                <CartIcon size={18} />
                {selectedVariant?.stock > 0 ? "Añadir al carrito" : "Sin stock"}
              </Button>
            ) : (
              <Button
                to={`/sell/edit/${product.id}`}
                fullWidth
                variant="outline"
              >
                <PencilIcon size={18} />
                Editar producto
              </Button>
            )}
          </div>
        </div>

        <div className="mt-20">
          <hr className="border-secondary/20 mb-10" />

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="mb-1">
                <h3>Reseñas</h3>
              </div>

              {reviews.length > 0 && (
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      size={16}
                      className={
                        star <= Math.round(rating / 2)
                          ? "text-primary"
                          : "text-tertiary"
                      }
                    />
                  ))}
                  <div className="text-sm text-tertiary ml-1">
                    {rating}/10 ({reviews.length} reseña
                    {reviews.length !== 1 ? "s" : ""})
                  </div>
                </div>
              )}
            </div>

            {canReview ? (
              <Button
                variant="outline"
                onClick={() => setShowReviewModal(true)}
              >
                Escribir reseña
              </Button>
            ) : isAuthenticated && !canReview ? (
              <span className="text-xs text-tertiary uppercase tracking-[1.2px]">
                Solo compradores pueden reseñar
              </span>
            ) : (
              <Button variant="outline" to="/login">
                Iniciar sesión para reseñar
              </Button>
            )}
          </div>

          {reviewsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : reviews.length > 0 ? (
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
                          star <= Math.round(review.rating / 2)
                            ? "text-primary"
                            : "text-tertiary"
                        }
                      />
                    ))}
                    <span className="text-xs text-tertiary ml-1">
                      {review.rating}/10
                    </span>
                  </div>

                  <div className="text-sm font-bold uppercase tracking-[1.2px] mb-2">
                    {review.title}
                  </div>

                  <p className="text-sm text-tertiary">{review.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-tertiary">
              Este producto todavía no tiene reseñas.{" "}
              {canReview && (
                <button
                  type="button"
                  onClick={() => setShowReviewModal(true)}
                  className="text-primary underline cursor-pointer hover:opacity-70"
                >
                  ¡Sé el primero en opinar!
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
