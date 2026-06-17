import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CartContext } from "./CartContext";
import { useAuth } from "../auth/AuthContext";
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

function getLocalCart() {
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);

  if (!storedCart) return [];

  try {
    return JSON.parse(storedCart);
  } catch {
    return [];
  }
}

function saveLocalCart(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function clearLocalCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
}

function getItemVariantId(item) {
  return item.variantId ?? item.productVariantId ?? item.id;
}

function mapBackendCartItem(item) {
  return {
    id: item.id,
    cartItemId: item.id,
    variantId: item.productVariantId,
    name: item.productName,
    quantity: item.quantity,
    price: Number(item.unitPrice),
    subtotal: Number(item.subtotal),

    // Estos datos no vienen todavía desde tu CartItemResponse actual.
    // Los dejamos vacíos para no romper la UI.
    size: item.size ?? "",
    color: item.color ?? "",
    image: item.image ?? "",
    maxStock: item.maxStock ?? Infinity,
  };
}

function mapBackendCart(cart) {
  return cart?.items?.map(mapBackendCartItem) ?? [];
}

export function CartProvider({ children }) {
  const { isAuthenticated, authLoading, currentUser } = useAuth();

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
          const syncResponse = await syncCartRequest(localCart);

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
      const variantId = getItemVariantId(newItem);

      if (!variantId) {
        return {
          ok: false,
          status: "INVALID_ITEM",
          message: "El producto no tiene una variante válida.",
        };
      }

      if (!newItem.quantity || newItem.quantity < 1) {
        return {
          ok: false,
          status: "INVALID_QUANTITY",
          message: "La cantidad debe ser mayor a cero.",
        };
      }

      const existingItem = cartItems.find(
        (item) => getItemVariantId(item) === variantId,
      );

      if (existingItem) {
        const nextQuantity = existingItem.quantity + newItem.quantity;

        if (nextQuantity > existingItem.maxStock) {
          return {
            ok: false,
            status: "STOCK_LIMIT",
            message: `No hay más stock disponible de ${existingItem.name}.`,
          };
        }

        setCartItems((prevItems) =>
          prevItems.map((item) => {
            if (getItemVariantId(item) !== variantId) return item;

            return {
              ...item,
              quantity: nextQuantity,
            };
          }),
        );

        return {
          ok: true,
          status: "UPDATED",
          message: "Se actualizó la cantidad del producto en el carrito.",
        };
      }

      if (newItem.quantity > newItem.maxStock) {
        return {
          ok: false,
          status: "STOCK_LIMIT",
          message: `No hay suficiente stock disponible de ${newItem.name}.`,
        };
      }

      setCartItems((prevItems) => [
        ...prevItems,
        {
          ...newItem,
          id: variantId,
          variantId,
        },
      ]);

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

        const variantId = getItemVariantId(newItem);

        const updatedCart = await addCartItemRequest({
          variantId,
          quantity: newItem.quantity ?? 1,
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
      const item = cartItems.find((cartItem) => cartItem.id === id);

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
            cartItem.id === id
              ? { ...cartItem, quantity: nextQuantity }
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
      const item = cartItems.find((cartItem) => cartItem.id === id);

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
            cartItem.id === id
              ? { ...cartItem, quantity: nextQuantity }
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
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));

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

  const totalArticles = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
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
