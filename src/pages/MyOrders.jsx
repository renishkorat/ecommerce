import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders", { params: { userId: user.id } })
      .then((res) => setOrders(res.data))
      .catch(() => alert("Orders could not be loaded"))
      .finally(() => setLoading(false));
  }, [user.id]);

  if (loading) return <Loader />;

  return (
    <div className="container-custom py-10">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white p-10 rounded-xl text-center">
          <h2 className="font-bold text-xl">No orders yet</h2>
          <p className="text-slate-500 mt-2">Your orders will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex flex-wrap justify-between gap-4 border-b pb-4">
                <div>
                  <h2 className="font-bold">Order #{order.id}</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div className="text-right">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {order.status}
                  </span>
                  <p className="font-bold mt-2">
                    ₹{Number(order.total).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mt-5">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-slate-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-sm text-slate-500 mt-5">
                Delivery: {order.address}, {order.city} - {order.pincode}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}