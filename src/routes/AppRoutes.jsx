import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../components/layout";
import { Cart } from "../pages/Cart";
import { Checkout } from "../pages/Checkout";
import {
  ComponentsPage,
  HomePage,
  LoginPage,
  RegisterPage,
  NotFoundPage,
  SellPage,
  AboutPage,
  CreateProductPage,
  EditProductPage,
} from "../pages";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ComponentsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/sell/new" element={<CreateProductPage />} />
        <Route path="/sell/edit/:productId" element={<EditProductPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
