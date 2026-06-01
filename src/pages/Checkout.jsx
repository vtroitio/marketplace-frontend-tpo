import { useLocation, Navigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export function Checkout() {
  const location = useLocation();
  
  const checkoutItems = location.state?.items;
  const subtotal = location.state?.subtotal;

  if (!checkoutItems || checkoutItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const shippingCost = 15.00;
  const total = subtotal + shippingCost;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-white text-black font-sans">
      
      <div className="border-b border-black pb-3 mb-12">
        <h1>Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        
        <div className="lg:col-span-2 space-y-12">
          
          <div>
            <div className="border-b border-gray-200 pb-2 mb-6">
              <h2>Shipping Details</h2>
            </div>
            <div className="space-y-4">
              <Input label="FULL NAME" type="text" placeholder="Enter your name" required />
              <Input label="ADDRESS" type="text" placeholder="Enter your address" required />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="CITY" type="text" placeholder="City" required />
                <Input label="ZIP CODE" type="text" placeholder="Zip" required />
              </div>
            </div>
          </div>

          <div>
            <div className="border-b border-gray-200 pb-2 mb-6">
              <h2>Payment Method</h2>
            </div>
            <div className="space-y-4">
              <Input label="CARD NUMBER" type="text" placeholder="0000 0000 0000 0000" required />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="EXPIRATION" type="text" placeholder="MM/YY" required />
                <Input label="CVV" type="text" placeholder="123" required />
              </div>
            </div>
          </div>

        </div>

        <div className="border border-gray-400 p-8 bg-white min-w-[320px]">
          
          <div className="mb-6">
            <h2>Order Summary</h2>
          </div>
          
          <div className="divide-y divide-gray-200 mb-6">
            {checkoutItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 gap-4">
                <div className="flex items-center gap-3">
                  
                  <div className="w-12 h-12 border border-gray-300 p-0.5 flex-shrink-0">
                    <img 
                      src={item.image || "https://picsum.photos/id/26/50/50"} 
                      alt={item.name} 
                      className="w-full h-full object-cover grayscale" 
                    />
                  </div>
                  
                  <div>
                    <h4>{item.name}</h4>
                    <p>Talla: {item.size || 'U'} | Color: {item.color || 'N/A'} | Cant: {item.quantity}</p>
                  </div>
                  
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <strong>${shippingCost.toFixed(2)}</strong>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-baseline border-t border-black pt-4 mb-8">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <Button className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest text-xs text-center justify-center">
            Confirmar Pago
          </Button>
        </div>

      </div>
    </div>
  );
}