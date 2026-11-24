
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import {
  FiShoppingCart,
  FiHeart,
  FiStar,
} from "react-icons/fi";

import api from "../services/api";
import Loader from "../components/Loader";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  const {
    addToWishlist,
    isWishlisted,
    wishlist,
    removeFromWishlist,
  } = useWishlist();

  const { user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Check whether product was opened from Deals page
  const showUpcomingDeal =
    location.state?.fromDeals === true &&
    location.state?.isUpcoming === true;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Product loading error:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

    // Automatically update product every 5 seconds
    const interval = setInterval(() => {
      fetchProduct();
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <Loader />;

  if (!product) {
    return (
      <div className="text-center py-20">
        Product not found.
      </div>
    );
  }

  const discountedPrice = Math.round(
    product.price * (1 - product.discount / 100)
  );

  // Add to Cart
  const handleCart = async () => {
    if (!user) return navigate("/login");

    try {
      await addToCart(product);
      alert("Added to cart!");
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
    <div className="container-custom py-10">

      <Link
        to="/products"
        className="text-blue-600 mb-7 inline-block"
      >
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-2xl p-5 md:p-10 shadow-sm">

        {/* Product Image */}
        <div className="bg-slate-100 rounded-xl overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-[350px] md:h-[480px] object-cover"
          />
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-center">

          <span className="text-blue-600 font-semibold">
            {product.category}
          </span>

          <h1 className="text-3xl font-bold mt-3">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-4 text-yellow-500">
            <FiStar className="fill-yellow-400" />

            <span className="text-slate-700">
              {product.rating} / 5
            </span>
          </div>

          {/* Description */}
          <p className="text-slate-500 leading-7 mt-5">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center gap-3 mt-6">
            <span className="text-3xl font-extrabold">
              ₹{discountedPrice.toLocaleString("en-IN")}
            </span>

            <span className="line-through text-slate-400">
              ₹{product.price.toLocaleString("en-IN")}
            </span>

            <span className="text-green-600 font-bold">
              {product.discount}% OFF
            </span>
          </div>

          {/* Stock */}
          <p
            className={`mt-5 font-semibold ${
              product.stock > 0
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {product.stock > 0
              ? `${product.stock} items available`
              : "Out of Stock"}
          </p>

          {/* Deal Status / Product Buttons */}
          {showUpcomingDeal ? (
            <div className="mt-7">
              <button
                type="button"
                disabled
                className="w-full bg-orange-100 text-orange-700 py-3 rounded-lg font-semibold cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 mt-7">

              <button
                onClick={handleCart}
                disabled={product.stock <= 0}
                className="btn-primary flex items-center justify-center gap-2 disabled:bg-slate-400"
              >
                <FiShoppingCart />
                Add to Cart
              </button>

              <button
                onClick={handleWishlist}
                className="border border-slate-300 rounded-lg px-5 py-3 flex justify-center items-center gap-2"
              >
                <FiHeart
                  className={
                    isWishlisted(product.id)
                      ? "text-red-500 fill-red-500"
                      : ""
                  }
                />
                Wishlist
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
