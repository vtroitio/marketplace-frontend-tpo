import { BecomeSellerView } from "./BecomeSellerView";
import { SellerView } from "./SellerView";
import { useAuth } from "../../auth/AuthContext";
import { hasRole, ROLES } from "../../helpers/roles";

export function SellPage() {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    return <BecomeSellerView />;
  }

  if (userRole === ROLES.BUYER) {
    return <BecomeSellerView />;
  }

  if (hasRole(ROLES.SELLER, userRole)) {
    return <SellerView />;
  }

  return <BecomeSellerView />;
}
