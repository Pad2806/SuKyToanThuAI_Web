import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth(); // 👈 QUAN TRỌNG
  const location = useLocation();

  // 👉 chưa login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 👉 admin không được vào route user
  if (user.role === "admin" && location.pathname !== "/admin") {
    return <Navigate to="/admin" replace />;
  }

  // 👉 hỗ trợ cả 2 kiểu dùng
  if (children) return children;

  return <Outlet />;
}