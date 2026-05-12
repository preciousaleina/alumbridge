import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Briefcase, Calendar, Users, Globe2, ArrowUpRight } from "lucide-react";

export default function Dashboard() {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState({ jobs: 0, events: 0, alumni: 0, requests: 0 });

  useEffect(() => {
    (async () => {
      const [jobs, events, alumni, requests] = await Promise.all([
        supabase.from("jobs").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("mentorship_requests").select("*", { count: "exact", head: true }).eq("alumni_id", user!.id),
      ]);
      setStats({
        jobs: jobs.count ?? 0,
        events: events.count ?? 0,
        alumni: alumni.count ?? 0,
        requests: requests.count ?? 0,
      });
    })();
  }, [user]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Dashboard</p>
        <h1 className="mt-2 font-display text-5xl sm:text-6xl">
          Hello, {profile?.full_name?.split(" ")[0] || "friend"}.
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">Here's what's happening across your network.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        <StatCard icon={Globe2} label="Alumni" value={stats.alumni} to="/directory" />
        <StatCard icon={Briefcase} label="Open jobs" value={stats.jobs} to="/jobs" />
        <StatCard icon={Calendar} label="Upcoming events" value={stats.events} to="/events" />
        <StatCard icon={Users} label="Mentorship requests" value={stats.requests} to="/profile" />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <QuickAction title="Update your profile" body="Add your current role and graduation year so others can find you." to="/profile" />
        <QuickAction title="Browse the directory" body="Find classmates and reconnect with your cohort." to="/directory" />
        <QuickAction title="Post a job" body="Help fellow alumni — share an opening at your company." to="/jobs" />
        <QuickAction title="See upcoming events" body="Reunions, talks, mixers — RSVP in one click." to="/events" />
      </div>
    </main>
  );
}

function StatCard({ icon: Icon, label, value, to }: any) {
  return (
    <Link to={to} className="group rounded-3xl border border-border bg-card p-6 hover:border-primary/50 transition">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:rotate-45 transition" />
      </div>
      <div className="mt-5 font-display text-4xl">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </Link>
  );
}

function QuickAction({ title, body, to }: { title: string; body: string; to: string }) {
  return (
    <Link to={to} className="group rounded-3xl border border-border bg-card p-7 hover:border-primary/50 transition flex items-start justify-between gap-4">
      <div>
        <h3 className="font-display text-xl">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      </div>
      <ArrowUpRight className="h-5 w-5 text-primary shrink-0 group-hover:rotate-45 transition" />
    </Link>
  );
}
