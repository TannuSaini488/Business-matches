import { Outlet, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function DashboardLayout() {

   const navigate = useNavigate();

  const handleLogout = () => {
    // Remove stored user info
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    // Redirect to login page
    navigate("/login");
  };
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <nav className="space-y-2">
          <Link to="/dashboard/buyers" className="block hover:bg-gray-700 p-2 rounded">Buyers</Link>
          <Link to="/dashboard/sellers" className="block hover:bg-gray-700 p-2 rounded">Sellers</Link>
          <Link to="/dashboard/matches" className="block hover:bg-gray-700 p-2 rounded">Matches</Link>
          <Link to="/dashboard/tasks" className="block hover:bg-gray-700 p-2 rounded">Tasks</Link>
          <Link to="/dashboard/documents" className="block hover:bg-gray-700 p-2 rounded">Documents</Link>
          <Link to="/dashboard/ai-tools" className="block hover:bg-gray-700 p-2 rounded">AI Tools</Link>
          <Link to="/dashboard/profile" className="block hover:bg-gray-700 p-2 rounded">Profile</Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left hover:bg-gray-700 p-2 rounded"
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}
