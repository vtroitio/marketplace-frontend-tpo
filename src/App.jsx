import { AppRoutes } from "./routes/AppRoutes";
import { ScrollToTop } from "./components/ScrollToTop";
import { AuthInitializer } from "./features/auth";

export default function App() {
  return (
    <AuthInitializer>
      <ScrollToTop />
      <AppRoutes />
    </AuthInitializer>
  );
}