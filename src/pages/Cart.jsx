import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { AppLink } from "../components/ui/AppLink";
import { useCart } from "../cart/CartContext";
import { useToast } from "../toast/ToastContext";
import { useAuth } from "../auth/AuthContext";
import { formatCurrency } from "../helpers/formatters";

export function Cart() {
  const navigate = useNavigate();
  const toast = useToast();
  const {
    cartItems,
    totalArticles,
    subtotal,
    increaseItem,
    decreaseItem,
    removeItem,
    cartLoading,
    cartError,
  } = useCart();
  const leftColClass = cartItems.length === 0 ? "lg:col-span-3" : "lg:col-span-2";
  const { isAuthenticated, authLoading } = useAuth();

  const shippingCost = 15.0;
  const total = subtotal > 0 ? subtotal + shippingCost : 0;

  const handleIncrease = async (item) => {
    const result = await increaseItem(item.id);
    if (!result.ok) {
      toast.error(result.message, {
        title: "No se pudo aumentar la cantidad",
      });
      return;
    }
  };

  const handleContinueToCheckout = () => {
    if (authLoading) return;

    if (cartItems.length === 0) {
      toast.warning("Tu carrito está vacío.", {
        title: "Carrito vacío",
      });
      return;
    }

    if (!isAuthenticated) {
      toast.info("Iniciá sesión para continuar con la compra.", {
        title: "Autenticación requerida",
      });

      navigate("/login", {
        state: {
          from: "/checkout",
        },
      });

      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-natural text-secondary">
      <div className="flex justify-between items-baseline border-b border-secondary pb-3 mb-12">
        <h2>Tu Compra</h2>

        <div className="text-xs uppercase font-bold tracking-wider text-tertiary">
          {totalArticles} {totalArticles === 1 ? "Artículo" : "Artículos"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        <div className={leftColClass}>
          {cartItems.length === 0 ? (
            <div className="w-full py-12 border border-dashed border-tertiary flex flex-col items-center justify-center text-center min-h-[200px]">
              <div>
                <p>Tu carrito está vacío.</p>

                <AppLink variant="underline" to="/explore">
                  Volver a la tienda
                </AppLink>
              </div>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={item.id}
                className={`border-b border-tertiary py-6 flex items-center justify-between gap-4 ${
                  index === 0 ? "border-t" : ""
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 border border-tertiary p-1 shrink-0 bg-gray-50">
                    <img
                      src={item.image || "https://picsum.photos/id/26/50/50"}
                      alt={item.name}
                      className="w-full h-full object-cover"
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
                  <div className="flex items-center border border-tertiary bg-white">
                    <button
                      onClick={() => decreaseItem(item.id)}
                      disabled={item.quantity <= 1}
                      className={`px-3 py-1.5 transition-colors cursor-pointer ${
                        item.quantity <= 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      -
                    </button>

                    <div className="px-4 py-1.5 font-medium border-x border-tertiary min-w-8 text-center select-none text-sm">
                      {item.quantity}
                    </div>

                    <button
                      onClick={() => handleIncrease(item)}
                      disabled={item.quantity >= item.maxStock}
                      className={`px-3 py-1.5 transition-colors cursor-pointer ${
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
                        {formatCurrency(item.price * item.quantity)}
                      </strong>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-primary text-lg font-light transition-colors px-1 cursor-pointer"
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
          <div className="border border-tertiary p-8 bg-natural min-w-[320px]">
            <div className="border-b border-tertiary pb-4 mb-6">
              <h3>Resumen de Orden</h3>
            </div>

            <div className="space-y-4 text-xs uppercase font-medium tracking-wider text-tertiary mb-8">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <strong className="text-black">
                  {formatCurrency(subtotal)}
                </strong>
              </div>

              <div className="flex justify-between">
                <span>Envío Estimado</span>
                <strong className="text-black">
                  {formatCurrency(shippingCost)}
                </strong>
              </div>
            </div>

            <div className="flex justify-between items-baseline border-t border-tertiary pt-4 mb-8">
              <span>Total</span>

              <div className="text-2xl font-bold tracking-tight text-black">
                <strong>{formatCurrency(total)}</strong>
              </div>
            </div>

            <div className="flex flex-col gap-4 items-center w-full">
              <Button
                fullWidth
                onClick={handleContinueToCheckout}
                disabled={authLoading || cartLoading || cartItems.length === 0}
              >
                Finalizar Pedido
              </Button>
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
