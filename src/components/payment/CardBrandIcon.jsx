import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCreditCard,
} from "react-icons/fa";

export function CardBrandIcon({ cardType, className }) {
  const icons = {
    "visa": <FaCcVisa className="size-6" />,
    "mastercard": <FaCcMastercard className="size-6" />,
    "american-express": <FaCcAmex className="size-6" />,
  };

  return (
    <span className={className}>
      {icons[cardType] || <FaCreditCard className="size-6" />}
    </span>
  );
}
