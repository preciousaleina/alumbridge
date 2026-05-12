import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Building2, MapPin, Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "Jobs — AlumBridge" }] }),
  component: () => <RequireAuth><JobsPage /></RequireAuth>,
});

function JobsPage() {
  const { profile, user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
    setJobs(data || []);
  };
  useEffect(() => { load(); }, []);

  const canPost = profile?.role === "alumni";

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Job Opportunities</h1>
          <p className="text-muted-foreground">Roles shared by alumni in the network.</p>
        </div>
        {canPost && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" /> Post a job</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Post a job</DialogTitle></DialogHeader>
              <JobForm onDone={() => { setOpen(false); load(); }} userId={user!.id} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((j) => (
          <Card key={j.id} className="p-6 shadow-soft transition hover:shadow-elegant">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{j.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground"><Building2 className="mr-1 inline h-3.5 w-3.5" />{j.company}</p>
                {j.location && <p className="mt-0.5 text-sm text-muted-foreground"><MapPin className="mr-1 inline h-3.5 w-3.5" />{j.location}</p>}
              </div>
              <Badge variant="secondary" className="capitalize">{j.job_type.replace("_", " ")}</Badge>
            </div>
            <p className="mt-3 line-clamp-3 text-sm text-foreground/80">{j.description}</p>
            {j.apply_url && (
              <Button asChild size="sm" variant="outline" className="mt-4">
                <a href={j.apply_url} target="_blank" rel="noopener noreferrer">Apply <ExternalLink className="ml-1 h-3 w-3" /></a>
              </Button>
            )}
          </Card>
        ))}
        {jobs.length === 0 && (
          <Card className="col-span-full p-12 text-center">
            <Briefcase className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">No jobs posted yet. {canPost && "Be the first!"}</p>
          </Card>
        )}
      </div>
    </main>
  );
}

function JobForm({ onDone, userId }: { onDone: () => void; userId: string }) {
  const [form, setForm] = useState({ title: "", company: "", location: "", description: "", job_type: "full_time", apply_url: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("jobs").insert({ ...form, posted_by: userId, apply_url: form.apply_url || null });
    setLoading(false);
    if (error) toast.error(error.message);
    else { toast.success("Job posted!"); onDone(); }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div><Label>Title *</Label><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Company *</Label><Input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></div>
        <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
      </div>
      <div>
        <Label>Type</Label>
        <Select value={form.job_type} onValueChange={(v) => setForm({ ...form, job_type: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="full_time">Full time</SelectItem>
            <SelectItem value="part_time">Part time</SelectItem>
            <SelectItem value="internship">Internship</SelectItem>
            <SelectItem value="contract">Contract</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div><Label>Description *</Label><Textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
      <div><Label>Apply URL</Label><Input type="url" value={form.apply_url} onChange={(e) => setForm({ ...form, apply_url: e.target.value })} /></div>
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Posting..." : "Post job"}</Button>
    </form>
  );
}
