import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { GlobalStateContext } from "../context/GlobalStateProvider";

export default function PublicRoute() {
  const { token } = useContext(GlobalStateContext);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
