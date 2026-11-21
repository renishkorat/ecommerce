
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // Normal User Session
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  // Separate Admin Session
  const [admin, setAdmin] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("admin")) || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Verify User and Admin from Database
  useEffect(() => {
    const verifySessions = async () => {
      try {
        const savedUser = JSON.parse(
          sessionStorage.getItem("user") || "null"
        );

        const savedAdmin = JSON.parse(
          sessionStorage.getItem("admin") || "null"
        );

        // Verify Normal User
        if (savedUser?.id) {
          try {
            const { data } = await api.get(
              `/users/${savedUser.id}`
            );

            if (data && data.role !== "admin") {
              setUser(data);
              sessionStorage.setItem("user", JSON.stringify(data));
            } else {
              setUser(null);
              sessionStorage.removeItem("user");
            }
          } catch {
            setUser(null);
            sessionStorage.removeItem("user");
          }
        } else {
          setUser(null);
          sessionStorage.removeItem("user");
        }

        // Verify Admin
        if (savedAdmin?.id) {
          try {
            const { data } = await api.get(
              `/users/${savedAdmin.id}`
            );

            if (data && data.role === "admin") {
              setAdmin(data);
              sessionStorage.setItem("admin", JSON.stringify(data));
            } else {
              setAdmin(null);
              sessionStorage.removeItem("admin");
            }
          } catch {
            setAdmin(null);
            sessionStorage.removeItem("admin");
          }
        } else {
          setAdmin(null);
          sessionStorage.removeItem("admin");
        }

      } finally {
        setAuthChecking(false);
      }
    };

    verifySessions();
  }, []);

  // User Login
  const login = async (email, password) => {
    setLoading(true);

    try {
      const { data } = await api.get("/users", {
        params: { email },
      });

      if (!Array.isArray(data)) {
        throw new Error("User service is unavailable");
      }

      const foundUser = data.find(
        (item) =>
          item.password === password &&
          item.role !== "admin"
      );

      if (!foundUser) {
        throw new Error("Invalid user email or password");
      }

      setUser(foundUser);
      sessionStorage.setItem("user", JSON.stringify(foundUser));

      return foundUser;
    } finally {
      setLoading(false);
    }
  };

  // Admin Login
  const adminLogin = async (email, password) => {
    setLoading(true);

    try {
      const { data } = await api.get("/users", {
        params: { email },
      });

      if (!Array.isArray(data)) {
        throw new Error("Admin service is unavailable");
      }

      const foundAdmin = data.find(
        (item) =>
          item.password === password &&
          item.role === "admin"
      );

      if (!foundAdmin) {
        throw new Error("Invalid admin email or password");
      }

      setAdmin(foundAdmin);
      sessionStorage.setItem("admin", JSON.stringify(foundAdmin));

      return foundAdmin;
    } finally {
      setLoading(false);
    }
  };

  // User Registration
  const register = async (name, email, password) => {
    setLoading(true);

    try {
      const { data } = await api.get("/users", {
        params: { email },
      });

      if (data.length > 0) {
        throw new Error("Email already registered");
      }

      const { data: newUser } = await api.post("/users", {
        name,
        email,
        password,
        role: "user",
      });

      setUser(newUser);
      sessionStorage.setItem("user", JSON.stringify(newUser));

      return newUser;
    } finally {
      setLoading(false);
    }
  };

  // User Logout
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  // Admin Logout
  const adminLogout = () => {
    setAdmin(null);
    sessionStorage.removeItem("admin");
  };

  // Update User Profile
  const updateProfile = async (updatedData) => {
    const { data } = await api.patch(
      `/users/${user.id}`,
      updatedData
    );

    setUser(data);
    sessionStorage.setItem("user", JSON.stringify(data));

    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        authChecking,
        login,
        adminLogin,
        register,
        logout,
        adminLogout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
