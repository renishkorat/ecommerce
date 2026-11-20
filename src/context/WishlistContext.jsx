import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }

    fetchWishlist();
  }, [user?.id]);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get("/wishlist", {
        params: { userId: user.id },
      });

      setWishlist(data);
    } catch (error) {
      console.error("Wishlist loading failed", error);
    }
  };

  const addToWishlist = async (product) => {
    if (!user) throw new Error("Please login first");

    const exists = wishlist.find(
      (item) => String(item.productId) === String(product.id)
    );

    if (exists) return;

    const { data } = await api.post("/wishlist", {
      userId: user.id,
      productId: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
      discount: product.discount,
    });

    setWishlist((prev) => [...prev, data]);
  };

  const removeFromWishlist = async (id) => {
    await api.delete(`/wishlist/${id}`);

    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const isWishlisted = (productId) =>
    wishlist.some(
      (item) => String(item.productId) === String(productId)
    );

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);