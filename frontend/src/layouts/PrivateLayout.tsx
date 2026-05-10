import { Outlet } from "react-router-dom";
import Navbar from "@/components/ProtectedComponents/NavBar";

export default function PrivateLayout() {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex flex-1 min-h-0 flex-col">
        <Outlet />
      </main>
    </div>
  );
}
