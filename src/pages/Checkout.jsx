import { useLocation, Navigate } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export function Checkout() {
  const location = useLocation();

  const checkoutItems = location.state?.items;
  const subtotal = location.state?.subtotal;

  if (!checkoutItems || checkoutItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const shippingCost = 15.0;
  const total = subtotal + shippingCost;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-white text-black font-sans">
      <div className="border-b border-black pb-3 mb-12">
        <h1 className="text-4xl font-bold uppercase tracking-tight">
          Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        <div className="lg:col-span-2 space-y-12">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-200 pb-2 mb-6">
              Shipping Details
            </h2>
            <div className="space-y-4">
              <Input
                label="FULL NAME"
                type="text"
                placeholder="Enter your name"
                required
              />
              <Input
                label="ADDRESS"
                type="text"
                placeholder="Enter your address"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="CITY" type="text" placeholder="City" required />
                <Input
                  label="ZIP CODE"
                  type="text"
                  placeholder="Zip"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider border-b border-gray-200 pb-2 mb-6">
              Payment Method
            </h2>
            <div className="space-y-4">
              <Input
                label="CARD NUMBER"
                type="text"
                placeholder="0000 0000 0000 0000"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="EXPIRATION"
                  type="text"
                  placeholder="MM/YY"
                  required
                />
                <Input label="CVV" type="text" placeholder="123" required />
              </div>
            </div>
          </div>
        </div>

        <div className="border border-gray-400 p-8 bg-white min-w-[320px]">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">
            Order Summary
          </h2>

          <div className="divide-y divide-gray-200 mb-6">
            {checkoutItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3 gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 border border-gray-300 p-0.5 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 uppercase">
                      Talla: {item.size || "U"} | Color: {item.color || "N/A"} |
                      Cant: {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-baseline border-t border-black pt-4 mb-8">
            <span className="text-sm font-bold uppercase tracking-wider text-black">Total</span>
            <span className="text-2xl font-bold tracking-tight text-black">${total.toFixed(2)}</span>
          </div>
          
          <Button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-xs text-center justify-center">
            Confirmar Pago
          </Button>
        </div>
      </div>
    </div>
  );
}
