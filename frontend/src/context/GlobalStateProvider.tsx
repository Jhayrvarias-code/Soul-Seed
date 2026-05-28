import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
// import { api } from "@/api/axios";
import { getCurrentUser } from "@/services/userService";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  birthdate: string;
  bio?: string;
  photos: { url: string; publicId: string; isAvatar: boolean }[];
}

// 1. Define the type for global state
interface GlobalStateType {
  user: User | null; // stores current logged-in user
  token: string | null; // JWT token
  onlineUsers: string[]; // array of online user IDs
  loading: boolean; // to remove load token

  setUser: (user: User) => void; // function to update user
  setToken: (token: string | null) => void; // function to update token
  setOnlineUsers: (users: string[]) => void; // function to update online users

  logout: () => void;
}

// 2. Create context with default empty values
export const GlobalStateContext = createContext<GlobalStateType>({
  user: null,
  token: null,
  onlineUsers: [],
  loading: true,

  setUser: () => {},
  setToken: () => {},
  setOnlineUsers: () => {},

  logout: () => {},
});

// 3. Define provider component
export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    setTokenState(null);
    setUser(null);
  };

  // Example: load token from localStorage on first render
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        setTokenState(savedToken);

        // fetch user
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        // token invalid → logout
        localStorage.removeItem("token");
        setTokenState(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // wrapper that persists token and fetches user when token is set
  const setToken = async (newToken: string | null) => {
    setTokenState(newToken);

    if (!newToken) {
      localStorage.removeItem("token");
      setUser(null);
      return;
    }

    // persist token immediately so API calls can read it
    localStorage.setItem("token", newToken);

    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (err) {
      // token invalid
      localStorage.removeItem("token");
      setTokenState(null);
      setUser(null);
    }
  };

  // 4. Provide state and setters to all children
  return (
    <GlobalStateContext.Provider
      value={{
        user,
        token,
        onlineUsers,
        loading,
        setUser,
        setToken,
        setOnlineUsers,
        logout,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
