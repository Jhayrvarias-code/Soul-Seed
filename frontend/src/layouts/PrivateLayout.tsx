import { Outlet } from "react-router-dom";
import Navbar from "@/components/ProtectedComponents/NavBar";

export default function PrivateLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
