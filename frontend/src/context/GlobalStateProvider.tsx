import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface User {
  _id: string;
  firstName: string;
  email: string;
}

// 1. Define the type for global state
interface GlobalStateType {
  user: User | null;          // stores current logged-in user
  token: string | null; // JWT token
  onlineUsers: string[]; // array of online user IDs
  setUser: (user: any) => void; // function to update user
  setToken: (token: string | null) => void; // function to update token
  setOnlineUsers: (users: string[]) => void; // function to update online users
}

// 2. Create context with default empty values
export const GlobalStateContext = createContext<GlobalStateType>({
  user: null,
  token: null,
  onlineUsers: [],
  setUser: () => {},
  setToken: () => {},
  setOnlineUsers: () => {},
});

// 3. Define provider component
export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // Example: load token from localStorage on first render
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  // 4. Provide state and setters to all children
  return (
    <GlobalStateContext.Provider
      value={{ user, token, onlineUsers, setUser, setToken, setOnlineUsers }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};