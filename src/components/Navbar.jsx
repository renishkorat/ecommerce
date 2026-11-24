
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiSearch,
  FiMenu,
  FiX,
  FiLogOut,
  FiPackage,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import shopEaseLogo from "../assets/ShopEase.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();

  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(`/?search=${encodeURIComponent(search.trim())}`);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    ["Home", "/"],
    ["Products", "/products"],
    ["Categories", "/categories"],
     ["Deals", "/deals"],
  ];

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="container-custom">

        {/* MOBILE NAVBAR */}
        <div className="md:hidden">

          {/* Top Row */}
          <div className="flex items-center justify-between gap-3 py-3">

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-2xl shrink-0"
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>

             <Link to="/" className="flex items-center">
    <img
        src={shopEaseLogo}
        alt="ShopEase"
        className="h-10 w-auto object-contain"
    />
</Link>


            <div className="flex items-center gap-3 ml-auto">

              {user ? (
                <Link
                  to={user.role === "admin" ? "/admin" : "/profile"}
                >
                  <FiUser size={25} />
                </Link>
              ) : (
                <Link to="/login" className="flex items-center gap-1">
                  <span className="text-xs">Sign in</span>
                  <FiUser size={25} />
                </Link>
              )}

              <Link to="/cart" className="relative">
                <FiShoppingCart size={28} />

                <span className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full text-xs px-1.5">
                  {cartCount}
                </span>
              </Link>

            </div>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex bg-slate-100 rounded-lg overflow-hidden mb-3"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="flex-1 min-w-0 px-4 py-3 outline-none bg-transparent"
            />

            <button
              type="submit"
              className="px-5 bg-blue-600 text-white"
            >
              <FiSearch size={22} />
            </button>
          </form>

          {/* Bottom Navigation */}
          <nav className="flex items-center justify- gap-4 pb-3 text-sm font-medium">

            <Link to="/categories">
              <span className="block text-xs text-gray-500">Shop By</span>
              <span>Category</span>
            </Link>

            <Link to="/products">
              Deals
            </Link>

            <Link to="/products">
              Products
            </Link>

          </nav>

          {/* Mobile Menu */}

          {/* Mobile Sidebar Overlay */}
          {menuOpen && (
            <div
              className="fixed inset-0 z-[60] bg-black/40 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
          )}

          {/* Mobile Sidebar */}
          <div
            className={`fixed top-0 left-0 z-[70] h-full w-72 max-w-[85%] bg-white shadow-xl transform transition-transform duration-300 md:hidden ${menuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between bg-blue-600 text-white px-5 py-5">
              <div className="flex items-center gap-2">
                <FiUser size={24} />
                <span className="font-semibold">
                  {user ? `Hello, ${user.name || "User"}` : "Hello, Sign in"}
                </span>
              </div>

              <button onClick={() => setMenuOpen(false)}>
                <FiX size={25} />
              </button>
            </div>

            {/* Sidebar Links */}
            <div className="p-5 space-y-5 overflow-y-auto h-[calc(100%-75px)]">

              <h3 className="font-bold text-lg">Shop By Category</h3>

              {navLinks.map(([name, path]) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMenuOpen(false)}
                  className="block text-gray-700 hover:text-blue-600"
                >
                  {name}
                </Link>
              ))}

              <hr />

              <h3 className="font-bold text-lg">Your Account</h3>

              <Link
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 text-gray-700"
              >
                <FiHeart /> Wishlist ({wishlist.length})
              </Link>

              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 text-gray-700"
              >
                <FiShoppingCart /> Cart ({cartCount})
              </Link>

              {user && (
                <>
                  <Link
                    to={user.role === "admin" ? "/admin" : "/profile"}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <FiUser /> My Account
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <FiPackage /> My Orders
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-red-500"
                  >
                    <FiLogOut /> Logout
                  </button>
                </>
              )}

              {!user && (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-blue-600"
                >
                  Login / Register
                </Link>
              )}

            </div>
          </div>


        </div>

        {/* DESKTOP NAVBAR - ORIGINAL */}
        <div className="hidden md:block">

          <div className="flex items-center justify-between gap-4 py-4">

      <Link to="/" className="flex items-center">
    <img
        src={shopEaseLogo}
        alt="ShopEase"
        className="h-10 w-auto object-contain"
    />
</Link>

            <form
              onSubmit={handleSearch}
              className="flex flex-1 max-w-xl bg-slate-100 rounded-lg overflow-hidden"
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-3 outline-none bg-transparent"
              />

              <button type="submit" className="px-5 bg-blue-600 text-white">
                <FiSearch size={20} />
              </button>
            </form>

            <div className="flex items-center gap-6">

              <Link to="/wishlist" className="relative">
                <FiHeart size={23} />
                <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full text-xs px-1.5">
                  {wishlist.length}
                </span>
              </Link>

              <Link to="/cart" className="relative">
                <FiShoppingCart size={23} />
                <span className="absolute -top-2 -right-3 bg-blue-600 text-white rounded-full text-xs px-1.5">
                  {cartCount}
                </span>
              </Link>

              {user ? (
                <div className="flex items-center gap-3">
                  <Link to={user.role === "admin" ? "/admin" : "/profile"}>
                    <FiUser size={22} />
                  </Link>
                  <button onClick={handleLogout} title="Logout">
                    <FiLogOut size={21} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn-primary">
                  Login
                </Link>
              )}

            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 pb-4 text-sm font-medium">
            {navLinks.map(([name, path]) => (
              <Link key={path} to={path} className="hover:text-blue-600">
                {name}
              </Link>
            ))}

            {user && (
              <Link to="/orders" className="flex items-center gap-2">
                <FiPackage /> My Orders
              </Link>
            )}
          </nav>

        </div>
      </div>
    </header>
  );
}
