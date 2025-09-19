import { createContext, useContext } from "react";

interface AuthContextType {
  username: string | null;
  token: string | null;
  isAuthenticated: boolean;
  userRole: string | null;
  isLoadingAuth: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  myOrders?: any[];
  login: (username: string, token: string) => void;
  logout: () => void;
  getMyOrders?: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  username: null,
  token: null,
  isAuthenticated: false,
  userRole: null,
  isLoadingAuth: true,
  myOrders: [],
  login: () => {},
  logout: () => {},
  getMyOrders: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};
