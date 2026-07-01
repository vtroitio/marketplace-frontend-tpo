import valid from "card-validator";

export function validatePaymentData(paymentData) {
  const errors = {};

  const cardNumber = valid.number(paymentData.cardNumber);
  const expirationDate = valid.expirationDate(paymentData.expirationDate);
  const cardHolder = valid.cardholderName(paymentData.cardHolder);
  const cvv = valid.cvv(paymentData.cvv);
  const cvvLength = cardNumber.card?.code?.size ?? 3;

  if (!cardNumber.isValid) {
    errors.cardNumber = "El número de tarjeta no es válido.";
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
    cardType: cardNumber.card?.niceType ?? null,
  };
}
