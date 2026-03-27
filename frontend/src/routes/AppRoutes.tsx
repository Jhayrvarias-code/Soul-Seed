import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "../routes/ProtectedRoute";
import PublicLayout from "@/layouts/PublicLayout";
import AuthLayout from "@/layouts/AuthLayout";
import PrivateLayout from "@/layouts/PrivateLayout";
import PublicRoute from "./PublicRoutes";
import { Spinner } from "@/components/ui/spinner";
// import { useContext } from "react";
// import { GlobalStateContext } from "../context/GlobalStateProvider";

const LoginPage = lazy(() => import("../pages/loginPage"));
const RegisterPage = lazy(() => import("../pages/registerPage"));
// const ProfilePage = lazy(() => import("../pages/profilePage"));
const LandingPage = lazy(() => import("@/pages/landingPage"));
const DashboardPage = lazy(
  () => import("@/pages/ProtectedPages/dashboardPage"),
);
const ProfilePage = lazy(() => import("@/pages/ProtectedPages/profilePage"));

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-background">
          <Spinner className="h-10 w-10 text-foreground" />
        </div>
      }
    >
      <Routes>
        <Route element={<PublicRoute />}>
          {/* PUBLIC */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* AUTH (overlay layout) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        {/* PRIVATE */}
        <Route element={<ProtectedRoute />}>
          <Route element={<PrivateLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}
