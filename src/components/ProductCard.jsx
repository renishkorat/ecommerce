
import { Link, useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiShoppingCart,
  FiStar,
  FiMinus,
  FiPlus,
  FiZap,
} from "react-icons/fi";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

export default function ProductCard({ product }) {
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
  } = useCart();
  

  const {
    addToWishlist,
    isWishlisted,
    removeFromWishlist,
    wishlist,
  } = useWishlist();

  const { user } = useAuth();
  const navigate = useNavigate();

  const discountPrice = Math.round(
    product.price * (1 - product.discount / 100)
  );

  const cartItem = cart.find(
    (item) => String(item.productId) === String(product.id)
  );

  const quantity = cartItem?.quantity || 0;

  // Add to Cart
  const handleCart = async () => {
    if (!user) return navigate("/login");

    try {
      await addToCart(product);
    } catch (error) {
      alert(error.message);
    }
  };

  // Buy Now
  const handleBuyNow = async () => {
    if (!user) return navigate("/login");

    try {
      if (quantity === 0) {
        await addToCart(product);
      }

      navigate("/checkout");
    } catch (error) {
      alert(error.message);
    }
  };

  // Increase Quantity
  const handleIncrease = async () => {
    try {
      if (quantity < product.stock) {
        await updateQuantity(cartItem.id, quantity + 1);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Decrease Quantity
  const handleDecrease = async () => {
    try {
      if (quantity > 1) {
        await updateQuantity(cartItem.id, quantity - 1);
      } else if (quantity === 1) {
        await removeFromCart(cartItem.id);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Wishlist
  const handleWishlist = async () => {
    if (!user) return navigate("/login");

    try {
      if (isWishlisted(product.id)) {
        const item = wishlist.find(
          (item) =>
            String(item.productId) === String(product.id)
        );

        if (item) await removeFromWishlist(item.id);
      } else {
        await addToWishlist(product);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition group">

      {/* Product Image */}
      <div className="relative bg-slate-100 h-52 overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
        </Link>

        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            {product.discount}% OFF
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:scale-110 transition"
        >
          <FiHeart
            className={
              isWishlisted(product.id)
                ? "text-red-500 fill-red-500"
                : "text-slate-600"
            }
          />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4">
        <p className="text-xs text-blue-600 font-semibold mb-2">
          {product.category}
        </p>

        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-slate-800 line-clamp-2 min-h-12 hover:text-blue-600">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 text-yellow-500 my-2">
          <FiStar className="fill-yellow-400" />
          <span className="text-sm text-slate-600">
            {product.rating}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold">
            ₹{discountPrice.toLocaleString("en-IN")}
          </span>

          {product.discount > 0 && (
            <span className="text-sm text-slate-400 line-through">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Quantity Controls */}
        {quantity > 0 ? (
          <div className="grid grid-cols-2 gap-2">

            {/* Quantity Controls */}
            <div className="flex items-center justify-between bg-blue-600 text-white rounded-lg py-1 px-2">

              <button
                type="button"
                onClick={handleDecrease}
                className="p-2 hover:bg-blue-700 rounded-md"
              >
                <FiMinus size={16} />
              </button>

              <span className="font-bold text-lg">
                {quantity}
              </span>

              <button
                type="button"
                onClick={handleIncrease}
                disabled={quantity >= product.stock}
                className="p-2 hover:bg-blue-700 rounded-md disabled:opacity-40"
              >
                <FiPlus size={16} />
              </button>

            </div>

            {/* Buy Now */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex items-center justify-center gap-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2 font-semibold text-sm transition"
            >
              <FiZap size={16} />
              Buy Now
            </button>
            

          </div>
        ) : (
          /* Add to Cart + Buy Now */
          <div className="grid grid-cols-2 gap-2">

            <button
              type="button"
              onClick={handleCart}
              disabled={product.stock <= 0}
              className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white py-2.5 rounded-lg text-sm font-semibold"
            >
              <FiShoppingCart size={16} />
              Add to Cart
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="flex items-center justify-center gap-1 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-400 text-white py-2.5 rounded-lg text-sm font-semibold"
            >
              <FiZap size={16} />
              Buy Now
            </button>

          </div>
        )}
        {product.stock <= 0 && (
          <p className="text-center text-red-500 text-xs mt-2">
            Out of Stock
          </p>
        )}
      </div>
    </div>
  );
}
