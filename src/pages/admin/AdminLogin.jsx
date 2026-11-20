
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShield, FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminLogin(email, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-500 p-4 sm:p-8">

      {/* Main Admin Login Card */}
      <div className="w-full max-w-6xl min-h-[580px] bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* Left Welcome Section */}
        <div className="relative hidden md:flex flex-col justify-center overflow-hidden bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-400 p-10 lg:p-14 text-white">

          {/* Decorative Shapes */}
          <div className="absolute top-12 right-10 w-36 h-36 rounded-full bg-pink-400/40 blur-sm" />

          <div className="absolute bottom-[-50px] left-[-30px] w-40 h-40 rounded-full bg-orange-400/80" />

          <div className="absolute top-1/2 right-[-30px] w-24 h-24 rounded-full bg-pink-400/40" />

          {/* Decorative Lines */}
          <div className="absolute bottom-10 left-8 w-32 h-4 bg-orange-400 rounded-full rotate-[-45deg]" />
          <div className="absolute bottom-20 left-36 w-40 h-4 bg-pink-400/80 rounded-full rotate-[-45deg]" />
          <div className="absolute bottom-8 right-10 w-32 h-5 bg-orange-400 rounded-full rotate-[-45deg]" />
          <div className="absolute bottom-28 right-28 w-28 h-2 bg-pink-300 rounded-full rotate-[-45deg]" />

          {/* Welcome Content */}
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
              <FiShield size={35} />
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Welcome Admin
            </h1>

            <p className="text-white/90 text-sm lg:text-base leading-relaxed max-w-md">
              Manage your ShopEase store from one place.
              Control products, orders, users, and monitor
              your store activities through the admin dashboard.
            </p>
          </div>
        </div>

        {/* Right Admin Login Section */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16">

          <div className="w-full max-w-sm">

            {/* Mobile Heading */}
            <div className="md:hidden text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mx-auto mb-4">
                <FiShield size={32} />
              </div>

              <h1 className="text-3xl font-bold text-violet-600">
                Welcome Admin
              </h1>

              <p className="text-gray-500 mt-2">
                ShopEase Administration
              </p>
            </div>

            <h2 className="text-center text-xl font-bold text-violet-500 mb-10">
              ADMIN LOGIN
            </h2>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-5">
                {error}
              </div>
            )}

            {/* Admin Login Form */}
            <form onSubmit={submit} className="space-y-5">

              {/* Email Input */}
              <div className="relative">
                <FiMail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400"
                  size={18}
                />

                <input
                  type="email"
                  className="w-full h-12 rounded-full bg-violet-50 border border-violet-100 pl-12 pr-5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                  placeholder="Admin Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400"
                  size={18}
                />

                <input
                  type="password"
                  className="w-full h-12 rounded-full bg-violet-50 border border-violet-100 pl-12 pr-5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                  placeholder="Admin Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-48 h-11 mx-auto flex items-center justify-center rounded-full text-white font-semibold text-sm bg-gradient-to-r from-pink-500 to-violet-600 hover:from-violet-600 hover:to-pink-500 shadow-md transition duration-300 disabled:opacity-50"
              >
                {loading ? "LOGGING IN..." : "LOGIN AS ADMIN"}
              </button>

            </form>

            {/* Admin Footer Text */}
            <div className="text-center mt-9">
              <p className="text-xs text-gray-400">
                <FiShield className="inline mr-1" />
                Secure Admin Access
              </p>
              <p className="text-xs text-gray-400 mt-2">
                ShopEase Administration Panel
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
