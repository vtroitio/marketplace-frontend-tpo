import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../components/layout";
import { ComponentsPage, HomePage, NotFoundPage } from "../pages";
import { ExplorePage } from "../pages/ExplorePage";
import { ProductDetailPage } from "../pages/ProductDetailPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ComponentsPage />} />

      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/explore/:productId" element={<ProductDetailPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
