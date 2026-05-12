import { Briefcase, Calendar, Users, Globe2, Heart, BookOpen, Shield, MessageCircle } from "lucide-react";

const features = [
  { icon: Globe2, title: "Global Alumni Directory", desc: "Filter by year, course, company, or country. Reconnect in seconds." },
  { icon: Briefcase, title: "Job Board", desc: "Alumni post openings; students and graduates apply with one click." },
  { icon: Calendar, title: "Events Calendar", desc: "Reunions, talks, webinars, mixers — never miss what's happening on campus or beyond." },
  { icon: Users, title: "Mentorship Program", desc: "Students request mentors; alumni accept or decline. Simple as that." },
  { icon: Heart, title: "Give Back", desc: "Donate to bursaries, sponsor an event, or volunteer to give a talk." },
  { icon: BookOpen, title: "Alumni Stories", desc: "Where are they now? Read and share career milestones." },
  { icon: MessageCircle, title: "Direct Messages", desc: "Reach out to any alumni profile directly — no email gatekeepers." },
  { icon: Shield, title: "Verified Members", desc: "University-email verification keeps the community real." },
];

export default function Features() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Features</span>
      <h1 className="mt-3 text-5xl sm:text-7xl font-display">Every tool your alumni network deserves.</h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-3xl">A focused product. No feeds, no ads, no clutter — just the things that bring graduates and students together.</p>

      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-3xl border border-border bg-card p-7 transition hover:border-primary/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary mb-5">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-xl">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
