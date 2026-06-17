import { Button } from "../components/ui/Button";
import { AppLink } from "../components/ui/AppLink";
import { useCart } from "../cart/CartContext";

export function Cart() {
  const {
    cartItems,
    totalArticles,
    subtotal,
    increaseItem,
    decreaseItem,
    removeItem,
  } = useCart();

  const shippingCost = 15.0;
  const total = subtotal > 0 ? subtotal + shippingCost : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-white text-black font-sans">
      <div className="flex justify-between items-baseline border-b border-black pb-3 mb-12">
        <h2>Tu Compra</h2>

        <div className="text-xs uppercase font-bold tracking-wider text-gray-400">
          {totalArticles} {totalArticles === 1 ? "Artículo" : "Artículos"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        <div className="lg:col-span-2">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-300">
              <p>Tu carrito está vacío.</p>

              <AppLink variant="underline" to="/explore">
                Volver a la tienda
              </AppLink>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={item.id}
                className={`border-b border-gray-300 py-6 flex items-center justify-between gap-4 ${
                  index === 0 ? "border-t" : ""
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 border border-gray-400 p-1 flex-shrink-0 bg-gray-50">
                    <img
                      src={item.image || "https://picsum.photos/id/26/50/50"}
                      alt={item.name}
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>

                  <div>
                    <h3>{item.name}</h3>
                    <p>
                      Talla: {item.size?.value} | Color: {item.color?.value}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="flex items-center border border-gray-400 bg-white">
                    <button
                      onClick={() => decreaseItem(item.id)}
                      disabled={item.quantity <= 1}
                      className={`px-3 py-1.5 transition-colors ${
                        item.quantity <= 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      -
                    </button>

                    <div className="px-4 py-1.5 font-medium border-x border-gray-400 min-w-[32px] text-center select-none text-sm">
                      {item.quantity}
                    </div>

                    <button
                      onClick={() => increaseItem(item.id)}
                      disabled={item.quantity >= item.maxStock}
                      className={`px-3 py-1.5 transition-colors ${
                        item.quantity >= item.maxStock
                          ? "text-gray-300 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-base tracking-tight">
                      <strong>
                        ${(item.price * item.quantity).toFixed(2)}
                      </strong>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
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
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h3>Resumen de Orden</h3>
            </div>

            <div className="space-y-4 text-xs uppercase font-medium tracking-wider text-gray-500 mb-8">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <strong className="text-black">${subtotal.toFixed(2)}</strong>
              </div>

              <div className="flex justify-between">
                <span>Envío Estimado</span>
                <strong className="text-black">
                  ${shippingCost.toFixed(2)}
                </strong>
              </div>
            </div>

            <div className="flex justify-between items-baseline border-t border-black pt-4 mb-8">
              <span>Total</span>

              <div className="text-2xl font-bold tracking-tight text-black">
                <strong>${total.toFixed(2)}</strong>
              </div>
            </div>

            <div className="flex flex-col gap-4 items-center w-full">
              <AppLink
                to="/checkout"
                state={{ items: cartItems, subtotal }}
                className="w-full"
              >
                <Button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-xs text-center justify-center">
                  Finalizar Pedido
                </Button>
              </AppLink>

              <AppLink variant="underline" to="/explore">
                Continuar Comprando
              </AppLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}