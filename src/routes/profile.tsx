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
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "My Profile — AlumBridge" }] }),
  component: () => <RequireAuth><ProfilePage /></RequireAuth>,
});

function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (profile) setForm(profile); }, [profile]);
  if (!form) return <div className="p-10 text-center text-muted-foreground">Loading...</div>;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name,
      graduation_year: form.graduation_year ? Number(form.graduation_year) : null,
      course: form.course,
      current_position: form.current_position,
      company: form.company,
      bio: form.bio,
      location: form.location,
      linkedin: form.linkedin,
    }).eq("id", form.id);
    setLoading(false);
    if (error) toast.error(error.message);
    else { toast.success("Profile updated!"); refreshProfile(); }
  };

  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-1 text-3xl font-bold">My Profile</h1>
      <p className="mb-6 text-muted-foreground capitalize">Role: {form.role}</p>
      <Card className="p-6 shadow-soft">
        <form onSubmit={submit} className="space-y-4">
          <div><Label>Full name</Label><Input value={form.full_name || ""} onChange={(e) => set("full_name", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Course</Label><Input value={form.course || ""} onChange={(e) => set("course", e.target.value)} placeholder="BSc Computer Science" /></div>
            <div><Label>Graduation year</Label><Input type="number" value={form.graduation_year || ""} onChange={(e) => set("graduation_year", e.target.value)} placeholder="2024" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Current position</Label><Input value={form.current_position || ""} onChange={(e) => set("current_position", e.target.value)} placeholder="Software Engineer" /></div>
            <div><Label>Company</Label><Input value={form.company || ""} onChange={(e) => set("company", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Location</Label><Input value={form.location || ""} onChange={(e) => set("location", e.target.value)} placeholder="Kampala, Uganda" /></div>
            <div><Label>LinkedIn URL</Label><Input type="url" value={form.linkedin || ""} onChange={(e) => set("linkedin", e.target.value)} /></div>
          </div>
          <div><Label>Bio</Label><Textarea rows={4} value={form.bio || ""} onChange={(e) => set("bio", e.target.value)} placeholder="Tell others about you..." /></div>
          <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save changes"}</Button>
        </form>
      </Card>
    </main>
  );
}
