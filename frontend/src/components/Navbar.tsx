import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/utils/utils";
import { createPortal } from "react-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
    isActive && "bg-muted text-foreground",
  );

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  // const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="text-lg font-bold tracking-tight text-primary sm:text-xl"
          >
            SoulSeed
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
            <NavLink to="/features" className={linkClass}>
              Features
            </NavLink>
            <NavLink to="/contact" className={linkClass}>
              Contact
            </NavLink>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get started</Button>
            </Link>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
        </nav>

        {open &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              className="fixed inset-0 z-50 md:hidden"
              role="dialog"
              aria-modal="true"
            >
              <button
                type="button"
                className="absolute inset-0 bg-black/40"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              />
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                className={cn(
                  "absolute inset-y-0 right-0 z-[210] flex h-80 w-[min(100vw,20rem)] flex-col shadow-2xl",
                  "border-r border-border bg-background rounded-l-lg",
                )}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute right-0 top-0 flex h-1/2 w-[min(100%,20rem)] flex-col border-l border-border bg-background shadow-xl">
                  {/* <div className="bg-black/80"> */}
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <span className="font-semibold text-foreground">Menu</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setOpen(false)}
                    >
                      <X className="size-5" />
                    </Button>
                  </div>
                  <div className="flex flex-col gap-1 p-3">
                    <NavLink
                      to="/about"
                      className={linkClass}
                      onClick={() => setOpen(false)}
                    >
                      About
                    </NavLink>
                    <NavLink
                      to="/features"
                      className={linkClass}
                      onClick={() => setOpen(false)}
                    >
                      Features
                    </NavLink>
                    <NavLink
                      to="/contact"
                      className={linkClass}
                      onClick={() => setOpen(false)}
                    >
                      Contact
                    </NavLink>
                    <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-foreground">
                      <Link to="/login" onClick={() => setOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Login
                        </Button>
                      </Link>
                      <Link to="/register" onClick={() => setOpen(false)}>
                        <Button className="w-full">Get started</Button>
                      </Link>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              </div>
            </div>,
            document.body,
          )}
      </header>
    </>
  );
}
