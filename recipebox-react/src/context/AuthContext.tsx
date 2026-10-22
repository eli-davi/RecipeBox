
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useQueryClient } from "@tanstack/react-query";

export type User = {
  name: string;
  role: "Admin" | "User";
  email?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const API = "http://localhost:5232/api/auth";

const AuthContext = createContext<AuthContextType | null>(null);

async function authRequest(
  path: string,
  options?: RequestInit
) {
  const response = await fetch(`${API}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let message = "אירעה שגיאה. נסי שוב.";

    try {
      const data = await response.json();

      message =
        data.message ||
        (Array.isArray(data.errors)
          ? data.errors.join(", ")
          : undefined) ||
        message;
    } catch {
      // The server did not return JSON.
    }

    throw new Error(message);
  }

  return response.json();
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = useQueryClient();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const currentUser = await authRequest("/me");

        if (active) {
          setUser(currentUser);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadUser();

    return () => {
      active = false;
    };
  }, []);

  async function login(email: string, password: string) {
    const loggedInUser = await authRequest("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    queryClient.clear();
    setUser(loggedInUser);
  }

  async function register(
    name: string,
    email: string,
    password: string
  ) {
    const newUser = await authRequest("/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    queryClient.clear();
    setUser(newUser);
  }

  async function logout() {
    await authRequest("/logout", {
      method: "POST",
    });

    queryClient.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("AuthProvider is missing");
  }

  return context;
}
