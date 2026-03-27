import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useContext, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { GlobalStateContext } from "@/context/GlobalStateProvider";

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useContext(GlobalStateContext);

  // Detect outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Logout handler
  const handleLogout = () => {
    logout(); // clears everything

    // toast.success("Logged out");
    navigate("/login");
  };

  const avatar = user?.photos?.find((p) => p.isAvatar)?.url;
  const initials = user?.firstName?.charAt(0) || "A";

  return (
    <nav className="w-full bg-bg-[#FFFFFF] dark:bg-brand-primary">
      <div className="max-w-full mx-auto px-6 py-4 flex justify-between items-center h-16">
        <div className="">
          <Link
            to="/"
            className="text-2xl font-bold text-blue-500 dark:text-blue-100"
          >
            SoulSeed
          </Link>
        </div>

        {/* Links */}
        {/* <div className="hidden md:flex gap-6 items-center">
          <Link to="/about" className="hover:text-primary text-foreground">
            About
          </Link>
          <Link to="/features" className="hover:text-primary text-foreground">
            Features
          </Link>
          <Link to="/contact" className="hover:text-primary text-foreground">
            Contact
          </Link>
        </div> */}

        <div ref={menuRef} className="relative">
          {/* Avatar (CLICKABLE) */}
          <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
            <Avatar className="relative w-12 h-12">
              <AvatarImage src={avatar} />
              <AvatarFallback>{initials}</AvatarFallback>
              <ChevronDown
                className={`absolute text-white bg-brand-tertiary rounded-full h-3 w-3 right-1 bottom-1 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </Avatar>
          </div>

          {/* DROPDOWN MENU */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-brand-tertiary text-foreground shadow-lg rounded-lg p-2 z-50">
              <Link
                to="/profile"
                className="block w-full text-left px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-red-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
