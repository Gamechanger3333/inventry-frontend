"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export interface User {
  id: number;
  organizationId: number;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  // Session cookie is already set by the backend (login/verify-otp/verify-email
  // responses issue Set-Cookie) - this just updates the in-memory user so the
  // UI reflects it immediately, without a token to store.
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // No token to check client-side anymore (it's an httpOnly cookie the
    // browser attaches automatically) - just ask the backend who, if
    // anyone, the current cookie belongs to. A 401 here just means
    // "not logged in", which is expected on first visit.
    apiFetch<User>("/api/auth/me")
      .then((u) => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
  };

  const logout = () => {
    apiFetch("/api/auth/logout", { method: "POST" })
      .catch(() => {
        // Even if the network call fails, still clear local state and
        // send the user to login - a stale-but-invalid cookie is no
        // worse than what they had before clicking logout.
      })
      .finally(() => {
        setUser(null);
        router.push("/login");
      });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
