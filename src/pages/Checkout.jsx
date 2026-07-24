import { useEffect, useState, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { CouponIcon } from "../components/icons";
import { CardBrandIcon } from "../components/payment";
import { useToast } from "../toast/ToastContext";
import { formatCurrency } from "../helpers/formatters";
import {
  validatePaymentData,
  getCardNumberInfo,
  formatCardNumber,
} from "../helpers/paymentValidation";
import {
  applyCheckoutCoupon,
  confirmCheckout,
  initializeCheckout,
  removeCheckoutCoupon,
  selectCheckoutTotal,
  setCouponCode,
  CHECKOUT_SHIPPING_COST,
} from "../features/checkout";
import { selectCartSubtotal } from "../features/cart";

const emptyCheckoutForm = {
  fullName: "",
  address: "",
  city: "",
  postalCode: "",
  cardNumber: "",
  cardHolder: "",
  cardExpiration: "",
  cardCvv: "",
};

function getAttributeValue(attribute, fallback = "") {
  if (!attribute) return fallback;

  if (typeof attribute === "string") return attribute;

  return attribute.value ?? attribute.name ?? attribute.code ?? fallback;
}

export function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const cartItems = useSelector((state) => state.cart.items);
  const cartLoading = useSelector((state) => state.cart.loading);
  const subtotal = useSelector(selectCartSubtotal);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const authLoading = useSelector(
    (state) => state.auth.loading || !state.auth.initialized,
  );

  const validationStartedRef = useRef(false);

  const [formData, setFormData] = useState(emptyCheckoutForm);
  const [paymentErrors, setPaymentErrors] = useState({});

  const [cardInfo, setCardInfo] = useState({
    cardType: null,
    cardName: null,
    cvvLength: 3,
    isPotentiallyValid: true,
    isValid: false,
  });

  const couponCode = useSelector((state) => state.checkout.couponCode);
  const appliedCoupon = useSelector((state) => state.checkout.appliedCoupon);
  const discountAmount = useSelector((state) => state.checkout.discountAmount);
  const total = useSelector(selectCheckoutTotal);
  const couponLoading = useSelector((state) => state.checkout.applyingCoupon);
  const submitLoading = useSelector((state) => state.checkout.submitting);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) return;
    if (validationStartedRef.current) return;

    validationStartedRef.current = true;

    async function initialize() {
      const result = await dispatch(initializeCheckout());

      if (initializeCheckout.rejected.match(result)) {
        toast.warning(result.payload?.message || "Carrito actualizado", {
          title: "Carrito actualizado",
        });

        navigate(result.payload?.redirectTo || "/cart", { replace: true });
      }
    }

    initialize();
  }, [dispatch, authLoading, isAuthenticated, navigate, toast]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPaymentErrors((prev) => ({
      ...prev,
      [name]: null,
    }));

    if (name === "cardNumber") {
      const formattedCardNumber = formatCardNumber(value);
      const nextCardInfo = getCardNumberInfo(formattedCardNumber);

      setFormData((prev) => ({
        ...prev,
        cardNumber: formattedCardNumber,
      }));

      setCardInfo(nextCardInfo);

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplyCoupon = async () => {
    try {
      const response = await dispatch(applyCheckoutCoupon());

      toast.success(
        response.payload.message || "Cupón aplicado correctamente.",
        {
          title: "Cupón aplicado",
        },
      );
    } catch (error) {
      toast.error(error.payload?.message || "No se pudo aplicar el cupón.", {
        title: "Cupón inválido",
      });
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCheckoutCoupon());

    toast.info("Cupón removido.", {
      title: "Cupón",
    });
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();

    const payment = validatePaymentData({
      cardNumber: formData.cardNumber,
      cardHolder: formData.fullName,
      expirationDate: formData.cardExpiration,
      cvv: formData.cardCvv,
    });

    if (!payment.isValid) {
      setPaymentErrors(payment.errors);
      return;
    }

    const result = await dispatch(confirmCheckout(formData));

    if (result.payload.paymentStatus !== "APPROVED") {
      toast.error(result.payload.message || "No se pudo confirmar la compra.", {
        title: "Error en checkout",
      });
      navigate("/cart", { replace: true });
      return;
    }

    toast.success("La orden fue creada correctamente.", {
      title: "Compra confirmada",
    });
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
              {paymentErrors.cardHolder && (
                <p className="text-primary">{paymentErrors.cardHolder}</p>
              )}

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
              <div className="flex flex-col gap-2">
                <Input
                  label="Nombre del titular"
                  type="text"
                  name="cardHolder"
                  value={formData.cardHolder}
                  onChange={handleChange}
                  placeholder="Nombre completo"
                  required
                />
                {paymentErrors.cardHolder && (
                  <p className="text-primary">{paymentErrors.cardHolder}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="relative">
                  <Input
                    label="Número de tarjeta"
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="0000 0000 0000 0000"
                    required
                  />
                  <CardBrandIcon
                    className="absolute bottom-5 right-4"
                    cardType={cardInfo.cardType}
                  />
                </div>
                {paymentErrors.cardNumber && (
                  <p className="text-primary">{paymentErrors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Input
                    label="Fecha de vencimiento"
                    type="text"
                    name="cardExpiration"
                    value={formData.cardExpiration}
                    onChange={handleChange}
                    placeholder="MM/AA"
                    required
                  />
                  {paymentErrors.expirationDate && (
                    <p className="text-primary">
                      {paymentErrors.expirationDate}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Input
                    label="CVV"
                    type="text"
                    name="cardCvv"
                    value={formData.cardCvv}
                    onChange={handleChange}
                    placeholder="123"
                    required
                  />
                  {paymentErrors.cvv && (
                    <p className="text-primary">{paymentErrors.cvv}</p>
                  )}
                </div>
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
                onChange={(e) => dispatch(setCouponCode(e.target.value))}
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
                <strong>{formatCurrency(CHECKOUT_SHIPPING_COST)}</strong>
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
