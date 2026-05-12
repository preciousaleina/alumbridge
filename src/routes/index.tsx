import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Briefcase, Calendar, GraduationCap, Network, Users, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AlumBridge — Connect Alumni, Students & University" },
      { name: "description", content: "A modern platform that bridges alumni, current students, and the university through jobs, events, mentorship, and a global directory." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="max-w-3xl text-primary-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> University Alumni Network
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-6xl">
              Where graduates, students &<br />
              <span className="text-gold">the university stay connected.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-primary-foreground/85">
              AlumBridge is a centralized platform for sharing job opportunities,
              celebrating university events, and connecting students with alumni mentors —
              all in one beautifully designed home.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold text-primary hover:bg-gold/90">
                <Link to="/auth">Join AlumBridge <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-primary-foreground backdrop-blur hover:bg-white/20">
                <Link to="/about">Learn more</Link>
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              <Stat n="2K+" l="Alumni" />
              <Stat n="120+" l="Jobs posted" />
              <Stat n="40+" l="Events / yr" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Everything your alumni community needs</h2>
          <p className="mt-3 text-muted-foreground">Built for universities, designed for connection.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Feature icon={Network} title="Alumni Directory" desc="Search and connect with graduates worldwide by year, course, or industry." />
          <Feature icon={Briefcase} title="Job Board" desc="Alumni share roles at their companies, opening doors for fellow graduates and students." />
          <Feature icon={Calendar} title="University Events" desc="Stay updated with reunions, lectures, and networking events from your alma mater." />
          <Feature icon={Users} title="Mentorship" desc="Students request guidance from alumni working in their dream fields." />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <Card className="overflow-hidden border-0 bg-hero p-10 text-primary-foreground shadow-elegant sm:p-14">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold sm:text-3xl">Ready to bridge the gap?</h3>
              <p className="mt-2 text-primary-foreground/85">Create your profile and join the alumni community today.</p>
            </div>
            <Button asChild size="lg" className="bg-gold text-primary hover:bg-gold/90">
              <Link to="/auth">Get started free</Link>
            </Button>
          </div>
        </Card>
      </section>

      <footer className="border-t bg-secondary/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4" /> AlumBridge © {new Date().getFullYear()}
          </div>
          <p className="text-xs text-muted-foreground">Built by Akankunda Precious Alena · Reg No 228 606</p>
        </div>
      </footer>
    </main>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-gold sm:text-3xl">{n}</div>
      <div className="text-xs uppercase tracking-wider text-primary-foreground/70">{l}</div>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <Card className="bg-card-gradient p-6 shadow-soft transition hover:shadow-elegant">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </Card>
  );
}
