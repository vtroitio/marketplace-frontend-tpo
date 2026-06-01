import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../components/layout";
import { Cart } from "../pages/Cart";
import { Checkout } from "../pages/Checkout";
import { ComponentsPage, HomePage, NotFoundPage } from "../pages";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ComponentsPage />} />

      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
