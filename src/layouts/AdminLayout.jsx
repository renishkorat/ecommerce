
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiLogOut,
} from "react-icons/fi";

export default function AdminLayout() {
  const { adminLogout } = useAuth();
  const navigate = useNavigate();

  const links = [
    [FiGrid, "Dashboard", "/admin"],
    [FiPackage, "Products", "/admin/products"],
    [FiShoppingBag, "Orders", "/admin/orders"],
    [FiUsers, "Users", "/admin/users"],
  ];

  return (
    <div className="min-h-screen bg-slate-100">

      <header className="bg-slate-950 text-white p-5 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          ShopEase Admin
        </h1>

        <button
          onClick={() => {
            adminLogout();
            navigate("/admin-login", { replace: true });
          }}
          className="flex items-center gap-2 text-red-400 hover:text-red-300"
        >
          <FiLogOut />
          Logout
        </button>
      </header>

      <div className="flex flex-col md:flex-row">

        <aside className="bg-white md:w-64 md:min-h-[calc(100vh-68px)] p-4">
          <nav className="flex md:flex-col gap-2 overflow-x-auto">
            {links.map(([Icon, title, path]) => (
              <Link
                key={path}
                to={path}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 whitespace-nowrap"
              >
                <Icon />
                {title}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-8 min-w-0">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
