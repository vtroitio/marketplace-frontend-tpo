import { ProtectedRoute } from "./ProtectedRoute";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../components/layout";
import { Cart } from "../pages/Cart";
import { Checkout } from "../pages/Checkout";
import { ROLES } from "../helpers/roles";
import {
  HomePage,
  LoginPage,
  RegisterPage,
  NotFoundPage,
  SellPage,
  AboutPage,
  ProfilePage,
  ExplorePage,
  ProductDetailPage,
  CreateProductPage,
  EditProductPage,
} from "../pages";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/sell" element={<SellPage />} />
        <Route
          path="/sell/new"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.SELLER, ROLES.ADMIN, ROLES.SUPER_ADMIN]}
            >
              <CreateProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sell/edit/:productId"
          element={
            <ProtectedRoute
              allowedRoles={[ROLES.SELLER, ROLES.ADMIN, ROLES.SUPER_ADMIN]}
            >
              <EditProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/explore/:productId" element={<ProductDetailPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
