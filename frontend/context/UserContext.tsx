"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import Cookies from "js-cookie";

interface UserContextProps {
  name: string | null;
  token: string | null;
  setUserContext: (name: string | null, token: string | null) => void;
  checkToken: () => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("name");
      setName(storedName);
      setToken(Cookies.get("token") || null);
      setHydrated(true); // Mark hydration complete
    }
  }, []);

  const setUserContext = (newName: string | null, newToken: string | null) => {
    setName(newName);
    setToken(newToken);

    if (typeof window !== "undefined") {
      if (newToken) {
        localStorage.setItem("name", newName || "");
        Cookies.set("token", newToken, { expires: 14 });
      } else {
        localStorage.removeItem("name");
        Cookies.remove("token");
      }
    }
  };

  const logout = () => {
    setUserContext(null, null);
  };

  const checkToken = async (): Promise<boolean> => {
    const token = Cookies.get("token");
    if (!token) {
      return false;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      logout();
      return false;
    }
  };

  // Avoid rendering children until hydration is complete
  if (!hydrated) return null;

  return (
    <UserContext.Provider
      value={{ name, token, setUserContext, checkToken, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
