import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — AlumBridge" }, { name: "description", content: "About the AlumBridge alumni management platform." }] }),
  component: About,
});

function About() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold">About AlumBridge</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        AlumBridge is a web-based University Alumni Management System that strengthens the
        relationship between graduates, current students, and the university community.
      </p>
      <Card className="mt-8 p-6 shadow-soft">
        <h2 className="text-xl font-semibold">Our mission</h2>
        <p className="mt-2 text-muted-foreground">
          To create a centralized, modern platform where alumni can mentor students, share
          career opportunities, and stay engaged with their alma mater long after graduation.
        </p>
      </Card>
      <Card className="mt-4 p-6 shadow-soft">
        <h2 className="text-xl font-semibold">The team</h2>
        <p className="mt-2 text-muted-foreground">
          Designed and developed by <strong>Akankunda Precious Alena</strong> (Reg No 228 606)
          as a final-year project demonstrating full-stack web development with a focus on
          accessibility, security, and beautiful design.
        </p>
      </Card>
    </main>
  );
}
