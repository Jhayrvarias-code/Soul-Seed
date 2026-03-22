import { Routes, Route, Navigate } from "react-router-dom";
// import { useContext } from "react";
// import { GlobalStateContext } from "../context/GlobalStateProvider";

import LoginPage from "../pages/loginPage";
import RegisterPage from "../pages/registerPage";
import ProfilePage from "../pages/profilePage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
    // const { token } = useContext(GlobalStateContext)
  // const isAuthenticated = !!token; // temporary (we will connect to global state later)

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}