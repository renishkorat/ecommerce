import { Link } from "react-router-dom";
import { FiHeart, FiTrash2 } from "react-icons/fi";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (item) => {
    try {
      await addToCart({
        ...item,
        id: item.productId,
        stock: 100,
      });
      alert("Added to cart!");
    } catch (error) {
      alert(error.message);
    }
  };

  if (!wishlist.length) {
    return (
      <div className="container-custom py-24 text-center">
        <FiHeart className="text-6xl text-slate-300 mx-auto" />
        <h1 className="text-3xl font-bold mt-5">Your Wishlist is Empty</h1>
        <Link to="/products" className="btn-primary inline-block mt-6">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-10">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <Link to={`/product/${item.productId}`}>
              <img src={item.image} alt={item.title} className="h-52 w-full object-cover" />
            </Link>

            <div className="p-4">
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-blue-600 font-bold mt-2">
                ₹{Math.round(item.price * (1 - (item.discount || 0) / 100))}
              </p>

              <button
                onClick={() => handleAddToCart(item)}
                className="btn-primary w-full mt-4"
              >
                Add to Cart
              </button>

              <button
                onClick={() => removeFromWishlist(item.id)}
                className="w-full text-red-500 mt-4 flex justify-center items-center gap-2"
              >
                <FiTrash2 /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}