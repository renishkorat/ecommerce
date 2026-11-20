import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram, FiTwitter, FiMail } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 mt-16">
      <div className="container-custom grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            ShopEase<span className="text-orange-500">.</span>
          </h2>
          <p className="text-sm leading-7">
            Your one-stop destination for quality products and amazing deals.
            Shop smarter, shop better.
          </p>
          <div className="flex gap-4 mt-5 text-xl">
            <FiFacebook />
            <FiInstagram />
            <FiTwitter />
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">Quick Links</h3>
          <div className="flex flex-col gap-3 text-sm">
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/orders">My Orders</Link>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">Customer Service</h3>
          <div className="flex flex-col gap-3 text-sm">
            <Link to="/profile">My Account</Link>
            <Link to="/cart">Shopping Cart</Link>
            <Link to="/wishlist">Wishlist</Link>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold mb-4">Contact Us</h3>
          <p className="text-sm mb-3">Have questions? Get in touch with us.</p>
          <p className="flex items-center gap-2 text-sm">
            <FiMail /> support@shopease.com
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800 text-center py-5 text-sm">
        © 2026 ShopEase. All rights reserved.
      </div>
    </footer>
  );
}