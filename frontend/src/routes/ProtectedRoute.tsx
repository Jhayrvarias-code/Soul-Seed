import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { GlobalStateContext } from "../context/GlobalStateProvider";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token } = useContext(GlobalStateContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}