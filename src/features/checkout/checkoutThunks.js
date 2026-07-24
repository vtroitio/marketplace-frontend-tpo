import { createAsyncThunk } from "@reduxjs/toolkit";
import { checkoutOrder } from "../../api/orders";
import { validateCoupon } from "../../api/coupons";
import { validateCartForCheckout, reloadCart } from "../cart";

export const initializeCheckout = createAsyncThunk(
  "checkout/initializeCheckout",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const validationResult = await dispatch(
        validateCartForCheckout(),
      ).unwrap();

      if (!validationResult.ok) {
        return rejectWithValue({
          status: validationResult.status || "INVALID_CART",
          message:
            validationResult.message ||
            "Se actualizaron algunos productos del carrito.",
          issues: validationResult.issues ?? [],
          redirectTo: "/cart",
        });
      }

      return {
        ok: true,
        status: "CHECKOUT_READY",
        message: "Checkout listo.",
        issues: [],
      };
    } catch (error) {
      return rejectWithValue({
        status: "ERROR",
        message: error.message || "No se pudo validar el carrito.",
        issues: [],
        redirectTo: "/cart",
      });
    }
  },
);

export const applyCheckoutCoupon = createAsyncThunk(
  "checkout/applyCoupon",
  async (_, { getState, rejectWithValue }) => {
    const couponCode = getState().checkout.couponCode.trim();

    if (!couponCode) {
      return rejectWithValue({
        status: "EMPTY_COUPON",
        message: "Ingresá un código de cupón.",
      });
    }

    try {
      const response = await validateCoupon(couponCode);

      return {
        code: response.code,
        discountAmount: Number(response.discountAmount ?? 0),
        totalAfterDiscount: Number(response.totalAfterDiscount ?? 0),
        message: response.message || "Cupón aplicado correctamente.",
      };
    } catch (error) {
      return rejectWithValue({
        status: "INVALID_COUPON",
        message: error.message || "No se pudo aplicar el cupón.",
      });
    }
  },
);

export const confirmCheckout = createAsyncThunk(
  "checkout/confirmCheckout",
  async (formData, { dispatch, getState, rejectWithValue }) => {
    try {
      const validationResult = await dispatch(
        validateCartForCheckout(),
      ).unwrap();

      if (!validationResult.ok) {
        return rejectWithValue({
          status: validationResult.status || "INVALID_CART",
          message:
            validationResult.message ||
            "Se actualizaron algunos productos del carrito.",
          issues: validationResult.issues ?? [],
          redirectTo: "/cart",
        });
      }

      const { appliedCoupon, couponCode } = getState().checkout;

      const normalizedCouponCode = appliedCoupon?.code ?? couponCode.trim();

      const order = await checkoutOrder({
        fullName: formData.fullName,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        couponCode: normalizedCouponCode,
        cardNumber: formData.cardNumber,
        cardExpiration: formData.cardExpiration,
        cardCvv: formData.cardCvv,
      });

      await dispatch(reloadCart());

      return order;
    } catch (error) {
      return rejectWithValue({
        status: "ERROR",
        message: error.message || "No se pudo confirmar la compra.",
      });
    }
  },
);
