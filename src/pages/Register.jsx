
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-500 p-4 sm:p-8">

      {/* Main Register Card */}
      <div className="w-full max-w-6xl min-h-[620px] bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

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
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Join ShopEase
            </h1>

            <p className="text-white/90 text-sm lg:text-base leading-relaxed max-w-md">
              Create your account and start shopping with ShopEase.
              Discover amazing products, exclusive offers, and enjoy
              a smooth shopping experience.
            </p>
          </div>
        </div>

        {/* Right Register Section */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
          <div className="w-full max-w-sm">

            {/* Mobile Heading */}
            <div className="md:hidden text-center mb-8">
              <h1 className="text-3xl font-bold text-violet-600">
                Join ShopEase
              </h1>
              <p className="text-gray-500 mt-2">
                Create your new account
              </p>
            </div>

            <h2 className="text-center text-xl font-bold text-violet-500 mb-8">
              CREATE ACCOUNT
            </h2>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-5">
                {error}
              </div>
            )}

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div className="relative">
                <FiUser
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400"
                  size={18}
                />

                <input
                  required
                  minLength={2}
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full h-12 rounded-full bg-violet-50 border border-violet-100 pl-12 pr-5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <FiMail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400"
                  size={18}
                />

                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="w-full h-12 rounded-full bg-violet-50 border border-violet-100 pl-12 pr-5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                />
              </div>

              {/* Password with Show/Hide */}
              <div className="relative">
                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400"
                  size={18}
                />

                <input
                  required
                  minLength={6}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (minimum 6 characters)"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full h-12 rounded-full bg-violet-50 border border-violet-100 pl-12 pr-12 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-violet-400 hover:text-violet-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FiEyeOff size={19} />
                  ) : (
                    <FiEye size={19} />
                  )}
                </button>
              </div>

              {/* Confirm Password with Show/Hide */}
              <div className="relative">
                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400"
                  size={18}
                />

                <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full h-12 rounded-full bg-violet-50 border border-violet-100 pl-12 pr-12 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-violet-400 hover:text-violet-700"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={19} />
                  ) : (
                    <FiEye size={19} />
                  )}
                </button>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-40 h-11 mx-auto flex items-center justify-center rounded-full text-white font-semibold text-sm bg-gradient-to-r from-pink-500 to-violet-600 hover:from-violet-600 hover:to-pink-500 shadow-md transition duration-300 disabled:opacity-50"
              >
                {loading ? "CREATING..." : "REGISTER"}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-500 mt-8">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-violet-600 font-bold hover:text-pink-500"
              >
                Login
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
