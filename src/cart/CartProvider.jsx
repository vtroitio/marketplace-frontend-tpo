import { useCallback, useEffect, useMemo, useState } from "react";
import { CartContext } from "./CartContext";

const CART_STORAGE_KEY = "skindexCart";

function getInitialCart() {
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);

  if (!storedCart) return [];

  try {
    return JSON.parse(storedCart);
  } catch {
    return [];
  }
}

function validateCartItem(item) {
  if (!item?.id) {
    return {
      ok: false,
      status: "INVALID_ITEM",
      message: "El producto no tiene un identificador válido.",
    };
  }

  if (!item.quantity || item.quantity < 1) {
    return {
      ok: false,
      status: "INVALID_QUANTITY",
      message: "La cantidad debe ser mayor a 0.",
    };
  }

  if (!item.maxStock || item.maxStock < 1) {
    return {
      ok: false,
      status: "NO_STOCK",
      message: "Este producto no tiene stock disponible.",
    };
  }

  return { ok: true };
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getInitialCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("No se pudo guardar el carrito:", error);
    }
  }, [cartItems]);

  const addItem = useCallback(
    (newItem) => {
      const validation = validateCartItem(newItem);

      if (!validation.ok) {
        return validation;
      }

      const existingItem = cartItems.find((item) => item.id === newItem.id);

      if (existingItem) {
        const nextQuantity = existingItem.quantity + newItem.quantity;

        if (nextQuantity > existingItem.maxStock) {
          return {
            ok: false,
            status: "STOCK_LIMIT",
            message: `Agregaste más unidades de las disponibles de ${newItem.name}.`,
          };
        }

        setCartItems((prevItems) =>
          prevItems.map((item) => {
            if (item.id !== newItem.id) return item;

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

      setCartItems((prevItems) => [...prevItems, newItem]);

      return {
        ok: true,
        status: "ADDED",
        message: "Producto agregado al carrito.",
      };
    },
    [cartItems],
  );

  const increaseItem = useCallback(
    (id) => {
      const existingItem = cartItems.find((item) => item.id === id);

      if (!existingItem) {
        return {
          ok: false,
          status: "NOT_FOUND",
          message: "El producto no está en el carrito.",
        };
      }

      if (existingItem.quantity >= existingItem.maxStock) {
        return {
          ok: false,
          status: "STOCK_LIMIT",
          message: `No hay más stock disponible de ${existingItem.name}.`,
        };
      }

      setCartItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id !== id) return item;

          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }),
      );

      return {
        ok: true,
        status: "UPDATED",
      };
    },
    [cartItems],
  );

  const decreaseItem = useCallback((id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== id) return item;

        return {
          ...item,
          quantity: Math.max(item.quantity - 1, 1),
        };
      }),
    );
  }, []);

  const removeItem = useCallback((id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const totalArticles = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const value = useMemo(
    () => ({
      cartItems,
      totalArticles,
      subtotal,
      addItem,
      increaseItem,
      decreaseItem,
      removeItem,
      clearCart,
    }),
    [
      cartItems,
      totalArticles,
      subtotal,
      addItem,
      increaseItem,
      decreaseItem,
      removeItem,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}