"use client";
/**
 * AuthProvider — contexte d'authentification global
 * Gère la session utilisateur et la redirection si non connecté
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { User } from "@/types";
import { getProfile, removeToken, isAuthenticated } from "@/services/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  logout: () => {},
});

/** Pages accessibles sans authentification */
const PUBLIC_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = useCallback(async () => {
    if (!isAuthenticated()) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const u = await getProfile();
      setUser(u);
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    router.push("/login");
  }, [router]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  /* Redirection automatique */
  useEffect(() => {
    if (loading) return;
    const isPublic = PUBLIC_PATHS.includes(pathname);
    if (!user && !isPublic) {
      router.push("/login");
    }
    if (user && isPublic) {
      router.push("/dashboard");
    }
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
