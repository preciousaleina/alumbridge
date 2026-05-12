import { useState, FormEvent, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => { if (user) navigate("/dashboard"); }, [user, navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard`, data: { full_name: fullName } },
        });
        if (error) throw error;
        toast.success("Account created! You're in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
      }
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Left: form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-md p-8 bg-card border-border">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-display text-lg">AlumBridge</span>
          </Link>

          <h1 className="font-display text-3xl mb-2">{mode === "signup" ? "Join the bridge" : "Welcome back"}</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "signup" ? "Create your alumni account" : "Sign in to your account"}
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="mt-1.5 rounded-xl bg-input border-border" />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1.5 rounded-xl bg-input border-border" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-1.5 rounded-xl bg-input border-border" />
            </div>
            <Button type="submit" disabled={loading} className="w-full rounded-full bg-primary hover:bg-primary/90 h-11 font-semibold">
              {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Already a member?" : "New here?"}{" "}
            <button onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="text-primary font-semibold hover:underline">
              {mode === "signup" ? "Sign in" : "Create account"}
            </button>
          </div>
        </Card>
      </div>

      {/* Right: brand panel */}
      <div className="hidden lg:flex items-center justify-center bg-coral p-12 relative overflow-hidden">
        <svg className="absolute right-10 top-10 h-32 w-32 text-white/20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="50" cy="50" rx="45" ry="18" />
          <ellipse cx="50" cy="50" rx="45" ry="18" transform="rotate(60 50 50)" />
          <ellipse cx="50" cy="50" rx="45" ry="18" transform="rotate(-60 50 50)" />
        </svg>
        <div className="relative text-white max-w-md">
          <h2 className="font-display text-5xl xl:text-7xl leading-[0.9]">
            Bridge<br />
            <span className="font-script normal-case" style={{ fontFamily: "Satisfy, cursive", textTransform: "none" }}>your</span><br />
            future.
          </h2>
          <p className="mt-6 text-white/90 text-lg">Join 2,400+ graduates already here.</p>
        </div>
      </div>
    </main>
  );
}
