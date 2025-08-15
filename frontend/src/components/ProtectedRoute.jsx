// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // If no token, redirect to login
  if (!token) return <Navigate to="/login" replace />;

  // If role is specified and doesn't match, redirect to login
  if (role && role !== userRole) return <Navigate to="/login" replace />;

  return children;
}
