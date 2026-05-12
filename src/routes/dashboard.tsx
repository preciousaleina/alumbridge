import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { RequireAuth } from "@/components/RequireAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, Calendar, Users, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — AlumBridge" }] }),
  component: () => <RequireAuth><Dashboard /></RequireAuth>,
});

function Dashboard() {
  const { profile } = useAuth();
  const [counts, setCounts] = useState({ alumni: 0, jobs: 0, events: 0 });

  useEffect(() => {
    (async () => {
      const [a, j, e] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "alumni"),
        supabase.from("jobs").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
      ]);
      setCounts({ alumni: a.count || 0, jobs: j.count || 0, events: e.count || 0 });
    })();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm text-muted-foreground">Welcome back,</p>
        <h1 className="text-3xl font-bold">{profile?.full_name || "Friend"} 👋</h1>
        <p className="mt-1 text-muted-foreground capitalize">Signed in as {profile?.role}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label="Alumni" value={counts.alumni} to="/directory" color="text-primary-glow" />
        <StatCard icon={Briefcase} label="Open jobs" value={counts.jobs} to="/jobs" color="text-gold" />
        <StatCard icon={Calendar} label="Events" value={counts.events} to="/events" color="text-primary-glow" />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card className="p-6 shadow-soft">
          <h2 className="text-lg font-semibold">Complete your profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">Add your course, graduation year, and bio so others can find and connect with you.</p>
          <Button asChild className="mt-4"><Link to="/profile">Edit profile <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
        </Card>
        <Card className="p-6 shadow-soft">
          <h2 className="text-lg font-semibold">Browse the directory</h2>
          <p className="mt-1 text-sm text-muted-foreground">Discover alumni working in your field and connect for mentorship.</p>
          <Button asChild variant="secondary" className="mt-4"><Link to="/directory">Open directory</Link></Button>
        </Card>
      </div>
    </main>
  );
}

function StatCard({ icon: Icon, label, value, to, color }: any) {
  return (
    <Link to={to}>
      <Card className="p-6 shadow-soft transition hover:shadow-elegant">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-3xl font-bold">{value}</p>
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </Card>
    </Link>
  );
}
