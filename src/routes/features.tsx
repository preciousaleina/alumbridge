import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Briefcase, Calendar, Network, Users, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({ meta: [{ title: "Features — AlumBridge" }] }),
  component: Features,
});

const items = [
  { icon: Network, title: "Alumni Directory", desc: "Searchable directory of graduates with course and company filters." },
  { icon: Briefcase, title: "Job Board", desc: "Alumni post roles directly; students and peers apply with one click." },
  { icon: Calendar, title: "Events", desc: "University-wide events with date, location, and rich descriptions." },
  { icon: Users, title: "Mentorship", desc: "Students request guidance; alumni accept and connect." },
  { icon: ShieldCheck, title: "Secure by design", desc: "Role-based access control and row-level security on every record." },
  { icon: Sparkles, title: "Beautiful UI", desc: "Responsive interface that looks great on phone, tablet, and desktop." },
];

function Features() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-4xl font-bold">Features</h1>
      <p className="mt-3 text-muted-foreground">Everything AlumBridge offers, at a glance.</p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <Card key={it.title} className="p-6 shadow-soft transition hover:shadow-elegant">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <it.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">{it.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}
