import { useState, type FC, type PropsWithChildren, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { BASE_URL } from "../../api/baseUrl";

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [myOrders, setMyOrders] = useState([]);

  // Check authentication status on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoadingAuth(true);
    try {
      const response = await fetch(`${BASE_URL}/user/me`, {
        method: "GET",
        credentials: "include", // Include cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUsername(userData.username);
        setUserRole(userData.role || "user");
        setIsAuthenticated(true);
      } else {
        // Not authenticated
        setUsername(null);
        setUserRole(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUsername(null);
      setUserRole(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        credentials: "include", // Include cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setUsername(`${data.user.firstName} ${data.user.lastName}`);
        setUserRole(data.user.role || "user");
        setIsAuthenticated(true);
      } else {
        throw new Error(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        credentials: "include", // Include cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setUsername(`${data.user.firstName} ${data.user.lastName}`);
        setUserRole(data.user.role || "user");
        setIsAuthenticated(true);
      } else {
        throw new Error(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${BASE_URL}/user/logout`, {
        method: "POST",
        credentials: "include", // Include cookies
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear state regardless of API call result
      setUsername(null);
      setUserRole(null);
      setIsAuthenticated(false);
      setMyOrders([]);
    }
  };

  const getMyOrders = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await fetch(`${BASE_URL}/user/my-orders`, {
        method: "GET",
        credentials: "include", // Include cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const orders = await response.json();
        setMyOrders(orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        username,
        isAuthenticated,
        myOrders,
        userRole,
        isLoadingAuth,
        login,
        register,
        logout,
        checkAuth,
        getMyOrders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
