import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CartContext } from "./CartContext";
import { useSelector } from "react-redux";
import {
  addCartItem as addCartItemRequest,
  clearBackendCart,
  getCart as getCartRequest,
  removeCartItem as removeCartItemRequest,
  syncCart as syncCartRequest,
  updateCartItem as updateCartItemRequest,
  validateCart as validateCartRequest,
} from "../api/cart";

const CART_STORAGE_KEY = "skindexCart";
const DEFAULT_MAX_STOCK = Number.MAX_SAFE_INTEGER;

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function sameId(a, b) {
  return String(a) === String(b);
}

function normalizeMaxStock(value) {
  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    return DEFAULT_MAX_STOCK;
  }

  return number;
}

function normalizeAttribute(attribute) {
  if (!attribute) return null;

  if (typeof attribute === "string") {
    return {
      id: null,
      value: attribute,
    };
  }

  const nested =
    attribute.attributeValue ??
    attribute.valueObject ??
    attribute.attributeValueResponse ??
    attribute;

  const value =
    nested.value ??
    nested.name ??
    nested.code ??
    attribute.value ??
    attribute.name ??
    attribute.code ??
    "";

  if (!value) return null;

  return {
    id: nested.id ?? attribute.id ?? null,
    value,
  };
}

function getVariantAttributes(productVariant) {
  return (
    productVariant?.attributes ??
    productVariant?.attributeValues ??
    productVariant?.variantAttributeValues ??
    []
  );
}

function getVariantAttribute(productVariant, expectedCode) {
  const attributes = getVariantAttributes(productVariant);
  const normalizedExpectedCode = expectedCode.toUpperCase();

  return attributes.find((attribute) => {
    const code =
      attribute.attribute?.code ??
      attribute.attribute?.name ??
      attribute.attributeCode ??
      attribute.code ??
      attribute.name ??
      attribute.type ??
      "";

    return String(code).toUpperCase() === normalizedExpectedCode;
  });
}

function getVariantImage(productVariant) {
  const firstVariantImage = productVariant?.images?.[0];
  const firstProductImage = productVariant?.product?.images?.[0];

  return (
    productVariant?.image ??
    productVariant?.imageUrl ??
    firstVariantImage?.url ??
    firstVariantImage?.path ??
    firstProductImage?.url ??
    firstProductImage?.path ??
    productVariant?.product?.coverImageUrl ??
    productVariant?.product?.image ??
    ""
  );
}

function getItemVariantId(item, { fallbackToId = false } = {}) {
  const variantId =
    item?.variantId ??
    item?.productVariantId ??
    item?.productVariant?.id ??
    item?.variant?.id;

  if (variantId) return variantId;

  return fallbackToId ? item?.id : null;
}

function normalizeLocalCartItem(item) {
  const productVariant =
    item.productVariant ?? item.variant ?? (item.product ? item : null);

  const variantId = getItemVariantId(item, { fallbackToId: true });

  const quantity = Math.max(1, toNumber(item.quantity ?? 1, 1));

  const price = toNumber(
    item.price ??
      item.unitPrice ??
      productVariant?.price ??
      productVariant?.priceBase ??
      productVariant?.product?.price ??
      productVariant?.product?.priceBase,
    0,
  );

  const maxStock = normalizeMaxStock(
    item.maxStock ?? item.stock ?? productVariant?.stock,
  );

  const size = normalizeAttribute(
    item.size ??
      getVariantAttribute(productVariant, "TALLE") ??
      getVariantAttribute(productVariant, "SIZE"),
  );

  const color = normalizeAttribute(
    item.color ?? getVariantAttribute(productVariant, "COLOR"),
  );

  const name =
    item.name ??
    item.productName ??
    productVariant?.product?.name ??
    productVariant?.name ??
    item.product?.name ??
    "Producto";

  const image = item.image ?? item.imageUrl ?? getVariantImage(productVariant);

  return {
    id: variantId, // En carrito local, el id operativo es el id de la variante.
    cartItemId: null,

    variantId,
    productVariantId: variantId,

    name,
    image,

    size,
    color,

    quantity,
    maxStock,

    price,
    subtotal: price * quantity,
  };
}

function mapLocalItemForSync(item) {
  const variantId = getItemVariantId(item, { fallbackToId: true });

  return {
    variantId,
    productVariantId: variantId,
    quantity: item.quantity,
  };
}

function getLocalCart() {
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);

  if (!storedCart) return [];

  try {
    const parsedCart = JSON.parse(storedCart);

    if (!Array.isArray(parsedCart)) return [];

    return parsedCart
      .map(normalizeLocalCartItem)
      .filter((item) => item.variantId);
  } catch {
    return [];
  }
}

function saveLocalCart(items) {
  const normalizedItems = items
    .map(normalizeLocalCartItem)
    .filter((item) => item.variantId);

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalizedItems));
}

function clearLocalCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
}

function mapBackendCartItem(item) {
  const variantId = item.productVariantId ?? item.variantId;

  const quantity = toNumber(item.quantity, 1);
  const price = toNumber(item.price ?? item.unitPrice, 0);

  return {
    id: item.id, // En carrito backend, este id es el CartItem.id.
    cartItemId: item.id,

    variantId,
    productVariantId: variantId,

    name: item.name ?? item.productName ?? "Producto",
    image: item.image ?? "",

    size: normalizeAttribute(item.size),
    color: normalizeAttribute(item.color),

    quantity,
    maxStock: normalizeMaxStock(item.maxStock),

    price,
    subtotal: toNumber(item.subtotal, price * quantity),
  };
}

function mapBackendCart(cart) {
  return cart?.items?.map(mapBackendCartItem) ?? [];
}

export function CartProvider({ children }) {
  const {
    isAuthenticated = false,
    loading = false,
    initialized = true,
    user = null,
    currentUser: currentUserFromState = null,
  } = useSelector((state) => state.auth ?? {});

  const authLoading = loading || !initialized;
  const currentUser = user ?? currentUserFromState;

  const [cartItems, setCartItems] = useState(() => getLocalCart());
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState("");
  const [syncResults, setSyncResults] = useState([]);

  const syncStartedRef = useRef(false);
  const syncedUserIdRef = useRef(null);

  const loadBackendCart = useCallback(async () => {
    const backendCart = await getCartRequest();
    const mappedItems = mapBackendCart(backendCart);

    setCartItems(mappedItems);

    return backendCart;
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      syncStartedRef.current = false;
      syncedUserIdRef.current = null;

      queueMicrotask(() => {
        setCartItems(getLocalCart());
      });

      return;
    }

    const userId = currentUser?.id ?? "authenticated";

    if (syncStartedRef.current && syncedUserIdRef.current === userId) {
      return;
    }

    syncStartedRef.current = true;
    syncedUserIdRef.current = userId;

    async function initializeAuthenticatedCart() {
      try {
        setCartLoading(true);
        setCartError("");

        const localCart = getLocalCart();

        if (localCart.length > 0) {
          const syncPayload = localCart.map(mapLocalItemForSync);
          const syncResponse = await syncCartRequest(syncPayload);

          clearLocalCart();

          setCartItems(mapBackendCart(syncResponse.cart));
          setSyncResults(syncResponse.results ?? []);

          return;
        }

        await loadBackendCart();
      } catch (error) {
        console.error(error);
        setCartError(error.message || "No se pudo cargar el carrito.");
      } finally {
        setCartLoading(false);
      }
    }

    initializeAuthenticatedCart();
  }, [authLoading, isAuthenticated, currentUser?.id, loadBackendCart]);

  useEffect(() => {
    if (authLoading || isAuthenticated) return;

    saveLocalCart(cartItems);
  }, [cartItems, authLoading, isAuthenticated]);

  const addLocalItem = useCallback(
    (newItem) => {
      const requestedQuantity = toNumber(newItem.quantity ?? 1, 1);

      if (requestedQuantity < 1) {
        return {
          ok: false,
          status: "INVALID_QUANTITY",
          message: "La cantidad debe ser mayor a cero.",
        };
      }

      const normalizedItem = normalizeLocalCartItem({
        ...newItem,
        quantity: requestedQuantity,
      });

      const variantId = normalizedItem.variantId;

      if (!variantId) {
        return {
          ok: false,
          status: "INVALID_ITEM",
          message: "El producto no tiene una variante válida.",
        };
      }

      const existingItem = cartItems.find((item) =>
        sameId(getItemVariantId(item, { fallbackToId: true }), variantId),
      );

      if (existingItem) {
        const nextQuantity = existingItem.quantity + normalizedItem.quantity;

        if (nextQuantity > existingItem.maxStock) {
          return {
            ok: false,
            status: "STOCK_LIMIT",
            message: `No hay más stock disponible de ${existingItem.name}.`,
          };
        }

        setCartItems((prevItems) =>
          prevItems.map((item) => {
            const itemVariantId = getItemVariantId(item, {
              fallbackToId: true,
            });

            if (!sameId(itemVariantId, variantId)) return item;

            return {
              ...item,
              quantity: nextQuantity,
              subtotal: item.price * nextQuantity,
            };
          }),
        );

        return {
          ok: true,
          status: "UPDATED",
          message: "Se actualizó la cantidad del producto en el carrito.",
        };
      }

      if (normalizedItem.quantity > normalizedItem.maxStock) {
        return {
          ok: false,
          status: "STOCK_LIMIT",
          message: `No hay suficiente stock disponible de ${normalizedItem.name}.`,
        };
      }

      setCartItems((prevItems) => [...prevItems, normalizedItem]);

      return {
        ok: true,
        status: "ADDED",
        message: "Producto agregado al carrito.",
      };
    },
    [cartItems],
  );

  const addItem = useCallback(
    async (newItem) => {
      if (!isAuthenticated) {
        return addLocalItem(newItem);
      }

      try {
        setCartLoading(true);
        setCartError("");

        const normalizedItem = normalizeLocalCartItem(newItem);
        const variantId = normalizedItem.variantId;

        if (!variantId) {
          return {
            ok: false,
            status: "INVALID_ITEM",
            message: "El producto no tiene una variante válida.",
          };
        }

        const updatedCart = await addCartItemRequest({
          // productVariantId es el nombre que espera tu nuevo backend.
          productVariantId: variantId,

          // variantId lo dejo para no romper si tu api/cart.js todavía usa este nombre internamente.
          variantId,

          quantity: normalizedItem.quantity ?? 1,
        });

        setCartItems(mapBackendCart(updatedCart));

        return {
          ok: true,
          status: "ADDED",
          message: "Producto agregado al carrito.",
        };
      } catch (error) {
        console.error(error);
        setCartError(error.message);

        return {
          ok: false,
          status: "ERROR",
          message:
            error.message || "No se pudo agregar el producto al carrito.",
        };
      } finally {
        setCartLoading(false);
      }
    },
    [isAuthenticated, addLocalItem],
  );

  const increaseItem = useCallback(
    async (id) => {
      const item = cartItems.find((cartItem) => sameId(cartItem.id, id));

      if (!item) {
        return {
          ok: false,
          status: "NOT_FOUND",
          message: "El producto no está en el carrito.",
        };
      }

      const nextQuantity = item.quantity + 1;

      if (!isAuthenticated) {
        if (nextQuantity > item.maxStock) {
          return {
            ok: false,
            status: "STOCK_LIMIT",
            message: `No hay más stock disponible de ${item.name}.`,
          };
        }

        setCartItems((prevItems) =>
          prevItems.map((cartItem) =>
            sameId(cartItem.id, id)
              ? {
                  ...cartItem,
                  quantity: nextQuantity,
                  subtotal: cartItem.price * nextQuantity,
                }
              : cartItem,
          ),
        );

        return {
          ok: true,
          status: "UPDATED",
        };
      }

      try {
        setCartLoading(true);
        setCartError("");

        const updatedCart = await updateCartItemRequest(id, nextQuantity);

        setCartItems(mapBackendCart(updatedCart));

        return {
          ok: true,
          status: "UPDATED",
        };
      } catch (error) {
        console.error(error);
        setCartError(error.message);

        return {
          ok: false,
          status: "ERROR",
          message: error.message || "No se pudo actualizar el carrito.",
        };
      } finally {
        setCartLoading(false);
      }
    },
    [cartItems, isAuthenticated],
  );

  const decreaseItem = useCallback(
    async (id) => {
      const item = cartItems.find((cartItem) => sameId(cartItem.id, id));

      if (!item || item.quantity <= 1) {
        return {
          ok: false,
          status: "MIN_QUANTITY",
          message: "La cantidad mínima es 1.",
        };
      }

      const nextQuantity = item.quantity - 1;

      if (!isAuthenticated) {
        setCartItems((prevItems) =>
          prevItems.map((cartItem) =>
            sameId(cartItem.id, id)
              ? {
                  ...cartItem,
                  quantity: nextQuantity,
                  subtotal: cartItem.price * nextQuantity,
                }
              : cartItem,
          ),
        );

        return {
          ok: true,
          status: "UPDATED",
        };
      }

      try {
        setCartLoading(true);
        setCartError("");

        const updatedCart = await updateCartItemRequest(id, nextQuantity);

        setCartItems(mapBackendCart(updatedCart));

        return {
          ok: true,
          status: "UPDATED",
        };
      } catch (error) {
        console.error(error);
        setCartError(error.message);

        return {
          ok: false,
          status: "ERROR",
          message: error.message || "No se pudo actualizar el carrito.",
        };
      } finally {
        setCartLoading(false);
      }
    },
    [cartItems, isAuthenticated],
  );

  const removeItem = useCallback(
    async (id) => {
      if (!isAuthenticated) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => !sameId(item.id, id)),
        );

        return {
          ok: true,
          status: "REMOVED",
        };
      }

      try {
        setCartLoading(true);
        setCartError("");

        const updatedCart = await removeCartItemRequest(id);

        setCartItems(mapBackendCart(updatedCart));

        return {
          ok: true,
          status: "REMOVED",
        };
      } catch (error) {
        console.error(error);
        setCartError(error.message);

        return {
          ok: false,
          status: "ERROR",
          message: error.message || "No se pudo eliminar el producto.",
        };
      } finally {
        setCartLoading(false);
      }
    },
    [isAuthenticated],
  );

  const clearCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      clearLocalCart();

      return {
        ok: true,
        status: "CLEARED",
      };
    }

    try {
      setCartLoading(true);
      setCartError("");

      await clearBackendCart();

      setCartItems([]);

      return {
        ok: true,
        status: "CLEARED",
      };
    } catch (error) {
      console.error(error);
      setCartError(error.message);

      return {
        ok: false,
        status: "ERROR",
        message: error.message || "No se pudo vaciar el carrito.",
      };
    } finally {
      setCartLoading(false);
    }
  }, [isAuthenticated]);

  const validateCartForCheckout = useCallback(async () => {
    if (!isAuthenticated) {
      return {
        ok: false,
        status: "AUTH_REQUIRED",
        message: "Tenés que iniciar sesión para continuar.",
      };
    }

    try {
      setCartLoading(true);
      setCartError("");

      const response = await validateCartRequest();

      setCartItems(mapBackendCart(response.cart));

      return {
        ok: response.valid,
        status: response.valid ? "VALID" : "INVALID",
        message: response.valid
          ? "Carrito válido."
          : "Se actualizaron algunos productos del carrito.",
        issues: response.issues ?? [],
      };
    } catch (error) {
      return {
        ok: false,
        status: "ERROR",
        message: error.message || "No se pudo validar el carrito.",
      };
    } finally {
      setCartLoading(false);
    }
  }, [isAuthenticated]);

  const totalArticles = cartItems.reduce(
    (acc, item) => acc + toNumber(item.quantity, 0),
    0,
  );

  const subtotal = cartItems.reduce(
    (acc, item) => acc + toNumber(item.price, 0) * toNumber(item.quantity, 0),
    0,
  );

  const value = useMemo(
    () => ({
      cartItems,
      totalArticles,
      subtotal,
      cartLoading,
      cartError,
      syncResults,
      addItem,
      increaseItem,
      decreaseItem,
      removeItem,
      clearCart,
      validateCartForCheckout,
      reloadCart: loadBackendCart,
    }),
    [
      cartItems,
      totalArticles,
      subtotal,
      cartLoading,
      cartError,
      syncResults,
      addItem,
      increaseItem,
      decreaseItem,
      removeItem,
      clearCart,
      loadBackendCart,
      validateCartForCheckout,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
