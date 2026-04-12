"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

export interface JWTPayload {
  userId: string;
  email: string;
  companyId: string;
}

interface AuthContextType {
  user: JWTPayload | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<JWTPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Decode JWT from cookie on component mount (for page refresh)
    const decodeToken = async () => {
      try {
        // Get token from cookie by making a request to a protected endpoint
        // The token is in the authToken cookie, but we need to decode it
        // We'll fetch it from the /api/auth/me endpoint
        const response = await fetch("/api/auth/me");

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    decodeToken();
  }, []);

  const logout = async () => {
    try {
      // Call logout endpoint to clear the cookie
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      // Clear user state
      setUser(null);

      // Redirect to login
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
      router.push("/login");
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
