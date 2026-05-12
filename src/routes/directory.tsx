import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Briefcase, Search } from "lucide-react";

export const Route = createFileRoute("/directory")({
  head: () => ({ meta: [{ title: "Alumni Directory — AlumBridge" }] }),
  component: () => <RequireAuth><Directory /></RequireAuth>,
});

function Directory() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => setProfiles(data || []));
  }, []);

  const filtered = profiles.filter((p) => {
    const s = q.toLowerCase();
    return !s || p.full_name?.toLowerCase().includes(s) || p.course?.toLowerCase().includes(s) || p.company?.toLowerCase().includes(s);
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Alumni Directory</h1>
        <p className="text-muted-foreground">Discover graduates and students across the network.</p>
      </div>
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search by name, course, company..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Card key={p.id} className="p-5 shadow-soft transition hover:shadow-elegant">
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-hero text-primary-foreground">{(p.full_name || "?").slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-semibold">{p.full_name || "Unnamed"}</p>
                  <Badge variant={p.role === "alumni" ? "default" : "secondary"} className="capitalize">{p.role}</Badge>
                </div>
                {p.current_position && (
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    <Briefcase className="mr-1 inline h-3 w-3" />{p.current_position}{p.company ? ` · ${p.company}` : ""}
                  </p>
                )}
                {p.location && <p className="mt-0.5 text-xs text-muted-foreground"><MapPin className="mr-1 inline h-3 w-3" />{p.location}</p>}
                {p.course && <p className="mt-2 text-xs text-muted-foreground">{p.course}{p.graduation_year ? ` · Class of ${p.graduation_year}` : ""}</p>}
              </div>
            </div>
            {p.bio && <p className="mt-3 line-clamp-3 text-sm text-foreground/80">{p.bio}</p>}
          </Card>
        ))}
        {filtered.length === 0 && <p className="col-span-full py-12 text-center text-muted-foreground">No profiles found.</p>}
      </div>
    </main>
  );
}
