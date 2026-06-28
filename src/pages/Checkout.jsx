import { useEffect, useState, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { CouponIcon } from "../components/icons";
import { useCart } from "../cart/CartContext";
import { useSelector } from "react-redux";
import { useToast } from "../toast/ToastContext";
import { formatCurrency } from "../helpers/formatters";
import { checkoutOrder } from "../api/orders";
import { validateCoupon } from "../api/coupons";

const shippingCost = 15.0;

const emptyCheckoutForm = {
  fullName: "",
  address: "",
  city: "",
  postalCode: "",
  cardName: "",
  cardExpiration: "",
  cardCvv: "",
};

function getAttributeValue(attribute, fallback = "") {
  if (!attribute) return fallback;

  if (typeof attribute === "string") return attribute;

  return attribute.value ?? attribute.name ?? attribute.code ?? fallback;
}

export function Checkout() {
  const navigate = useNavigate();
  const toast = useToast();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const authLoading = useSelector((state) => state.auth.loading || !state.auth.initialized);

  const {
    cartItems,
    subtotal,
    cartLoading,
    validateCartForCheckout,
    reloadCart,
  } = useCart();

  const validationStartedRef = useRef(false);

  const [formData, setFormData] = useState(emptyCheckoutForm);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [couponLoading, setCouponLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) return;
    if (validationStartedRef.current) return;

    validationStartedRef.current = true;

    async function validate() {
      const result = await validateCartForCheckout();

      if (!result.ok) {
        toast.warning(result.message, {
          title: "Carrito actualizado",
        });

        navigate("/cart", { replace: true });
      }
    }

    validate();
  }, [authLoading, isAuthenticated, validateCartForCheckout, navigate, toast]);

  if (authLoading || cartLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 bg-natural text-secondary">
        <p>Cargando checkout...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: "/checkout" }} replace />;
  }

  if (!cartItems || cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const discountAmount = appliedCoupon?.discountAmount ?? 0;
  const total = subtotal - discountAmount + shippingCost;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyCoupon = async () => {
    const normalizedCode = couponCode.trim();

    if (!normalizedCode) {
      toast.warning("Ingresá un código de cupón.", {
        title: "Cupón vacío",
      });
      return;
    }

    try {
      setCouponLoading(true);

      const response = await validateCoupon(normalizedCode);

      setAppliedCoupon({
        code: response.code,
        discountAmount: Number(response.discountAmount),
        totalAfterDiscount: Number(response.totalAfterDiscount),
      });

      toast.success(response.message || "Cupón aplicado correctamente.", {
        title: "Cupón aplicado",
      });
    } catch (error) {
      setAppliedCoupon(null);

      toast.error(error.message || "No se pudo aplicar el cupón.", {
        title: "Cupón inválido",
      });
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");

    toast.info("Cupón removido.", {
      title: "Cupón",
    });
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();

    try {
      setSubmitLoading(true);

      const validationResult = await validateCartForCheckout();

      if (!validationResult.ok) {
        toast.warning(validationResult.message, {
          title: "Carrito actualizado",
        });

        navigate("/cart", { replace: true });
        return;
      }

      const order = await checkoutOrder({
        fullName: formData.fullName,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        couponCode: appliedCoupon?.code ?? couponCode.trim() ?? null,
        cardNumber: formData.cardNumber,
        cardExpiration: formData.cardExpiration,
        cardCvv: formData.cardCvv,
      });

      await reloadCart?.();

      toast.success("La orden fue creada correctamente.", {
        title: "Compra confirmada",
      });

      navigate(`/orders/${order.id}`, { replace: true });
    } catch (error) {
      toast.error(error.message || "No se pudo confirmar la compra.", {
        title: "Error en checkout",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleConfirmPayment}
      className="max-w-7xl mx-auto px-4 py-12 bg-natural text-secondary"
    >
      <div className="border-b border-secondary pb-3 mb-12">
        <h2>ORDEN DE COMPRA</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
        <div className="lg:col-span-2 space-y-12">
          <div>
            <div className="border-b border-tertiary pb-2 mb-6">
              <h3>Datos de Envío</h3>
            </div>

            <div className="space-y-4">
              <Input
                label="Nombre completo"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Ingresá tu nombre"
                required
              />

              <Input
                label="Dirección"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ingresá tu dirección"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Ciudad"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Ciudad"
                  required
                />

                <Input
                  label="Código postal"
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Código postal"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <div className="border-b border-tertiary pb-2 mb-6">
              <h3>Método de Pago</h3>
            </div>

            <div className="space-y-4">
              <Input
                label="Número de tarjeta"
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="0000 0000 0000 0000"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Fecha de vencimiento"
                  type="text"
                  name="cardExpiration"
                  value={formData.cardExpiration}
                  onChange={handleChange}
                  placeholder="MM/AA"
                  required
                />

                <Input
                  label="CVV"
                  type="text"
                  name="cardCvv"
                  value={formData.cardCvv}
                  onChange={handleChange}
                  placeholder="123"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border border-tertiary p-8 bg-natural min-w-[320px]">
          <div className="mb-6">
            <h3>Resumen del Pedido</h3>
          </div>

          <div className="divide-y divide-tertiary mb-6">
            {cartItems.map((item) => {
              const size = getAttributeValue(item.size, "U");
              const color = getAttributeValue(item.color, "N/A");

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 border border-tertiary p-0.5 shrink-0">
                      <img
                        src={item.image || "https://picsum.photos/id/26/50/50"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <p>{item.name}</p>

                      <span className="text-sm text-tertiary">
                        Talla: {size} | Color: {color} | Cant: {item.quantity}
                      </span>
                    </div>
                  </div>

                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-tertiary pt-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <CouponIcon className="text-secondary" />

              <span className="text-base font-bold uppercase leading-3 tracking-[1.2px]">
                Cupón de descuento
              </span>
            </div>

            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Ingresá tu código"
                name="couponCode"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={couponLoading || Boolean(appliedCoupon)}
              />

              {appliedCoupon ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemoveCoupon}
                  disabled={submitLoading}
                >
                  Quitar
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || submitLoading}
                >
                  {couponLoading ? "Aplicando..." : "Aplicar"}
                </Button>
              )}
            </div>
          </div>

          <div className="border-t border-tertiary pt-4 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-primary">
                  <span>Descuento ({appliedCoupon.code})</span>
                  <strong>-{formatCurrency(discountAmount)}</strong>
                </div>
              )}

              <div className="flex justify-between">
                <span>Costo de envío</span>
                <strong>{formatCurrency(shippingCost)}</strong>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-baseline border-t border-secondary pt-4 mb-8">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>

          <Button
            fullWidth
            type="submit"
            disabled={submitLoading || cartLoading || couponLoading}
          >
            {submitLoading ? "Procesando..." : "Confirmar Pago"}
          </Button>
        </div>
      </div>
    </form>
  );
}
