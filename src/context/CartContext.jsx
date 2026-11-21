import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const cartRef = useRef([]);
  const quantityQueueRef = useRef(new Map());
  const pendingQuantityRef = useRef(new Map());

  const updateCart = (updater) => {
    setCart((previous) => {
      const next =
        typeof updater === "function" ? updater(previous) : updater;
      cartRef.current = next;
      return next;
    });
  };

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

      updateCart(data);
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

      updateCart((prev) =>
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

      updateCart((prev) => [...prev, data]);
    }
  };

  const updateQuantity = async (id, quantity) => {
    const item = cartRef.current.find((product) => product.id === id);

    if (!item || quantity < 1 || quantity > item.stock) return;

    pendingQuantityRef.current.set(id, quantity);
    updateCart((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, quantity } : product
      )
    );

    if (quantityQueueRef.current.has(id)) {
      return quantityQueueRef.current.get(id);
    }

    const queue = (async () => {
      try {
        while (pendingQuantityRef.current.has(id)) {
          const nextQuantity = pendingQuantityRef.current.get(id);
          pendingQuantityRef.current.delete(id);

          try {
            const { data } = await api.patch(`/cart/${id}`, {
              quantity: nextQuantity,
            });

            updateCart((prev) =>
              prev.map((product) =>
                product.id === id ? data : product
              )
            );
          } catch (error) {
            if (error.response?.status === 404) {
              pendingQuantityRef.current.delete(id);
              await fetchCart();
              return;
            }
            pendingQuantityRef.current.delete(id);
            await fetchCart();
            throw error;
          }
        }
      } finally {
        quantityQueueRef.current.delete(id);
      }
    })();

    quantityQueueRef.current.set(id, queue);
    return queue;
  };

  const removeFromCart = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
    } catch (error) {
      if (error.response?.status !== 404) throw error;
    }

    updateCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = async () => {
    await Promise.all(
      cartRef.current.map(async (item) => {
        try {
          await api.delete(`/cart/${item.id}`);
        } catch (error) {
          if (error.response?.status !== 404) throw error;
        }
      })
    );

    updateCart([]);
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