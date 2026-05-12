import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="font-display text-[10rem] leading-none text-primary">404</div>
        <h1 className="font-display text-3xl mt-4">Page not found.</h1>
        <p className="mt-3 text-muted-foreground">The page you're after doesn't exist.</p>
        <Link to="/" className="mt-8 inline-flex rounded-full bg-primary text-primary-foreground px-6 py-3 font-semibold">Go home</Link>
      </div>
    </main>
  );
}
