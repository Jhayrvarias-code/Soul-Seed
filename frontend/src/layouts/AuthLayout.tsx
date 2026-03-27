import { Outlet } from "react-router-dom";
import LandingPage from "@/pages/landingPage";
import Navbar from "@/components/Navbar";
// import { useNavigate } from "react-router-dom";
// import { X } from "lucide-react";

export default function AuthLayout() {
  // const navigate = useNavigate();
  return (
    <div className="relative min-h-screen m-0 p-0">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Navbar />
        <LandingPage />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40  z-10" />

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
