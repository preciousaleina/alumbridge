import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/lib/auth";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Features from "@/pages/Features";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Directory from "@/pages/Directory";
import Jobs from "@/pages/Jobs";
import Events from "@/pages/Events";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  if (!user) return <Navigate to="/auth" replace state={{ from: loc.pathname }} />;
  return <>{children}</>;
}

export default function App() {
  return (
    <>
      <AppHeader />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="/directory" element={<Protected><Directory /></Protected>} />
        <Route path="/jobs" element={<Protected><Jobs /></Protected>} />
        <Route path="/events" element={<Protected><Events /></Protected>} />
        <Route path="/profile" element={<Protected><Profile /></Protected>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
