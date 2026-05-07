import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Auth from "./user/pages/auth/auth.jsx";
import Admin from "./admin/pages/admin.jsx";

import Nav from "./user/components/Nav";

import HomeScreen from "./user/pages/HomeScreen";
import LibraryScreen from "./user/pages/LibraryScreen";
import WorkspaceScreen from "./user/pages/WorkspaceScreen";
import AIScreen from "./user/pages/AIScreen";
import ProfileScreen from "./user/pages/ProfileScreen";

// 👉 guard
import ProtectedRoute from "../routes/ProtectedRoute";
import RoleGuard from "../routes/RoleGuard";

// 👉 auth context
import { useAuth } from "../context/AuthContext";

// ================= APP CONTENT =================
function AppContent() {
  const { user } = useAuth();
  const location = useLocation();

  const isAdmin = user?.role === "admin";

  // 👉 ẩn navbar khi login hoặc admin
  const hideNavRoutes = ["/login"];
  const showNav =
    !hideNavRoutes.includes(location.pathname) && !isAdmin;

  return (
    <div id="suky-root">
      {showNav && <Nav />}

      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Auth />} />

        {/* USER */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/library" element={<LibraryScreen />} />
          <Route path="/workspace" element={<WorkspaceScreen />} />
          <Route path="/ai" element={<AIScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Route>

        {/* ADMIN */}
        <Route
          element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={["admin"]} />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<Admin />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

// ================= ROOT APP =================
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}