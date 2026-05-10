import { Link, NavLink, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useContext, useEffect, useRef, useState } from "react";
import { ChevronDown, Heart, Menu, MessageCircle, User, X } from "lucide-react";
import { GlobalStateContext } from "@/context/GlobalStateProvider";
import { cn } from "@/utils/utils";
import { Button } from "../ui/button";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    "text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
    isActive &&
      "bg-accent text-accent-foreground shadow-sm hover:bg-accent/90 hover:text-accent-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  );

/** Mobile drawer: high contrast & touch-friendly hit targets */
const drawerLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex min-h-[44px] w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold transition-colors sm:py-3",
    "text-foreground",
    "hover:bg-accent hover:text-accent-foreground active:bg-accent/85",
    isActive &&
      "bg-accent text-accent-foreground ring-2 ring-ring/50 hover:bg-accent/90 hover:text-accent-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  );

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useContext(GlobalStateContext);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const avatar = user?.photos?.find((p) => p.isAvatar)?.url;
  const initials =
    user?.firstName?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "?";

  const mobileDrawer =
    menuOpen &&
    typeof document !== "undefined" &&
    createPortal(
      <div className="fixed inset-0 z-[200] md:hidden" role="presentation">
        <button
          type="button"
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-[2px]",
            "transition-colors hover:bg-black/55 active:bg-black/65",
          )}
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={cn(
            "absolute inset-y-0 left-0 z-[210] flex w-[min(100vw,20rem)] flex-col shadow-2xl",
            "border-r border-border bg-background text-card-foreground",
          )}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-3">
            <span className="flex-1 text-lg font-semibold tracking-tight text-foreground">
              Menu
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "size-11 shrink-0 rounded-xl",
                "hover:bg-accent active:bg-accent/80 touch-manipulation",
              )}
              aria-label="Close"
              onClick={() => setMenuOpen(false)}
            >
              <X className="size-5" />
            </Button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3 pb-8">
            <NavLink
              to="/dashboard"
              className={drawerLinkClass}
              end
              onClick={() => setMenuOpen(false)}
            >
              <Heart className="size-5 opacity-90" aria-hidden />
              Discover
            </NavLink>
            <NavLink
              to="/messages"
              className={drawerLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              <MessageCircle className="size-5 opacity-90" aria-hidden />
              Messages
            </NavLink>
            <NavLink
              to="/profile"
              className={drawerLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              <User className="size-5 opacity-90" aria-hidden />
              Profile
            </NavLink>
          </nav>
        </div>
      </div>,
      document.body,
    );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                "md:hidden size-11 touch-manipulation",
                "hover:bg-accent active:bg-accent/80 focus-visible:bg-accent",
              )}
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <Link
              to="/dashboard"
              className="text-lg font-bold tracking-tight text-primary transition-opacity hover:opacity-90 active:opacity-75 sm:text-xl"
            >
              SoulSeed
            </Link>
          </div>

          <div className="hidden items-center gap-1 md:flex">
            <NavLink to="/dashboard" className={navLinkClass}>
              <span className="flex items-center gap-2">
                <Heart className="size-4 opacity-90" aria-hidden />
                Discover
              </span>
            </NavLink>
            <NavLink to="/messages" className={navLinkClass}>
              <span className="flex items-center gap-2">
                <MessageCircle className="size-4 opacity-90" aria-hidden />
                Messages
              </span>
            </NavLink>
          </div>

          <div className="flex items-center gap-2">
            <div ref={accountRef} className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((o) => !o)}
                className={cn(
                  "flex touch-manipulation items-center gap-2 rounded-full outline-none",
                  "transition-opacity hover:opacity-95 active:opacity-85",
                  "ring-offset-background focus-visible:ring-2 focus-visible:ring-ring",
                )}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
              >
                <Avatar className="relative size-9 border border-border sm:size-10">
                  <AvatarImage src={avatar} alt="" />
                  <AvatarFallback className="text-sm">{initials}</AvatarFallback>
                  <ChevronDown
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-secondary text-secondary-foreground ring-2 ring-background transition-transform",
                      accountOpen && "rotate-180",
                    )}
                  />
                </Avatar>
              </button>

              {accountOpen && (
                <div
                  role="menu"
                  className={cn(
                    "absolute right-0 z-[220] mt-2 w-52 overflow-hidden rounded-xl border border-border",
                    "bg-card text-card-foreground shadow-lg backdrop-blur-sm",
                  )}
                >
                  <Link
                    role="menuitem"
                    to="/profile"
                    onClick={() => setAccountOpen(false)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors",
                      "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
                    )}
                  >
                    <User className="size-4" aria-hidden />
                    Profile
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setAccountOpen(false);
                      handleLogout();
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium text-destructive",
                      "hover:bg-destructive/15 active:bg-destructive/20",
                    )}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {mobileDrawer}
    </>
  );
}
