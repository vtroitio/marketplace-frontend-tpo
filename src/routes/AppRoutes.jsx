import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../components/layout";
import { ComponentsPage } from "../pages";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ComponentsPage />} />
      <Route element={<MainLayout />}>
        <Route path="/home" element={<h1>Home</h1>} />
      </Route>
    </Routes>
  );
}
