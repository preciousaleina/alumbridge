import { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  User as UserIcon,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/directory", label: "Directory", icon: Users },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/events", label: "Events", icon: Calendar },
  { to: "/profile", label: "Profile", icon: UserIcon },
];

function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2.5 px-2 py-2 group">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-coral transition-transform group-hover:rotate-6">
            <GraduationCap className="h-5 w-5" />
          </div>
          {!collapsed && (
            <span className="font-display text-lg tracking-tight">AlumBridge</span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <NavLink
                      to={item.to}
                      end
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-lg",
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )
                      }
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <UserChip collapsed={collapsed} />
      </SidebarFooter>
    </Sidebar>
  );
}

function UserChip({ collapsed }: { collapsed: boolean }) {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const initial = (profile?.full_name || user?.email || "?")[0]?.toUpperCase();

  const onSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 py-1">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
          {initial}
        </div>
        <Button size="icon" variant="ghost" onClick={onSignOut} className="h-8 w-8 rounded-full">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
        {initial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{profile?.full_name || "Member"}</div>
        <div className="truncate text-xs text-muted-foreground">{user?.email}</div>
      </div>
      <Button size="icon" variant="ghost" onClick={onSignOut} className="h-8 w-8 rounded-full shrink-0" title="Sign out">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border/40 bg-background/80 px-4 backdrop-blur-xl">
            <SidebarTrigger />
          </header>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
