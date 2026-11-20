
import { useEffect, useState } from "react";
import { FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";
import api from "../../services/api";
import Loader from "../../components/Loader";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Automatically hide toast after 3.5 seconds
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast]);

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch {
      showToast("Orders loading failed", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/orders/${id}`, { status });

      setOrders((prev) =>
        prev.map((order) => order.id === id ? data : order)
      );

      showToast("Order status updated successfully!", "success");
    } catch {
      showToast("Could not update order", "error");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-lg text-white ${
            toast.type === "success"
              ? "bg-green-600"
              : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <FiCheckCircle size={22} />
          ) : (
            <FiAlertCircle size={22} />
          )}

          <span className="font-medium">
            {toast.message}
          </span>

          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 hover:opacity-75"
          >
            <FiX size={20} />
          </button>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-7">
        Manage Orders
      </h1>

      <div className="bg-white rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full text-left min-w-[750px]">

          <thead className="bg-slate-100">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4">Update Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">

                <td className="p-4">
                  #{order.id}
                </td>

                <td className="p-4">
                  {order.customerName}
                </td>

                <td className="p-4">
                  ₹{order.total}
                </td>

                <td className="p-4">
                  {order.payment}
                </td>

                <td className="p-4">
                  {order.status}
                </td>

                <td className="p-4">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value)
                    }
                    className="input-field min-w-32"
                  >
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

        {orders.length === 0 && (
          <p className="text-center p-10 text-slate-500">
            No orders found.
          </p>
        )}
      </div>
    </div>
  );
}
