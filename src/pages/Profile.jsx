
import { useEffect, useState } from "react";
import { FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      showToast("Please fill all fields", "error");
      return;
    }

    setLoading(true);

    try {
      const { data: users } = await api.get("/users", {
        params: { email: email.trim() },
      });

      if (
        users.some(
          (item) => String(item.id) !== String(user.id)
        )
      ) {
        throw new Error("Email already in use");
      }

      await updateProfile({
        name: name.trim(),
        email: email.trim(),
      });

      showToast("Profile updated successfully!", "success");
    } catch (error) {
      showToast(error.message || "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-12">

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

      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold mb-7">
          My Profile
        </h1>

        <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-bold mb-6">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block font-semibold mb-2">
              Full Name
            </label>

            <input
              // required
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Email
            </label>

            <input
              required
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Account Type
            </label>

            <input
              disabled
              className="input-field bg-slate-100"
              value={user?.role || ""}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading ? "Saving..." : "Update Profile"}
          </button>

        </form>
      </div>
    </div>
  );
}
