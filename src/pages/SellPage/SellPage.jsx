import { useSearchParams } from "react-router-dom";
import { BecomeSellerView } from "./BecomeSellerView";
import { SellerView } from "./SellerView";

export function SellPage() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "buyer";

  if (role === "buyer") return <BecomeSellerView />;
  if (role === "seller") return <SellerView />;

  return <BecomeSellerView />;
}
