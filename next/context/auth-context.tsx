"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  jwt: string | null;
  loginWithWeChat: () => void;
  loginWithQQ: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
  return null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jwt, setJwt] = useState<string | null>(null);

  useEffect(() => {
    const token = getCookie("strapi_jwt");
    if (token) setJwt(token);
  }, []);

  const isAuthenticated = !!jwt;

  const buildRedirect = useCallback(() => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    const url = new URL(`auth/callback`, process.env.NEXT_PUBLIC_SITE_URL || window.location.origin);
    url.searchParams.set("redirect", currentUrl);
    return url.toString();
  }, []);

  const loginWithWeChat = useCallback(() => {
    const api = process.env.NEXT_PUBLIC_API_URL;
    if (!api) return;
    const redirect = buildRedirect();
    window.location.href = `${api}/api/connect/wechat?redirect=${encodeURIComponent(redirect)}`;
  }, [buildRedirect]);

  const loginWithQQ = useCallback(() => {
    const api = process.env.NEXT_PUBLIC_API_URL;
    if (!api) return;
    const redirect = buildRedirect();
    window.location.href = `${api}/api/connect/qq?redirect=${encodeURIComponent(redirect)}`;
  }, [buildRedirect]);

  const logout = useCallback(() => {
    setJwt(null);
    if (typeof document !== "undefined") {
      document.cookie = `strapi_jwt=; Max-Age=0; path=/;`;
    }
  }, []);

  const value = useMemo(() => ({ isAuthenticated, jwt, loginWithWeChat, loginWithQQ, logout }), [isAuthenticated, jwt, loginWithWeChat, loginWithQQ, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

