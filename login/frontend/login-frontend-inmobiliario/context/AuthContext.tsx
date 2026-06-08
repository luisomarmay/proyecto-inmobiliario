"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  logout: () => {},
  isLoggedIn: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const loadUser = async (savedToken: string) => {
    try {
      const res = await fetch("http://localhost:3001/auth/me", {
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      if (!res.ok) throw new Error("Token inválido");
      const data = await res.json();
      setToken(savedToken);
      setUser(data);
    } catch {
      localStorage.removeItem("accessToken");
      setToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    // Carga inicial
    const savedToken = localStorage.getItem("accessToken");
    if (savedToken) loadUser(savedToken);

    // ✅ Escucha cambios en localStorage (cuando el callback guarda el token)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "accessToken" && e.newValue) {
        loadUser(e.newValue);
      }
      if (e.key === "accessToken" && !e.newValue) {
        setUser(null);
        setToken(null);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);