import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../components/layout";
import { ComponentsPage, HomePage, NotFoundPage } from "../pages";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ComponentsPage />} />

      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
