import { useState } from "react";
import { Button } from "../components/ui/Button";
import { AppLink } from "../components/ui/AppLink";

export function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "K-DA AKALI ANORAK",
      size: "L",
      color: "Obsidian",
      price: 180.0,
      quantity: 1,
      maxStock: 5,
      image: "",
    },
    {
      id: 2,
      name: "PROJECT: VAYNE KICKS",
      size: "42",
      color: "Chrome",
      price: 220.0,
      quantity: 1,
      maxStock: 3,
      image: "",
    },
  ]);

  const shippingCost = 15.0;

  const handleIncrease = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          if (item.quantity >= item.maxStock) {
            alert(`Lo sentimos, no hay más stock disponible de ${item.name}.`);
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      }),
    );
  };

  const handleDecrease = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      }),
    );
  };

  const handleRemove = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const total = subtotal > 0 ? subtotal + shippingCost : 0;
  const totalArticles = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-white text-black font-sans">
      <div className="flex justify-between items-baseline border-b border-black pb-3 mb-12">
        <h1 className="text-4xl font-bold uppercase tracking-tight">
          Tu Compra
        </h1>
        <span className="text-xs uppercase font-bold tracking-wider text-gray-400">
          {totalArticles} {totalArticles === 1 ? "Artículo" : "Artículos"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        <div className="lg:col-span-2">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-300">
              <p className="text-gray-400 uppercase text-xs tracking-wider">
                Tu carrito está vacío.
              </p>
              <AppLink
                variant="underline"
                to="/home"
                className="text-xs font-bold uppercase mt-4 inline-block"
              >
                Volver a la tienda
              </AppLink>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={item.id}
                className={`border-b border-gray-300 py-6 flex items-center justify-between gap-4 ${index === 0 ? "border-t" : ""}`}
              >
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 border border-gray-400 p-1 flex-shrink-0 bg-gray-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-base uppercase tracking-wider">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
                      Talla: {item.size} <span className="mx-2">|</span> Color:{" "}
                      {item.color}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="flex items-center border border-gray-400 text-sm bg-white">
                    <button
                      onClick={() => handleDecrease(item.id)}
                      disabled={item.quantity <= 1}
                      className={`px-3 py-1.5 transition-colors ${item.quantity <= 1 ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100"}`}
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 font-medium border-x border-gray-400 min-w-[32px] text-center select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleIncrease(item.id)}
                      className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-base tracking-tight">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-gray-400 hover:text-red-600 text-lg font-light transition-colors px-1"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border border-gray-400 p-8 bg-white min-w-[320px]">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-4 mb-6">
              Resumen de Orden
            </h2>

            <div className="space-y-4 text-xs uppercase font-medium tracking-wider text-gray-500 mb-8">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-black">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-4">
                <span>Envío Estimado</span>
                <span className="font-bold text-black">
                  ${shippingCost.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline mb-8">
              <span className="text-sm font-bold uppercase tracking-wider">
                Total
              </span>
              <span className="text-2xl font-bold tracking-tight">
                ${total.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col gap-4 items-center w-full">
              <AppLink to="/checkout" state={{ items: cartItems, subtotal: subtotal }} className="w-full">
                <Button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-xs text-center justify-center">
                  Finalizar Pedido
                </Button>
              </AppLink>

              <AppLink
                variant="underline"
                to="/home"
                className="text-xs font-bold uppercase tracking-widest text-black mt-2 inline-block text-center"
              >
                Continuar Comprando
              </AppLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
