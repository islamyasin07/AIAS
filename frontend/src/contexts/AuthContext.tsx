import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import {
  getToken,
  setToken as saveToken,
  clearToken,
  getStoredUser,
  setStoredUser,
} from "../services/authService";


export type User = {
  id: string;
  email: string;
  full_name: string;
  is_admin?: boolean;
  [key: string]: any; 
};

export type LoginResponse = {
  token: string;
  user: User;
};

type AuthCtx = {
  user: User | null;
  token: string | null;
  loading: boolean;
  doLogin: (res: LoginResponse) => void;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser?.() ?? null);
  const [token, setToken] = useState<string | null>(getToken?.() ?? null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (token) {
          const { data } = await api.get("/auth/me");
          const u: User = data?.user ?? data;
          setUser(u);
          setStoredUser?.(u);
        }
      } catch {
        clearToken?.();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function doLogin(res: LoginResponse) {
    saveToken?.(res.token);
    setStoredUser?.(res.user);
    setToken(res.token);
    setUser(res.user);
    console.log("TOKEN FROM BACKEND:", res.token);
  }

  async function refreshMe() {
    const { data } = await api.get("/auth/me");
    const u: User = data?.user ?? data;
    setUser(u);
    setStoredUser?.(u);
  }

  function logout() {
    clearToken?.();
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, doLogin, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
