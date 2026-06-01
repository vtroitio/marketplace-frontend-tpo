import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, AppLink } from "../components/ui";
import { LeftArrowIcon } from "../components/icons";

const API_BASE = "http://localhost:8080";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

function getRatingAverage(reviews) {
  if (!reviews?.length) return 0;
  return reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
}

// ── Sub-componentes ───────────────────────────────────────────────────────────

function StarRating({ rating, max = 5, size = 14 }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill="none">
          <path
            d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.44.91-5.32-3.87-3.77 5.34-.78L10 1z"
            fill={i < Math.round(rating) ? "#e60012" : "none"}
            stroke="#e60012"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

function ColorSwatch({ color, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      title={color.value}
      className={`w-7 h-7 border-2 transition-all ${
        selected ? "border-secondary scale-110" : "border-transparent hover:border-tertiary"
      }`}
      style={{ backgroundColor: color.hexColor || "#ccc" }}
      aria-label={color.value}
      aria-pressed={selected}
    />
  );
}

function SizeButton({ label, selected, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 text-xs font-bold uppercase tracking-[1.2px] border transition-all
        ${disabled ? "opacity-30 cursor-not-allowed border-secondary/30 text-secondary/30" : ""}
        ${
          selected && !disabled
            ? "bg-secondary text-neutral border-secondary"
            : !disabled
            ? "bg-transparent text-secondary border-secondary hover:border-primary hover:text-primary"
            : ""
        }
      `}
    >
      {label}
    </button>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="border-b border-secondary pb-6 last:border-0">
      <div className="flex items-center justify-between mb-1">
        <StarRating rating={review.rating} />
        {review.createdAt && (
          <span className="text-xs text-tertiary">
            {new Date(review.createdAt).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
      </div>
      {review.title && (
        <p className="text-sm font-bold text-secondary mt-1">{review.title}</p>
      )}
      {review.description && (
        <p className="text-sm text-tertiary mt-1 leading-5">{review.description}</p>
      )}
    </div>
  );
}

function ImageGallery({ images, productName }) {
  const [active, setActive] = useState(0);

  const list = images?.length
    ? images
    : [{ url: null }];

  return (
    <div className="flex flex-col gap-3">
      {/* Imagen principal */}
      <div className="border border-secondary aspect-square overflow-hidden bg-secondary/5">
        {list[active]?.url ? (
          <img
            src={list[active].url}
            alt={productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-tertiary text-sm">
            Sin imagen
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`shrink-0 w-20 h-20 border overflow-hidden transition-all ${
                active === i ? "border-secondary" : "border-secondary/30 opacity-60 hover:opacity-100"
              }`}
            >
              {img.url ? (
                <img
                  src={img.url}
                  alt={`${productName} ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-secondary/5" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────

export function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selección de variante
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Carrito
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState(null);

  // ── Carga de datos ────────────────────────────────────────────────────────

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const [productRes, reviewsRes] = await Promise.all([
          fetch(`${API_BASE}/products/${productId}`),
          fetch(`${API_BASE}/products/${productId}/reviews`),
        ]);

        if (!productRes.ok) {
          throw new Error(
            productRes.status === 404
              ? "Producto no encontrado"
              : "Error al cargar el producto"
          );
        }

        const productData = await productRes.json();
        const reviewsData = reviewsRes.ok ? await reviewsRes.json() : [];

        setProduct(productData);
        setReviews(reviewsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  // ── Derivar opciones de atributos ─────────────────────────────────────────

  const colorOptions = (() => {
    const seen = new Map();
    for (const v of product?.variants ?? []) {
      for (const av of v.attributeValues ?? []) {
        if (av.attributeCode === "color" && !seen.has(av.id)) {
          seen.set(av.id, av);
        }
      }
    }
    return [...seen.values()];
  })();

  const sizeOptions = (() => {
    const seen = new Map();
    for (const v of product?.variants ?? []) {
      for (const av of v.attributeValues ?? []) {
        if (av.attributeCode === "size" && !seen.has(av.id)) {
          seen.set(av.id, av);
        }
      }
    }
    return [...seen.values()];
  })();

  // Variante seleccionada según color + talle
  const selectedVariant = product?.variants?.find((v) => {
    const avIds = v.attributeValues.map((a) => a.id);
    const colorMatch = !selectedColor || avIds.includes(selectedColor.id);
    const sizeMatch = !selectedSize || avIds.includes(selectedSize.id);
    return colorMatch && sizeMatch;
  });

  // ¿Tiene stock la combinación elegida?
  const hasStock = selectedVariant ? selectedVariant.stock > 0 : true;

  // ── Añadir al carrito ─────────────────────────────────────────────────────

  async function handleAddToCart() {
    if (!selectedVariant) {
      setCartMessage({ type: "error", text: "Seleccioná una variante válida" });
      return;
    }
    setAddingToCart(true);
    setCartMessage(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          productVariantId: selectedVariant.id,
          quantity: 1,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        setCartMessage({
          type: "error",
          text: "Debés iniciar sesión para agregar al carrito",
        });
        return;
      }

      if (!res.ok) throw new Error("Error al agregar al carrito");

      setCartMessage({ type: "success", text: "¡Agregado al carrito!" });
    } catch (err) {
      setCartMessage({ type: "error", text: err.message });
    } finally {
      setAddingToCart(false);
    }
  }

  // ── Skeleton ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="mx-auto max-w-295 px-8 md:px-16 py-12 animate-pulse">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-secondary/10 border border-secondary" />
          <div className="space-y-4">
            <div className="h-8 bg-secondary/10 w-3/4" />
            <div className="h-5 bg-secondary/10 w-1/4" />
            <div className="h-px bg-secondary/10" />
            <div className="space-y-2">
              <div className="h-4 bg-secondary/10" />
              <div className="h-4 bg-secondary/10" />
              <div className="h-4 bg-secondary/10 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="mx-auto max-w-295 px-8 md:px-16 py-24 text-center">
        <p className="text-tertiary text-lg mb-6">{error}</p>
        <Button variant="outline" onClick={() => navigate("/explore")}>
          <LeftArrowIcon />
          Volver a explorar
        </Button>
      </div>
    );
  }

  const avgRating = getRatingAverage(reviews);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="bg-neutral">
      <div className="mx-auto max-w-295 px-8 md:px-16 py-12">
        {/* Breadcrumb */}
        <div className="mb-8">
          <AppLink to="/explore">
            <LeftArrowIcon />
            Explorar
          </AppLink>
        </div>

        {/* Contenido principal */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* ── Galería ── */}
          <ImageGallery
            images={product.images}
            productName={product.name}
          />

          {/* ── Info del producto ── */}
          <div>
            <h2 className="normal-case tracking-normal leading-tight mb-2">
              {product.name}
            </h2>

            <p className="text-2xl font-bold text-secondary mb-4">
              {formatPrice(selectedVariant?.price ?? product.price)}
            </p>

            <div className="border-t border-secondary pt-4 mb-6">
              <p className="text-sm text-tertiary leading-6">
                {product.description}
              </p>
            </div>

            {/* Selector de color */}
            {colorOptions.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-[1.2px] text-secondary mb-2">
                  Color{" "}
                  {selectedColor && (
                    <span className="font-normal text-tertiary normal-case tracking-normal">
                      {selectedColor.value}
                    </span>
                  )}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((c) => (
                    <ColorSwatch
                      key={c.id}
                      color={c}
                      selected={selectedColor?.id === c.id}
                      onClick={() =>
                        setSelectedColor(
                          selectedColor?.id === c.id ? null : c
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Selector de talle */}
            {sizeOptions.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-[1.2px] text-secondary">
                    Talla
                  </p>
                  <button className="text-xs text-primary uppercase tracking-[1.2px] font-bold hover:underline">
                    Guía de talles
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {sizeOptions.map((s) => {
                    // Deshabilitar si no hay stock para ese talle con el color elegido
                    const variantForSize = product.variants?.find((v) => {
                      const avIds = v.attributeValues.map((a) => a.id);
                      const sizeMatch = avIds.includes(s.id);
                      const colorMatch =
                        !selectedColor || avIds.includes(selectedColor.id);
                      return sizeMatch && colorMatch;
                    });
                    const outOfStock =
                      variantForSize != null && variantForSize.stock === 0;

                    return (
                      <SizeButton
                        key={s.id}
                        label={s.value}
                        selected={selectedSize?.id === s.id}
                        disabled={outOfStock}
                        onClick={() =>
                          setSelectedSize(
                            selectedSize?.id === s.id ? null : s
                          )
                        }
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mensaje de carrito */}
            {cartMessage && (
              <p
                className={`text-sm mb-3 font-bold uppercase tracking-[1.2px] ${
                  cartMessage.type === "success"
                    ? "text-green-600"
                    : "text-primary"
                }`}
              >
                {cartMessage.text}
              </p>
            )}

            {/* Botón añadir al carrito */}
            <Button
              onClick={handleAddToCart}
              disabled={addingToCart || !hasStock}
              className="w-full"
            >
              {addingToCart
                ? "Agregando..."
                : !hasStock
                ? "Sin stock"
                : "Añadir al carrito"}
            </Button>
          </div>
        </div>

        {/* ── Sección de reseñas ── */}
        <div className="border-t border-secondary pt-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[1.2px] text-secondary mb-1">
                Reseñas
              </p>
              {reviews.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-secondary">
                    {avgRating.toFixed(1)}
                  </span>
                  <div>
                    <StarRating rating={avgRating} size={16} />
                    <span className="text-xs text-tertiary">
                      ({reviews.length} reseñas)
                    </span>
                  </div>
                </div>
              )}
            </div>
            <Button variant="outline">Escribir reseña</Button>
          </div>

          {reviews.length === 0 ? (
            <p className="text-tertiary text-sm py-8 text-center">
              Este producto aún no tiene reseñas.
            </p>
          ) : (
            <div className="space-y-6 max-w-2xl">
              {reviews.slice(0, 5).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}

              {reviews.length > 5 && (
                <div className="pt-4 flex justify-center">
                  <AppLink to="#reviews">
                    Ver todas las reseñas ({reviews.length})
                  </AppLink>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
