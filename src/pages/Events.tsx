import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, MapPin, CalendarDays, Trash2 } from "lucide-react";

interface Ev { id: string; created_by: string; title: string; description: string | null; location: string | null; event_date: string; }

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Ev[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", location: "", event_date: "" });

  const load = async () => {
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: true });
    setEvents((data as Ev[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.title || !form.event_date) { toast.error("Title and date are required"); return; }
    const { error } = await supabase.from("events").insert({
      title: form.title, description: form.description || null, location: form.location || null,
      event_date: new Date(form.event_date).toISOString(), created_by: user!.id,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Event created!");
    setOpen(false); setForm({ title: "", description: "", location: "", event_date: "" });
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Removed");
    load();
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex flex-wrap gap-4 items-end justify-between mb-10">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Events</p>
          <h1 className="mt-2 font-display text-5xl sm:text-6xl">What's coming up.</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-primary hover:bg-primary/90 px-6 h-11"><Plus className="h-4 w-4 mr-1" /> Add event</Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle className="font-display text-2xl">Add event</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl bg-input border-border" /></Field>
              <Field label="Date & time"><Input type="datetime-local" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className="rounded-xl bg-input border-border" /></Field>
              <Field label="Location"><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Campus / City / Online" className="rounded-xl bg-input border-border" /></Field>
              <Field label="Description"><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="rounded-xl bg-input border-border" /></Field>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)} className="rounded-full">Cancel</Button>
              <Button onClick={submit} className="rounded-full bg-primary hover:bg-primary/90">Publish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {events.length === 0 ? (
        <p className="text-muted-foreground py-20 text-center">No events yet.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => {
            const d = new Date(e.event_date);
            return (
              <div key={e.id} className="rounded-3xl border border-border bg-card p-6 hover:border-primary/50 transition">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-primary text-primary-foreground p-3 text-center shrink-0 w-16">
                    <div className="text-xs uppercase font-bold tracking-wider">{d.toLocaleString("en", { month: "short" })}</div>
                    <div className="font-display text-2xl">{d.getDate()}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-xl leading-tight">{e.title}</h3>
                    <div className="mt-1 text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{d.toLocaleString("en", { hour: "numeric", minute: "2-digit" })}</div>
                      {e.location && <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{e.location}</div>}
                    </div>
                  </div>
                  {e.created_by === user?.id && (
                    <Button size="icon" variant="ghost" onClick={() => remove(e.id)} className="rounded-full text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                  )}
                </div>
                {e.description && <p className="mt-4 text-sm text-foreground/85 leading-relaxed line-clamp-3">{e.description}</p>}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label><div className="mt-1.5">{children}</div></div>;
}
