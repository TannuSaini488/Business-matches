import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardLayout from "./layouts/DashboardLayout";
import BuyerList from "./pages/BuyerList";
import SellerList from "./pages/SellerList";
import Matches from "./pages/Matches";
import Tasks from "./pages/Tasks";
import Documents from "./pages/Documents";
import AITools from "./pages/AITools";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="buyers" element={<BuyerList />} />
        <Route path="sellers" element={<SellerList />} />
        <Route path="matches" element={<Matches />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="documents" element={<Documents />} />
        <Route path="ai-tools" element={<AITools />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
