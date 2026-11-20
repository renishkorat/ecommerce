
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiX,
} from "react-icons/fi";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    payment: "COD",
  });

  // Automatically hide toast
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast]);

  // Show Toast
  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });
  };

  const shipping = totalPrice >= 999 ? 0 : 49;
  const grandTotal = totalPrice + shipping;

  // Place Order
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cart.length) {
      showToast("Your cart is empty", "error");
      return;
    }

    if (cart.some((item) => item.quantity > item.stock)) {
      showToast("Some products have insufficient stock", "error");
      return;
    }

    if (!user?.id) {
      showToast("Please login before placing your order", "error");
      return;
    }

    setLoading(true);

    try {
      const orderItems = cart.map((item) => ({
        productId: item.productId,
        title: item.title,
        image: item.image,
        price: item.price,
        discount: item.discount,
        quantity: item.quantity,
      }));

      // Check product stock
      for (const item of cart) {
        const { data: product } = await api.get(
          `/products/${item.productId}`
        );

        if (product.stock < item.quantity) {
          throw new Error(
            `${product.title} is out of stock in the requested quantity`
          );
        }
      }

      // Create Order
      const { data: order } = await api.post("/orders", {
        userId: user.id,
        customerName: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        pincode: form.pincode,
        payment: form.payment,
        items: orderItems,
        total: grandTotal,
        status: "Pending",
        createdAt: new Date().toISOString(),
      });

      // Update Product Stock
      for (const item of cart) {
        const { data: product } = await api.get(
          `/products/${item.productId}`
        );

        await api.patch(`/products/${item.productId}`, {
          stock: product.stock - item.quantity,
        });
      }

      // Clear Cart
      await clearCart();

      // Success Toast
      showToast(
        `Order placed successfully!}`,
        "success"
      );

      // Navigate to My Orders
      setTimeout(() => {
        navigate("/orders");
      }, 1500);

    } catch (error) {
      showToast(
        error.message || "Checkout failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) {
    return (
      <>
        {/* Toast Notification */}
        {toast && (
          <Toast toast={toast} onClose={() => setToast(null)} />
        )}

        <div className="container-custom py-20 text-center">
          <h1 className="text-2xl font-bold">
            Your cart is empty
          </h1>

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="btn-primary mt-5"
          >
            Shop Now
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="container-custom py-10">

      {/* Toast Notification */}
      {toast && (
        <Toast
          toast={toast}
          onClose={() => setToast(null)}
        />
      )}

      <h1 className="text-3xl font-bold mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Checkout Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white p-6 rounded-xl space-y-5"
        >
          <h2 className="text-xl font-bold">
            Delivery Information
          </h2>

          <div>
            <label className="block font-semibold mb-2">
              Full Name
            </label>

            <input
              required
              className="input-field"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Phone Number
            </label>

            <input
              required
              type="tel"
              pattern="[0-9]{10}"
              maxLength={10}
              className="input-field"
              placeholder="10 digit mobile number"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Address
            </label>

            <textarea
              required
              className="input-field"
              rows="3"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              required
              placeholder="City"
              className="input-field"
              value={form.city}
              onChange={(e) =>
                setForm({ ...form, city: e.target.value })
              }
            />

            <input
              required
              placeholder="Pincode"
              pattern="[0-9]{6}"
              maxLength={6}
              className="input-field"
              value={form.pincode}
              onChange={(e) =>
                setForm({ ...form, pincode: e.target.value })
              }
            />
          </div>

          <h2 className="text-xl font-bold pt-3">
            Payment Method
          </h2>

          <select
            className="input-field"
            value={form.payment}
            onChange={(e) =>
              setForm({ ...form, payment: e.target.value })
            }
          >
            <option value="COD">Cash on Delivery</option>
            <option value="UPI">UPI (Demo Only)</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading
              ? "Placing Order..."
              : `Place Order - ₹${Math.round(grandTotal).toLocaleString("en-IN")}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl h-fit">
          <h2 className="text-xl font-bold mb-5">
            Order Summary
          </h2>

          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between gap-3 mb-4 text-sm"
            >
              <span>
                {item.title} × {item.quantity}
              </span>

              <span>
                ₹
                {Math.round(
                  item.price *
                  (1 - (item.discount || 0) / 100) *
                  item.quantity
                )}
              </span>
            </div>
          ))}

          <hr className="my-4" />

          <div className="flex justify-between mb-3">
            <span>Subtotal</span>
            <span>₹{Math.round(totalPrice)}</span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Shipping</span>
            <span>
              {shipping ? `₹${shipping}` : "FREE"}
            </span>
          </div>

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>
              ₹{Math.round(grandTotal).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

// Toast Component
function Toast({ toast, onClose }) {
  const isSuccess = toast.type === "success";

  return (
    <div
      className={`fixed top-5 right-5 z-[9999] w-[calc(100%-2.5rem)] sm:w-96 p-4 rounded-xl shadow-2xl border bg-white flex items-start gap-3 animate-in slide-in-from-right duration-300 ${
        isSuccess
          ? "border-green-200"
          : "border-red-200"
      }`}
    >
      <div
        className={`mt-0.5 ${
          isSuccess ? "text-green-600" : "text-red-600"
        }`}
      >
        {isSuccess ? (
          <FiCheckCircle size={24} />
        ) : (
          <FiAlertCircle size={24} />
        )}
      </div>

      <div className="flex-1">
        <h3
          className={`font-bold ${
            isSuccess ? "text-green-700" : "text-red-700"
          }`}
        >
          {isSuccess ? "Success!" : "Error!"}
        </h3>

        <p className="text-sm text-slate-600 mt-1 break-words">
          {toast.message}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="text-slate-400 hover:text-slate-700"
      >
        <FiX size={20} />
      </button>
    </div>
  );
}
