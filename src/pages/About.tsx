import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap, Globe2, Heart } from "lucide-react";

export default function About() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">About</span>
      <h1 className="mt-3 text-5xl sm:text-7xl font-display">
        We connect generations of <span className="text-primary">graduates.</span>
      </h1>
      <p className="mt-8 text-xl text-muted-foreground max-w-3xl leading-relaxed">
        AlumBridge was born from a simple frustration: once you graduate, the people who shaped your years on campus disappear into LinkedIn voids and unread email lists. We built a single home for the alumni community — fast, focused, free for life.
      </p>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        <Pillar icon={GraduationCap} title="For students" body="A direct line to graduates working in your dream field. Mentorship, internships, advice." />
        <Pillar icon={Globe2} title="For alumni" body="Find classmates, share opportunities, and stay tied to your alma mater wherever life takes you." />
        <Pillar icon={Heart} title="For the university" body="A live, opt-in network — no more outdated address books or dead email blasts." />
      </div>

      <div className="mt-20 rounded-3xl bg-coral p-10 sm:p-14 text-white shadow-coral">
        <h2 className="font-display text-3xl sm:text-5xl">Built by a graduate.<br />For every graduate after.</h2>
        <p className="mt-4 max-w-2xl text-white/90 text-lg">
          AlumBridge is built by Akankunda Precious Alena (Reg No 228 606) as a final-year project — designed with the alumni offices in mind, ready to scale to any university.
        </p>
        <Link to="/auth" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white text-ink font-bold px-6 py-3">
          Join AlumBridge <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}

function Pillar({ icon: Icon, title, body }: any) {
  return (
    <div className="rounded-3xl border border-border bg-card p-7">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary mb-4">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-display text-xl">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
