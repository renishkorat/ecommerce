import { useEffect, useState } from "react";
import { FiPackage, FiUsers, FiShoppingBag, FiDollarSign } from "react-icons/fi";
import api from "../../services/api";
import Loader from "../../components/Loader";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get("/products"),
      api.get("/users"),
      api.get("/orders"),
    ])
      .then(([products, users, orders]) => {
        setStats({
          products: products.data.length,
          users: users.data.filter((u) => u.role !== "admin").length,
          orders: orders.data.length,
          revenue: orders.data.reduce((sum, order) => sum + Number(order.total), 0),
        });
      })
      .catch(() => alert("Dashboard loading failed"));
  }, []);

  if (!stats) return <Loader />;

  const cards = [
    [FiPackage, "Total Products", stats.products, "bg-blue-100 text-blue-600"],
    [FiUsers, "Total Users", stats.users, "bg-green-100 text-green-600"],
    [FiShoppingBag, "Total Orders", stats.orders, "bg-orange-100 text-orange-600"],
    [FiDollarSign, "Total Revenue", `₹${stats.revenue.toLocaleString("en-IN")}`, "bg-purple-100 text-purple-600"],
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-slate-500 mb-8">Welcome to your admin panel.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map(([Icon, title, value, color]) => (
          <div key={title} className="bg-white rounded-xl p-6 shadow-sm">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={24} />
            </div>
            <p className="text-slate-500 mt-5">{title}</p>
            <h2 className="text-2xl font-bold mt-2">{value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}