import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

export default function Profile() {
  const { profile, user, refreshProfile } = useAuth();
  const [form, setForm] = useState<any>(profile ?? {});
  const [saving, setSaving] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => { if (profile) setForm(profile); }, [profile]);
  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data } = await supabase
        .from("mentorship_requests")
        .select("*, student:profiles!mentorship_requests_student_id_fkey(full_name)")
        .or(`alumni_id.eq.${user.id},student_id.eq.${user.id}`)
        .order("created_at", { ascending: false });
      setRequests(data ?? []);
    })();
  }, [user]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name, role: form.role, graduation_year: form.graduation_year ? Number(form.graduation_year) : null,
      course: form.course, current_position: form.current_position, company: form.company,
      bio: form.bio, location: form.location, linkedin: form.linkedin,
    }).eq("id", user!.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile saved");
    refreshProfile();
  };

  const respond = async (id: string, status: "accepted" | "declined") => {
    const { error } = await supabase.from("mentorship_requests").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Request ${status}`);
    setRequests((r) => r.map((x) => x.id === id ? { ...x, status } : x));
  };

  const incoming = requests.filter((r) => r.alumni_id === user?.id);
  const outgoing = requests.filter((r) => r.student_id === user?.id);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Profile</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl mb-10">Your story.</h1>

      <div className="rounded-3xl border border-border bg-card p-7 space-y-4 mb-10">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name"><Input value={form.full_name ?? ""} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="rounded-xl bg-input border-border" /></Field>
          <Field label="I am">
            <select value={form.role ?? "student"} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full h-9 rounded-xl bg-input border border-border px-3 text-sm">
              <option value="student">Student</option>
              <option value="alumni">Alumni</option>
            </select>
          </Field>
          <Field label="Course / Program"><Input value={form.course ?? ""} onChange={(e) => setForm({ ...form, course: e.target.value })} className="rounded-xl bg-input border-border" /></Field>
          <Field label="Graduation year"><Input type="number" value={form.graduation_year ?? ""} onChange={(e) => setForm({ ...form, graduation_year: e.target.value })} className="rounded-xl bg-input border-border" /></Field>
          <Field label="Current position"><Input value={form.current_position ?? ""} onChange={(e) => setForm({ ...form, current_position: e.target.value })} className="rounded-xl bg-input border-border" /></Field>
          <Field label="Company"><Input value={form.company ?? ""} onChange={(e) => setForm({ ...form, company: e.target.value })} className="rounded-xl bg-input border-border" /></Field>
          <Field label="Location"><Input value={form.location ?? ""} onChange={(e) => setForm({ ...form, location: e.target.value })} className="rounded-xl bg-input border-border" /></Field>
          <Field label="LinkedIn URL"><Input value={form.linkedin ?? ""} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/…" className="rounded-xl bg-input border-border" /></Field>
        </div>
        <Field label="Bio"><Textarea value={form.bio ?? ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} className="rounded-xl bg-input border-border" placeholder="Tell the community about yourself…" /></Field>
        <Button onClick={save} disabled={saving} className="rounded-full bg-primary hover:bg-primary/90 px-8 h-11">{saving ? "Saving…" : "Save profile"}</Button>
      </div>

      {incoming.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-2xl mb-4">Mentorship requests for you</h2>
          <div className="space-y-3">
            {incoming.map((r) => (
              <div key={r.id} className="rounded-2xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="font-semibold">{r.student?.full_name ?? "A student"}</div>
                  <p className="text-sm text-muted-foreground mt-1">{r.message}</p>
                </div>
                {r.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => respond(r.id, "accepted")} className="rounded-full bg-primary hover:bg-primary/90"><Check className="h-3.5 w-3.5 mr-1" /> Accept</Button>
                    <Button size="sm" variant="outline" onClick={() => respond(r.id, "declined")} className="rounded-full"><X className="h-3.5 w-3.5 mr-1" /> Decline</Button>
                  </div>
                ) : (
                  <span className={`text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full ${r.status === "accepted" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>{r.status}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {outgoing.length > 0 && (
        <section>
          <h2 className="font-display text-2xl mb-4">Your mentorship requests</h2>
          <div className="space-y-3">
            {outgoing.map((r) => (
              <div key={r.id} className="rounded-2xl border border-border bg-card p-5 flex justify-between items-center">
                <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{r.message}</p>
                <span className={`text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full ${r.status === "accepted" ? "bg-primary/20 text-primary" : r.status === "declined" ? "bg-destructive/20 text-destructive" : "bg-secondary text-muted-foreground"}`}>{r.status}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label><div className="mt-1.5">{children}</div></div>;
}
