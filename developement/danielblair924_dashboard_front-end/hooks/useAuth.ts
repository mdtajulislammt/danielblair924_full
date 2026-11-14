"use client";

import { useEffect, useState } from "react";
import { CookieHelper } from "@/helper/cookie.helper";

export interface AuthUser {
  id?: string;
  email?: string;
  fname?: string;
  lname?: string;
  name?: string;
  role?: "SUPERADMIN" | "ADMIN" | "MEMBER" | string;
  avatarUrl?: string;
}

export function useAuth() {
  const [role, setRole] = useState<string>("SUPERADMIN");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const cookieRole = CookieHelper.get({ key: "role" });
      const localRole =
        typeof window !== "undefined" ? localStorage.getItem("role") : null;
      const activeRole = (cookieRole || localRole || "SUPERADMIN").toUpperCase();
      setRole(activeRole);

      const localUser =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (localUser) {
        try {
          const parsed = JSON.parse(localUser);
          setUser(parsed);
        } catch {
          // ignore parsing error
        }
      }
    } catch (e) {
      console.error("Error reading auth state:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isAdmin = role === "SUPERADMIN" || role === "ADMIN";
  const isSuperAdmin = role === "SUPERADMIN";
  const isMember = role === "MEMBER";

  return {
    role,
    user,
    isAdmin,
    isSuperAdmin,
    isMember,
    isLoading,
  };
}

