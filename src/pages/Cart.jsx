import { Link } from "react-router-dom";
import { FiTrash2, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    cart,
    totalPrice,
    updateQuantity,
    removeFromCart,
    getPrice,
  } = useCart();

  const shipping = totalPrice >= 999 || totalPrice === 0 ? 0 : 49;

  if (cart.length === 0) {
    return (
      <div className="container-custom py-24 text-center">
        <FiShoppingBag className="mx-auto text-6xl text-slate-300" />
        <h1 className="text-3xl font-bold mt-5">Your Cart is Empty</h1>
        <p className="text-slate-500 mt-3">Add products to get started.</p>
        <Link to="/products" className="btn-primary inline-block mt-6">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-4 flex flex-col sm:flex-row gap-5 shadow-sm"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full sm:w-32 h-32 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h3 className="font-bold text-lg">{item.title}</h3>

                <p className="text-blue-600 font-bold mt-2">
                  ₹{Math.round(getPrice(item)).toLocaleString("en-IN")}
                </p>

                <div className="flex items-center gap-4 mt-4">
                  <button
                    disabled={item.quantity <= 1}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="border rounded-lg w-9 h-9 disabled:opacity-40"
                  >
                    -
                  </button>

                  <span className="font-bold">{item.quantity}</span>

                  <button
                    disabled={item.quantity >= item.stock}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="border rounded-lg w-9 h-9 disabled:opacity-40"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 ml-auto flex items-center gap-2"
                  >
                    <FiTrash2 /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>

          <div className="flex justify-between mb-4">
            <span>Subtotal</span>
            <span>₹{Math.round(totalPrice).toLocaleString("en-IN")}</span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
          </div>

          <hr className="my-5" />

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>₹{Math.round(totalPrice + shipping).toLocaleString("en-IN")}</span>
          </div>

          <Link to="/checkout" className="btn-primary block text-center mt-7">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}