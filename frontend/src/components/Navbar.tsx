import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-[#FFFFFF] dark:bg-brand-primary shadow-md">
      <div className="max-w-full mx-auto px-6 py-4 flex justify-between items-center h-16">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-500 dark:text-blue-900"
        >
          SoulSeed
        </Link>

        {/* Links */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/about" className="hover:text-primary text-foreground">
            About
          </Link>
          <Link to="/features" className="hover:text-primary text-foreground">
            Features
          </Link>
          <Link to="/contact" className="hover:text-primary text-foreground">
            Contact
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex gap-4">
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
          {/* <Link to="/register">
            <Button>Get Started</Button>
          </Link> */}
        </div>
      </div>
    </nav>
  );
}
