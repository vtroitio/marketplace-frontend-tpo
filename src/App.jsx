import { AppRoutes } from "./routes/AppRoutes";
import { ScrollToTop } from "./components/ScrollToTop";
import { AppInitializer } from "./features";

export default function App() {
  return (
    <AppInitializer>
      <ScrollToTop />
      <AppRoutes />
    </AppInitializer>
  );
}