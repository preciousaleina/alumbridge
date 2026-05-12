import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { GraduationCap, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Hide header chrome on auth route — keep it minimal
  const minimal = loc.pathname === "/auth";

  const links = user
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/directory", label: "Directory" },
        { to: "/jobs", label: "Jobs" },
        { to: "/events", label: "Events" },
        { to: "/profile", label: "Profile" },
      ]
    : [
        { to: "/about", label: "About" },
        { to: "/features", label: "Features" },
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-coral transition-transform group-hover:rotate-6">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="leading-none">
            <span className="font-display text-lg tracking-tight">AlumBridge</span>
          </div>
        </Link>

        {!minimal && (
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline max-w-[160px] truncate">
                {profile?.full_name || user.email}
              </span>
              <Button size="icon" variant="ghost" onClick={handleSignOut} className="rounded-full">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            !minimal && (
              <>
                <Button asChild size="sm" variant="ghost" className="rounded-full hidden sm:inline-flex">
                  <Link to="/auth">Sign in</Link>
                </Button>
                <Button asChild size="sm" className="rounded-full bg-primary hover:bg-primary/90 px-5">
                  <Link to="/auth">Join now</Link>
                </Button>
              </>
            )
          )}
          {!minimal && (
            <Button size="icon" variant="ghost" className="md:hidden rounded-full" onClick={() => setOpen(!open)}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>

      {open && !minimal && (
        <nav className="md:hidden border-t border-border/40 bg-background px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn("rounded-lg px-3 py-2 text-sm font-medium",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary")
              }
            >
              {l.label}
            </NavLink>
          ))}
          {!user && (
            <Link to="/auth" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium bg-primary text-primary-foreground text-center mt-2">Join now</Link>
          )}
        </nav>
      )}
    </header>
  );
}
