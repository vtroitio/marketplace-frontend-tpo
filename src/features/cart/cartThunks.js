import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addCartItem as addCartItemRequest,
  clearBackendCart,
  getCart as getCartRequest,
  removeCartItem as removeCartItemRequest,
  syncCart as syncCartRequest,
  updateCartItem as updateCartItemRequest,
  validateCart as validateCartRequest,
} from "../../api/cart";

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
    id: variantId,
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
    id: item.id,
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

function getAuthState(state) {
  const auth = state.auth ?? {};

  return {
    isAuthenticated: Boolean(auth.isAuthenticated),
    authLoading: Boolean(auth.loading) || auth.initialized === false,
    currentUser: auth.user ?? auth.currentUser ?? null,
  };
}

function getCurrentCartItems(state) {
  return state.cart?.items ?? [];
}

export const initializeCart = createAsyncThunk(
  "cart/initializeCart",
  async (_, { getState }) => {
    const state = getState();
    const currentItems = getCurrentCartItems(state);
    const { isAuthenticated, authLoading, currentUser } = getAuthState(state);

    if (authLoading) {
      return {
        ok: true,
        status: "AUTH_LOADING",
        items: currentItems,
        initialized: false,
      };
    }

    if (!isAuthenticated) {
      return {
        ok: true,
        status: "LOCAL_CART_LOADED",
        items: getLocalCart(),
        initialized: true,
        syncedUserId: null,
        syncResults: [],
      };
    }

    const userId = currentUser?.id ?? "authenticated";

    if (state.cart?.initialized && state.cart?.syncedUserId === userId) {
      return {
        ok: true,
        status: "ALREADY_INITIALIZED",
        items: currentItems,
        initialized: true,
        syncedUserId: userId,
        syncResults: state.cart?.syncResults ?? [],
      };
    }

    try {
      const localCart = getLocalCart();

      if (localCart.length > 0) {
        const syncPayload = localCart.map(mapLocalItemForSync);
        const syncResponse = await syncCartRequest(syncPayload);

        clearLocalCart();

        return {
          ok: true,
          status: "SYNCED",
          items: mapBackendCart(syncResponse.cart),
          syncResults: syncResponse.results ?? [],
          initialized: true,
          syncedUserId: userId,
        };
      }

      const backendCart = await getCartRequest();

      return {
        ok: true,
        status: "BACKEND_CART_LOADED",
        items: mapBackendCart(backendCart),
        syncResults: [],
        initialized: true,
        syncedUserId: userId,
      };
    } catch (error) {
      return {
        ok: false,
        status: "ERROR",
        message: error.message || "No se pudo cargar el carrito.",
        items: currentItems,
        initialized: true,
        syncedUserId: null,
        syncResults: [],
      };
    }
  },
);

export const reloadCart = createAsyncThunk(
  "cart/reloadCart",
  async (_, { getState }) => {
    const state = getState();
    const currentItems = getCurrentCartItems(state);
    const { isAuthenticated } = getAuthState(state);

    if (!isAuthenticated) {
      return {
        ok: true,
        status: "LOCAL_CART_LOADED",
        items: getLocalCart(),
      };
    }

    try {
      const backendCart = await getCartRequest();

      return {
        ok: true,
        status: "BACKEND_CART_LOADED",
        items: mapBackendCart(backendCart),
      };
    } catch (error) {
      return {
        ok: false,
        status: "ERROR",
        message: error.message || "No se pudo recargar el carrito.",
        items: currentItems,
      };
    }
  },
);

export const addItem = createAsyncThunk(
  "cart/addItem",
  async (newItem, { getState }) => {
    const state = getState();
    const cartItems = getCurrentCartItems(state);
    const { isAuthenticated } = getAuthState(state);

    const requestedQuantity = toNumber(newItem.quantity ?? 1, 1);

    if (requestedQuantity < 1) {
      return {
        ok: false,
        status: "INVALID_QUANTITY",
        message: "La cantidad debe ser mayor a cero.",
        items: cartItems,
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
        items: cartItems,
      };
    }

    if (!isAuthenticated) {
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
            items: cartItems,
          };
        }

        const nextItems = cartItems.map((item) => {
          const itemVariantId = getItemVariantId(item, {
            fallbackToId: true,
          });

          if (!sameId(itemVariantId, variantId)) return item;

          return {
            ...item,
            quantity: nextQuantity,
            subtotal: item.price * nextQuantity,
          };
        });

        saveLocalCart(nextItems);

        return {
          ok: true,
          status: "UPDATED",
          message: "Se actualizó la cantidad del producto en el carrito.",
          items: nextItems,
        };
      }

      if (normalizedItem.quantity > normalizedItem.maxStock) {
        return {
          ok: false,
          status: "STOCK_LIMIT",
          message: `No hay suficiente stock disponible de ${normalizedItem.name}.`,
          items: cartItems,
        };
      }

      const nextItems = [...cartItems, normalizedItem];

      saveLocalCart(nextItems);

      return {
        ok: true,
        status: "ADDED",
        message: "Producto agregado al carrito.",
        items: nextItems,
      };
    }

    try {
      const updatedCart = await addCartItemRequest({
        productVariantId: variantId,
        variantId,
        quantity: normalizedItem.quantity ?? 1,
      });

      return {
        ok: true,
        status: "ADDED",
        message: "Producto agregado al carrito.",
        items: mapBackendCart(updatedCart),
      };
    } catch (error) {
      return {
        ok: false,
        status: "ERROR",
        message: error.message || "No se pudo agregar el producto al carrito.",
        items: cartItems,
      };
    }
  },
);

export const increaseItem = createAsyncThunk(
  "cart/increaseItem",
  async (id, { getState }) => {
    const state = getState();
    const cartItems = getCurrentCartItems(state);
    const { isAuthenticated } = getAuthState(state);

    const item = cartItems.find((cartItem) => sameId(cartItem.id, id));

    if (!item) {
      return {
        ok: false,
        status: "NOT_FOUND",
        message: "El producto no está en el carrito.",
        items: cartItems,
      };
    }

    const nextQuantity = item.quantity + 1;

    if (!isAuthenticated) {
      if (nextQuantity > item.maxStock) {
        return {
          ok: false,
          status: "STOCK_LIMIT",
          message: `No hay más stock disponible de ${item.name}.`,
          items: cartItems,
        };
      }

      const nextItems = cartItems.map((cartItem) =>
        sameId(cartItem.id, id)
          ? {
              ...cartItem,
              quantity: nextQuantity,
              subtotal: cartItem.price * nextQuantity,
            }
          : cartItem,
      );

      saveLocalCart(nextItems);

      return {
        ok: true,
        status: "UPDATED",
        items: nextItems,
      };
    }

    try {
      const updatedCart = await updateCartItemRequest(id, nextQuantity);

      return {
        ok: true,
        status: "UPDATED",
        items: mapBackendCart(updatedCart),
      };
    } catch (error) {
      return {
        ok: false,
        status: "ERROR",
        message: error.message || "No se pudo actualizar el carrito.",
        items: cartItems,
      };
    }
  },
);

export const decreaseItem = createAsyncThunk(
  "cart/decreaseItem",
  async (id, { getState }) => {
    const state = getState();
    const cartItems = getCurrentCartItems(state);
    const { isAuthenticated } = getAuthState(state);

    const item = cartItems.find((cartItem) => sameId(cartItem.id, id));

    if (!item || item.quantity <= 1) {
      return {
        ok: false,
        status: "MIN_QUANTITY",
        message: "La cantidad mínima es 1.",
        items: cartItems,
      };
    }

    const nextQuantity = item.quantity - 1;

    if (!isAuthenticated) {
      const nextItems = cartItems.map((cartItem) =>
        sameId(cartItem.id, id)
          ? {
              ...cartItem,
              quantity: nextQuantity,
              subtotal: cartItem.price * nextQuantity,
            }
          : cartItem,
      );

      saveLocalCart(nextItems);

      return {
        ok: true,
        status: "UPDATED",
        items: nextItems,
      };
    }

    try {
      const updatedCart = await updateCartItemRequest(id, nextQuantity);

      return {
        ok: true,
        status: "UPDATED",
        items: mapBackendCart(updatedCart),
      };
    } catch (error) {
      return {
        ok: false,
        status: "ERROR",
        message: error.message || "No se pudo actualizar el carrito.",
        items: cartItems,
      };
    }
  },
);

export const removeItem = createAsyncThunk(
  "cart/removeItem",
  async (id, { getState }) => {
    const state = getState();
    const cartItems = getCurrentCartItems(state);
    const { isAuthenticated } = getAuthState(state);

    if (!isAuthenticated) {
      const nextItems = cartItems.filter((item) => !sameId(item.id, id));

      saveLocalCart(nextItems);

      return {
        ok: true,
        status: "REMOVED",
        items: nextItems,
      };
    }

    try {
      const updatedCart = await removeCartItemRequest(id);

      return {
        ok: true,
        status: "REMOVED",
        items: mapBackendCart(updatedCart),
      };
    } catch (error) {
      return {
        ok: false,
        status: "ERROR",
        message: error.message || "No se pudo eliminar el producto.",
        items: cartItems,
      };
    }
  },
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState }) => {
    const state = getState();
    const cartItems = getCurrentCartItems(state);
    const { isAuthenticated } = getAuthState(state);

    if (!isAuthenticated) {
      clearLocalCart();

      return {
        ok: true,
        status: "CLEARED",
        items: [],
      };
    }

    try {
      await clearBackendCart();

      return {
        ok: true,
        status: "CLEARED",
        items: [],
      };
    } catch (error) {
      return {
        ok: false,
        status: "ERROR",
        message: error.message || "No se pudo vaciar el carrito.",
        items: cartItems,
      };
    }
  },
);

export const validateCartForCheckout = createAsyncThunk(
  "cart/validateCartForCheckout",
  async (_, { getState }) => {
    const state = getState();
    const cartItems = getCurrentCartItems(state);
    const { isAuthenticated } = getAuthState(state);

    if (!isAuthenticated) {
      return {
        ok: false,
        status: "AUTH_REQUIRED",
        message: "Tenés que iniciar sesión para continuar.",
        issues: [],
        items: cartItems,
      };
    }

    try {
      const response = await validateCartRequest();

      return {
        ok: response.valid,
        status: response.valid ? "VALID" : "INVALID",
        message: response.valid
          ? "Carrito válido."
          : "Se actualizaron algunos productos del carrito.",
        issues: response.issues ?? [],
        items: mapBackendCart(response.cart),
      };
    } catch (error) {
      return {
        ok: false,
        status: "ERROR",
        message: error.message || "No se pudo validar el carrito.",
        issues: [],
        items: cartItems,
      };
    }
  },
);