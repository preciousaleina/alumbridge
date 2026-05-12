import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, MapPin, Building2, ExternalLink, Trash2 } from "lucide-react";

interface Job {
  id: string; posted_by: string; title: string; company: string;
  location: string | null; job_type: string; description: string;
  apply_url: string | null; created_at: string;
}

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", company: "", location: "", job_type: "full-time", description: "", apply_url: "" });

  const load = async () => {
    const { data } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
    setJobs((data as Job[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.title || !form.company || !form.description) { toast.error("Title, company, and description are required"); return; }
    const { error } = await supabase.from("jobs").insert({ ...form, posted_by: user!.id, apply_url: form.apply_url || null, location: form.location || null });
    if (error) { toast.error(error.message); return; }
    toast.success("Job posted!");
    setOpen(false); setForm({ title: "", company: "", location: "", job_type: "full-time", description: "", apply_url: "" });
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Removed");
    load();
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-wrap gap-4 items-end justify-between mb-10">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Jobs</p>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl">Open opportunities.</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-primary hover:bg-primary/90 px-6 h-11"><Plus className="h-4 w-4 mr-1" /> Post a job</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader><DialogTitle className="font-display text-2xl">Post a job</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl bg-input border-border" /></Field>
              <Field label="Company"><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="rounded-xl bg-input border-border" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Location"><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Remote / City" className="rounded-xl bg-input border-border" /></Field>
                <Field label="Type">
                  <select value={form.job_type} onChange={(e) => setForm({ ...form, job_type: e.target.value })} className="w-full h-9 rounded-xl bg-input border border-border px-3 text-sm">
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                    <option value="contract">Contract</option>
                  </select>
                </Field>
              </div>
              <Field label="Description"><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="rounded-xl bg-input border-border" /></Field>
              <Field label="Apply URL (optional)"><Input value={form.apply_url} onChange={(e) => setForm({ ...form, apply_url: e.target.value })} placeholder="https://…" className="rounded-xl bg-input border-border" /></Field>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-full">Cancel</Button>
              <Button onClick={submit} className="rounded-full bg-primary hover:bg-primary/90">Publish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {jobs.length === 0 ? (
        <p className="text-muted-foreground py-20 text-center">No jobs posted yet. Be the first.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {jobs.map((j) => (
            <div key={j.id} className="rounded-3xl border border-border bg-card p-7 hover:border-primary/50 transition">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary mb-2">{j.job_type}</span>
                  <h3 className="font-display text-2xl leading-tight">{j.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />{j.company}</span>
                    {j.location && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{j.location}</span>}
                  </div>
                </div>
                {j.posted_by === user?.id && (
                  <Button size="icon" variant="ghost" onClick={() => remove(j.id)} className="rounded-full text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                )}
              </div>
              <p className="mt-4 text-sm text-foreground/85 leading-relaxed line-clamp-3">{j.description}</p>
              {j.apply_url && (
                <a href={j.apply_url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-semibold hover:bg-primary/90">
                  Apply <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label><div className="mt-1.5">{children}</div></div>;
}
