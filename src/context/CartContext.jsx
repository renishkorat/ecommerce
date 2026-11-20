import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (!user) {
      setCart([]);
      return;
    }

    fetchCart();
  }, [user?.id]);

  const fetchCart = async () => {
    try {
      const { data } = await api.get("/cart", {
        params: { userId: user.id },
      });

      setCart(data);
    } catch (error) {
      console.error("Cart loading failed", error);
    }
  };

  const addToCart = async (product) => {
    if (!user) throw new Error("Please login first");

    const existing = cart.find(
      (item) => String(item.productId) === String(product.id)
    );

    if (existing) {
      if (existing.quantity >= product.stock) {
        throw new Error("Maximum available stock reached");
      }

      const { data } = await api.patch(`/cart/${existing.id}`, {
        quantity: existing.quantity + 1,
      });

      setCart((prev) =>
        prev.map((item) => item.id === data.id ? data : item)
      );
    } else {
      if (product.stock < 1) throw new Error("Product is out of stock");

      const { data } = await api.post("/cart", {
        userId: user.id,
        productId: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        discount: product.discount,
        stock: product.stock,
        quantity: 1,
      });

      setCart((prev) => [...prev, data]);
    }
  };

  const updateQuantity = async (id, quantity) => {
    const item = cart.find((product) => product.id === id);

    if (!item || quantity < 1 || quantity > item.stock) return;

    const { data } = await api.patch(`/cart/${id}`, { quantity });

    setCart((prev) =>
      prev.map((product) => product.id === id ? data : product)
    );
  };

  const removeFromCart = async (id) => {
    await api.delete(`/cart/${id}`);

    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = async () => {
    await Promise.all(
      cart.map((item) => api.delete(`/cart/${item.id}`))
    );

    setCart([]);
  };

  const getPrice = (item) =>
    item.price * (1 - (item.discount || 0) / 100);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + getPrice(item) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        totalPrice,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
        getPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);