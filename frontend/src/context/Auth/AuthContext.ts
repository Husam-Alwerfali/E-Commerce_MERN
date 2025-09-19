import { createContext, useContext } from "react";

interface AuthContextType {
  username: string | null;
  isAuthenticated: boolean;
  userRole: string | null;
  isLoadingAuth: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  myOrders?: any[];
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  getMyOrders?: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  username: null,
  isAuthenticated: false,
  userRole: null,
  isLoadingAuth: true,
  myOrders: [],
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
  getMyOrders: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};
