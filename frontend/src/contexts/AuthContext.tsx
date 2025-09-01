import { createContext, useContext, useEffect, useState } from "react";
import { getStoredUser, getToken, setStoredUser, setToken, clearToken } from "../services/authService";

type AuthContextType = {
  user: any;
  token: string | null;
  doLogin: (data: { token: string; user: any }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(getStoredUser());
  const [token, setAuthToken] = useState<string | null>(getToken());

  const doLogin = (data: { token: string; user: any }) => {
    setUser(data.user);
    setAuthToken(data.token);
    setStoredUser(data.user);
    setToken(data.token);
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    clearToken();
    localStorage.removeItem("aias_user");
  };

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getToken();
    if (storedUser && storedToken) {
      setUser(storedUser);
      setAuthToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, doLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
