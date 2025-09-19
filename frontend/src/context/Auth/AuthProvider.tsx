import { useState, type FC, type PropsWithChildren, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { BASE_URL } from "../../api/baseUrl";

const USERNAME_KEY = "username";
const TOKEN_KEY = "token";

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem(USERNAME_KEY)
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem(TOKEN_KEY)
  );
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const [myOrders, setMyOrders] = useState([]);

  const isAuthenticated = !!token;

  // Decode JWT token to get user role
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role || "user");
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserRole("user");
      }
    } else {
      setUserRole(null);
    }
    setIsLoadingAuth(false);
  }, [token]);

  const login = (username: string, token: string) => {
    setUsername(username);
    setToken(token);
    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(TOKEN_KEY, token);
  };

  const logout = () => {
    setUsername(null);
    setToken(null);
    setUserRole(null);
    setIsLoadingAuth(false);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  const getMyOrders = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${BASE_URL}/user/my-orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        return;
      }
      const orders = await response.json();
      setMyOrders(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        username,
        token,
        isAuthenticated,
        myOrders,
        userRole,
        isLoadingAuth,
        login,
        logout,
        getMyOrders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
