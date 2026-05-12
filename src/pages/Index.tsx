import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Briefcase, Calendar, Users, GraduationCap, Sparkles, Globe2, Heart, BookOpen, MessageCircle, Shield, ArrowRight, Star, Quote } from "lucide-react";

export default function Index() {
  return (
    <main className="overflow-hidden">
      {/* HERO — bold tribute to reference: huge display type, coral block, pill CTA, script accent */}
      <section className="relative bg-radial-glow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 sm:pt-16 pb-20">
          {/* Floating coral card with hero content */}
          <div className="relative rounded-[2.5rem] bg-coral overflow-hidden shadow-coral p-6 sm:p-12 lg:p-16">
            {/* decorative atom */}
            <svg className="absolute right-6 top-6 h-12 w-12 text-white/40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <ellipse cx="50" cy="50" rx="45" ry="18" />
              <ellipse cx="50" cy="50" rx="45" ry="18" transform="rotate(60 50 50)" />
              <ellipse cx="50" cy="50" rx="45" ry="18" transform="rotate(-60 50 50)" />
              <circle cx="50" cy="50" r="4" fill="currentColor" />
            </svg>
            <svg className="absolute right-16 bottom-12 h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0l2 8 8 4-8 4-2 8-2-8-8-4 8-4z" />
            </svg>
            <svg className="absolute left-8 top-1/2 h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0l2 8 8 4-8 4-2 8-2-8-8-4 8-4z" />
            </svg>

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" /> University Alumni Network
              </span>

              <h1 className="mt-6 text-white text-[clamp(2.5rem,8vw,7rem)] font-display leading-[0.9]">
                Education
                <br />
                That Guarantees
                <br />
                <span className="relative inline-block">
                  The Future
                  {/* script accent */}
                  <span className="absolute -right-4 -top-5 sm:-right-2 sm:-top-10 z-10 font-script text-white/95 text-5xl sm:text-7xl rotate-[-8deg] normal-case tracking-normal leading-none" style={{ fontFamily: "Satisfy, cursive", textTransform: "none" }}>
                    bridge
                  </span>
                </span>
              </h1>

              <div className="mt-8 flex items-center gap-3">
                <span className="rounded-full bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary shadow-soft">
                  Not Just A Diploma
                </span>
              </div>

              <p className="mt-8 max-w-2xl text-lg sm:text-xl text-white/90 leading-relaxed">
                A centralized platform for graduates, students and the university — share jobs, host events, mentor the next generation, and stay connected for life.
              </p>

              {/* Pill CTA matching reference */}
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link to="/auth" className="group flex items-center rounded-full bg-white p-1.5 pl-6 hover:pl-7 transition-all">
                  <span className="font-bold uppercase tracking-wider text-sm text-ink mr-3">Register Now</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-cream group-hover:rotate-45 transition-transform">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </Link>
                <Link to="/about" className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 transition">
                  Learn the story
                </Link>
              </div>

              {/* Three pill mini-features like reference */}
              <div className="mt-12 grid gap-4 sm:grid-cols-3 max-w-3xl">
                <MiniFeature icon={GraduationCap} label="Learn" emphasis="about" body="the bachelor's programs" />
                <MiniFeature icon={MessageCircle} label="Communicate" emphasis="You will" body="with students and teachers" />
                <MiniFeature icon={Shield} label="Make sure" emphasis="" body="the campus is safe" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <section className="border-y border-border/50 bg-card/50">
        <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <Stat n="2,400+" l="Active alumni" />
          <Stat n="180+" l="Jobs posted" />
          <Stat n="60" l="Events / year" />
          <Stat n="42" l="Countries" />
        </div>
      </section>

      {/* FEATURES — 6 cards, asymmetric */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] items-end mb-14">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">What's inside</span>
            <h2 className="mt-3 text-4xl sm:text-6xl font-display">Everything your<br />community needs.</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-xl lg:justify-self-end">
            From your first internship to your tenth career move, AlumBridge keeps the people who shaped you within reach — and gives you a way to give back.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard icon={Globe2} title="Global Directory" desc="Search graduates worldwide by year, course, company or city. Real connections, not LinkedIn noise." big />
          <FeatureCard icon={Briefcase} title="Job Board" desc="Alumni post openings at their companies. Students and graduates apply with one click." />
          <FeatureCard icon={Calendar} title="Events" desc="Reunions, lectures, mixers and webinars — all on one calendar." />
          <FeatureCard icon={Users} title="Mentorship" desc="Students request guidance from alumni working in their dream fields." />
          <FeatureCard icon={Heart} title="Give Back" desc="Donate, volunteer for talks, or sponsor a student bursary in a few clicks." />
          <FeatureCard icon={BookOpen} title="Stories" desc="Read where your classmates are now — and share your own milestones." />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-card/50 border-y border-border/50">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-16">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">How it works</span>
            <h2 className="mt-3 text-4xl sm:text-6xl font-display">Three steps. <span className="font-script normal-case text-primary" style={{ fontFamily: "Satisfy, cursive", textTransform: "none" }}>that's it.</span></h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Step n="01" title="Create your profile" body="Sign up with your university email, add your graduation year, course and where you are now." />
            <Step n="02" title="Connect with people" body="Browse the directory. Reach out to alumni in your field, find classmates, follow your favorite professors." />
            <Step n="03" title="Grow together" body="Apply to jobs, attend events, mentor a student, or post your own opportunity. Your network is the product." />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 max-w-2xl">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Voices</span>
          <h2 className="mt-3 text-4xl sm:text-6xl font-display">What graduates say.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Testimonial body="I found my first job through an alum I met on AlumBridge. Three years later I'm the one posting roles." name="Sarah K." role="Class of '21 · Software Engineer" />
          <Testimonial body="The directory is gold. I reconnected with my whole graduating class for our 10-year reunion." name="Daniel M." role="Class of '14 · Architect" />
          <Testimonial body="Mentoring two students this semester. Best decision I've made all year." name="Priya R." role="Class of '17 · Product Lead" />
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <div className="text-center mb-12">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">FAQ</span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-display">Questions, answered.</h2>
        </div>
        <div className="space-y-3">
          <Faq q="Who can join AlumBridge?" a="Current students, all graduates, and faculty. Just sign up with your university email." />
          <Faq q="Is there a fee?" a="No. AlumBridge is free for the entire community." />
          <Faq q="How are alumni verified?" a="Profiles are tied to your university email and reviewed by your alumni office." />
          <Faq q="Can I post a job?" a="Yes — any verified alumni can post openings to the job board." />
          <Faq q="Will my information be public?" a="Your profile is visible to other verified members only. You control what you share." />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-[2rem] bg-coral overflow-hidden p-10 sm:p-16 shadow-coral relative">
          <svg className="absolute right-10 top-10 h-20 w-20 text-white/20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <ellipse cx="50" cy="50" rx="45" ry="18" />
            <ellipse cx="50" cy="50" rx="45" ry="18" transform="rotate(60 50 50)" />
            <ellipse cx="50" cy="50" rx="45" ry="18" transform="rotate(-60 50 50)" />
          </svg>
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h3 className="text-white font-display text-4xl sm:text-6xl">
                Bridge the gap.<br />
                <span className="font-script normal-case text-white/90" style={{ fontFamily: "Satisfy, cursive", textTransform: "none" }}>start today.</span>
              </h3>
              <p className="mt-4 text-white/85 text-lg">Free for life. Built by graduates, for graduates.</p>
            </div>
            <Link to="/auth" className="group inline-flex items-center rounded-full bg-white p-1.5 pl-6 self-start lg:self-end">
              <span className="font-bold uppercase tracking-wider text-sm text-ink mr-3">Get Started</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-cream group-hover:rotate-45 transition-transform">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4 text-primary" /> AlumBridge © {new Date().getFullYear()}
          </div>
          <p className="text-xs text-muted-foreground">Built by Akankunda Precious Alena · Reg No 228 606</p>
          <div className="flex gap-4 text-sm">
            <Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link>
            <Link to="/features" className="text-muted-foreground hover:text-foreground">Features</Link>
            <Link to="/auth" className="text-muted-foreground hover:text-foreground">Join</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function MiniFeature({ icon: Icon, label, emphasis, body }: { icon: any; label: string; emphasis: string; body: string }) {
  return (
    <div className="flex items-start gap-3 text-white">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur">
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-sm leading-snug">
        {emphasis && <span className="font-bold italic">{emphasis} </span>}
        <span className="font-bold italic">{label}</span> <span className="opacity-90">{body}</span>
      </div>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="text-3xl sm:text-4xl font-display text-primary">{n}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{l}</div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, big }: { icon: any; title: string; desc: string; big?: boolean }) {
  return (
    <div className={`group rounded-3xl border border-border bg-card p-7 transition hover:border-primary/50 hover:bg-card/80 ${big ? "lg:row-span-2 lg:p-10 lg:flex lg:flex-col" : ""}`}>
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors ${big ? "lg:h-16 lg:w-16" : ""}`}>
        <Icon className={big ? "h-7 w-7" : "h-5 w-5"} />
      </div>
      <h3 className={`font-display ${big ? "text-3xl" : "text-xl"}`}>{title}</h3>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{desc}</p>
      {big && <div className="mt-auto pt-6 text-primary font-semibold text-sm flex items-center gap-1.5">Explore directory <ArrowRight className="h-4 w-4" /></div>}
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-8">
      <div className="font-display text-5xl text-primary">{n}</div>
      <h3 className="mt-4 text-xl font-display">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

function Testimonial({ body, name, role }: { body: string; name: string; role: string }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-7">
      <Quote className="h-6 w-6 text-primary mb-3" />
      <p className="text-foreground leading-relaxed">{body}</p>
      <div className="mt-5 flex items-center gap-1 text-primary">
        {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
      </div>
      <div className="mt-4 text-sm">
        <div className="font-semibold">{name}</div>
        <div className="text-muted-foreground">{role}</div>
      </div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-2xl border border-border bg-card p-5 open:border-primary/40">
      <summary className="cursor-pointer flex items-center justify-between gap-4 font-semibold text-base list-none">
        {q}
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-primary group-open:rotate-45 transition-transform">+</span>
      </summary>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a}</p>
    </details>
  );
}
