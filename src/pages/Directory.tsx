import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Briefcase, GraduationCap, Linkedin, MessageCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface P {
  id: string; full_name: string | null; role: string;
  graduation_year: number | null; course: string | null;
  current_position: string | null; company: string | null;
  location: string | null; linkedin: string | null; bio: string | null;
}

export default function Directory() {
  const { user } = useAuth();
  const [list, setList] = useState<P[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "alumni" | "student">("all");
  const [loading, setLoading] = useState(true);
  const [mentorTarget, setMentorTarget] = useState<P | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, role, graduation_year, course, current_position, company, location, linkedin, bio")
        .order("created_at", { ascending: false });
      if (error) toast.error(error.message);
      setList((data as P[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = list.filter((p) => {
    if (filter !== "all" && p.role !== filter) return false;
    if (!q) return true;
    const hay = `${p.full_name} ${p.course} ${p.company} ${p.current_position} ${p.location}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  const requestMentor = async () => {
    if (!mentorTarget || !user) return;
    if (msg.trim().length < 10) { toast.error("Write a short message (10+ chars)"); return; }
    const { error } = await supabase.from("mentorship_requests").insert({
      student_id: user.id, alumni_id: mentorTarget.id, message: msg,
    });
    if (error) { toast.error(error.message); return; }
    toast.success(`Request sent to ${mentorTarget.full_name}`);
    setMentorTarget(null); setMsg("");
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-col gap-6 mb-10">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Directory</p>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl">Find your people.</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, company, course, city…" className="pl-11 h-12 rounded-full bg-card border-border" />
          </div>
          <div className="flex gap-2">
            {(["all", "alumni", "student"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-5 h-12 text-sm font-semibold capitalize transition ${filter === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? <p className="text-muted-foreground">Loading…</p> : filtered.length === 0 ? (
        <p className="text-muted-foreground py-20 text-center">No members match your search yet.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.id} className="rounded-3xl border border-border bg-card p-6 hover:border-primary/50 transition">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-display text-lg">
                  {(p.full_name || "?")[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg truncate">{p.full_name || "Unnamed"}</h3>
                  <span className="text-xs uppercase font-bold tracking-wider text-primary">{p.role}</span>
                </div>
              </div>
              <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                {p.current_position && <div className="flex items-center gap-2"><Briefcase className="h-3.5 w-3.5 shrink-0" /> {p.current_position}{p.company ? ` · ${p.company}` : ""}</div>}
                {p.course && <div className="flex items-center gap-2"><GraduationCap className="h-3.5 w-3.5 shrink-0" /> {p.course}{p.graduation_year ? ` · ${p.graduation_year}` : ""}</div>}
                {p.location && <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 shrink-0" /> {p.location}</div>}
              </div>
              {p.bio && <p className="mt-3 text-sm text-foreground/80 line-clamp-2">{p.bio}</p>}
              <div className="mt-5 flex gap-2">
                {p.role === "alumni" && p.id !== user?.id && (
                  <Button size="sm" onClick={() => setMentorTarget(p)} className="rounded-full bg-primary hover:bg-primary/90">
                    <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> Request mentor
                  </Button>
                )}
                {p.linkedin && (
                  <Button asChild size="sm" variant="outline" className="rounded-full">
                    <a href={p.linkedin} target="_blank" rel="noreferrer"><Linkedin className="h-3.5 w-3.5" /></a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!mentorTarget} onOpenChange={(o) => !o && setMentorTarget(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Request mentorship</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Send {mentorTarget?.full_name} a short note about what you'd like to learn.</p>
          <Textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={5} placeholder="Hi! I'd love your guidance on…" className="rounded-xl bg-input border-border" />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setMentorTarget(null)} className="rounded-full">Cancel</Button>
            <Button onClick={requestMentor} className="rounded-full bg-primary hover:bg-primary/90">Send request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
