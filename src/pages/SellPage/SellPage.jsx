import { BecomeSellerView } from "./BecomeSellerView";
import { SellerView } from "./SellerView";
import { Spinner } from "../../components/ui";
import { useSelector } from "react-redux";
import { hasRole, ROLES } from "../../helpers/roles";

export function SellPage() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const currentUser = useSelector((state) => state.auth.user);
  const authLoading = useSelector((state) => state.auth.loading || !state.auth.initialized);

  if (authLoading) {
    return (
      <div className="flex flex-col items-center gap-4 container mx-auto py-32">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <BecomeSellerView />;
  }

  if (currentUser?.role.code === ROLES.BUYER) {
    return <BecomeSellerView />;
  }

  if (hasRole(ROLES.SELLER, currentUser?.role.code)) {
    return <SellerView />;
  }

  return <BecomeSellerView />;
}
