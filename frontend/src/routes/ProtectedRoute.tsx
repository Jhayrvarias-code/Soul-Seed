import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { GlobalStateContext } from "../context/GlobalStateProvider";

export default function ProtectedRoute() {
  const { token, loading } = useContext(GlobalStateContext);

  if (loading) return <div>Loading...</div>;

  if (!token) return <Navigate to="/" />;

  return <Outlet />;
}