import { BecomeSellerView } from "./BecomeSellerView";
import { SellerView } from "./SellerView";
import { getUserRole } from "../../helpers/authStorage";
import { hasRole, ROLES } from "../../helpers/roles";

export function SellPage() {
  const userRole = getUserRole();

  if (ROLES.BUYER === userRole) return <BecomeSellerView />;
  if (hasRole(ROLES.SELLER, userRole)) return <SellerView />;

  return <BecomeSellerView />;
}
