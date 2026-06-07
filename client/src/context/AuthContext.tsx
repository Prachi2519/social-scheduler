/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import api, { SESSION_EXPIRED_EVENT } from "../api/axios";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type StoredAuth = {
  storedToken: string | null;
  storedUserData: User | null;
};

const getStoredAuth = () => {
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");

  if (!storedUser || !storedToken) {
    return { storedToken: null, storedUserData: null };
  }

  try {
    const storedUserData = JSON.parse(storedUser) as User;
    api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

    return { storedToken, storedUserData };
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return { storedToken: null, storedUserData: null };
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<StoredAuth>(getStoredAuth);
  const user = auth.storedUserData;
  const token = auth.storedToken;
  const isLoading = false;

  useEffect(() => {
    const handleSessionExpired = () => {
      setAuth({ storedToken: null, storedUserData: null });
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, []);

  const login = (userData: User, newToken: string) => {
    setAuth({ storedToken: newToken, storedUserData: userData });
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", newToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  };

  const logout = () => {
    setAuth({ storedToken: null, storedUserData: null });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
