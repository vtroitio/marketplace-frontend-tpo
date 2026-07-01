import valid from "card-validator";

const ALLOWED_CARD_TYPES = ["visa", "mastercard", "american-express"];

export function onlyDigits(value = "") {
  return value.replace(/\D/g, "");
}

export function formatCardNumber(value = "") {
  const digits = onlyDigits(value).slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

export function getCardNumberInfo(cardNumber = "") {
  const result = valid.number(cardNumber);

  return {
    isValid: result.isValid,
    isPotentiallyValid: result.isPotentiallyValid,
    cardType: result.card?.type ?? null,
    cardName: result.card?.niceType ?? null,
    cvvLength: result.card?.code?.size ?? 3,
  };
}

export function validatePaymentData(paymentData) {
  const errors = {};

  const cardNumber = valid.number(paymentData.cardNumber);
  const expirationDate = valid.expirationDate(paymentData.expirationDate);
  const cardHolder = valid.cardholderName(paymentData.cardHolder);
  const cardType = cardNumber.card?.type ?? null;
  const cvv = valid.cvv(paymentData.cvv);
  const cvvLength = cardNumber.card?.code?.size ?? 3;

  if (!cardNumber.isValid) {
    errors.cardNumber = "El número de tarjeta no es válido.";
  } else if (!ALLOWED_CARD_TYPES.includes(cardType)) {
    errors.cardNumber =
      "Solo se aceptan tarjetas Visa, Mastercard o American Express.";
  }

  if (!cardHolder.isValid) {
    errors.cardHolder = "Ingresá un nombre válido.";
  }

  if (!expirationDate.isValid) {
    errors.expirationDate = "La fecha de vencimiento no es válida.";
  }

  if (!cvv.isValid) {
    errors.cvv = `El código de seguridad debe tener ${cvvLength} dígitos.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    cardType: cardNumber.card?.type ?? null,
    cardName: cardNumber.card?.niceType ?? null,
  };
}
