
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
  ];

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between gap-4 py-4">
          <Link to="/" className="text-2xl font-extrabold text-blue-600">
            ShopEase<span className="text-orange-500">.</span>
          </Link>

          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl bg-slate-100 rounded-lg overflow-hidden"
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

          <div className="hidden md:flex items-center gap-6">
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

          <button
            type="button"
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
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

        {menuOpen && (
          <div className="md:hidden pb-5 space-y-4">
            <form
              onSubmit={handleSearch}
              className="flex bg-slate-100 rounded-lg"
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full p-3 bg-transparent outline-none"
              />
              <button type="submit" className="px-4 text-blue-600">
                <FiSearch />
              </button>
            </form>

            {navLinks.map(([name, path]) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className="block"
              >
                {name}
              </Link>
            ))}

            <Link to="/cart" onClick={() => setMenuOpen(false)}>
              Cart ({cartCount})
            </Link>

            <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
              Wishlist ({wishlist.length})
            </Link>

            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/profile"}
                  onClick={() => setMenuOpen(false)}
                >
                  My Account
                </Link>
                <button onClick={handleLogout} className="block text-red-500">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login / Register
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
