import { Outlet } from "react-router-dom";
import LandingPage from "@/pages/landingPage";
import Navbar from "@/components/Navbar";

export default function AuthLayout() {
  return (
    <div className="relative min-h-dvh">
      <div className="absolute inset-0 z-0">
        <Navbar />
        <LandingPage />
      </div>

      <div className="absolute inset-0 z-10 bg-background/85 backdrop-blur-[2px] dark:bg-background/90" />

      <div className="relative z-20 flex min-h-dvh items-center justify-center px-4 py-8 sm:py-12">
        <Outlet />
      </div>
    </div>
  );
}
