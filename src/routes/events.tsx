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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/events")({
  head: () => ({ meta: [{ title: "Events — AlumBridge" }] }),
  component: () => <RequireAuth><EventsPage /></RequireAuth>,
});

function EventsPage() {
  const { profile, user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: true });
    setEvents(data || []);
  };
  useEffect(() => { load(); }, []);

  const canPost = profile?.role === "alumni";

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">University Events</h1>
          <p className="text-muted-foreground">Reunions, lectures, and networking moments.</p>
        </div>
        {canPost && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" /> Add event</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Add event</DialogTitle></DialogHeader>
              <EventForm onDone={() => { setOpen(false); load(); }} userId={user!.id} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((ev) => (
          <Card key={ev.id} className="overflow-hidden p-0 shadow-soft transition hover:shadow-elegant">
            <div className="bg-hero p-5 text-primary-foreground">
              <div className="text-xs uppercase tracking-wider opacity-80">{new Date(ev.event_date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}</div>
              <h3 className="mt-1 text-lg font-semibold">{ev.title}</h3>
            </div>
            <div className="p-5">
              {ev.location && <p className="mb-2 text-sm text-muted-foreground"><MapPin className="mr-1 inline h-3.5 w-3.5" />{ev.location}</p>}
              <p className="line-clamp-4 text-sm text-foreground/80">{ev.description}</p>
            </div>
          </Card>
        ))}
        {events.length === 0 && (
          <Card className="col-span-full p-12 text-center">
            <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">No events scheduled yet.</p>
          </Card>
        )}
      </div>
    </main>
  );
}

function EventForm({ onDone, userId }: { onDone: () => void; userId: string }) {
  const [form, setForm] = useState({ title: "", description: "", location: "", event_date: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("events").insert({ ...form, event_date: new Date(form.event_date).toISOString(), posted_by: userId });
    setLoading(false);
    if (error) toast.error(error.message);
    else { toast.success("Event added!"); onDone(); }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div><Label>Title *</Label><Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
      <div><Label>Date & time *</Label><Input type="datetime-local" required value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} /></div>
      <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
      <div><Label>Description *</Label><Textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Saving..." : "Add event"}</Button>
    </form>
  );
}
