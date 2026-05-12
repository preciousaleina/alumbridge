
-- 1. Extend profiles with alumni fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'student',
  ADD COLUMN IF NOT EXISTS graduation_year integer,
  ADD COLUMN IF NOT EXISTS course text,
  ADD COLUMN IF NOT EXISTS current_position text,
  ADD COLUMN IF NOT EXISTS company text,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS linkedin text;

-- Backfill full_name from display_name
UPDATE public.profiles SET full_name = display_name WHERE full_name IS NULL;

-- Update handle_new_user to capture more fields and create student role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, display_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Make profiles publicly readable (directory)
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
CREATE POLICY "Profiles are publicly viewable"
  ON public.profiles FOR SELECT
  USING (true);

-- 2. Jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  posted_by uuid NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  location text,
  job_type text NOT NULL DEFAULT 'full-time',
  description text NOT NULL,
  apply_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jobs are viewable by authenticated users"
  ON public.jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can post jobs"
  ON public.jobs FOR INSERT TO authenticated WITH CHECK (auth.uid() = posted_by);
CREATE POLICY "Users can update own jobs"
  ON public.jobs FOR UPDATE TO authenticated USING (auth.uid() = posted_by OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can delete own jobs"
  ON public.jobs FOR DELETE TO authenticated USING (auth.uid() = posted_by OR has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_jobs_updated_at BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 3. Events table
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL,
  title text NOT NULL,
  description text,
  location text,
  event_date timestamptz NOT NULL,
  cover_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events viewable by authenticated"
  ON public.events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create events"
  ON public.events FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators or admins update events"
  ON public.events FOR UPDATE TO authenticated USING (auth.uid() = created_by OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Creators or admins delete events"
  ON public.events FOR DELETE TO authenticated USING (auth.uid() = created_by OR has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- 4. Mentorship requests
CREATE TABLE IF NOT EXISTS public.mentorship_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  alumni_id uuid NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants view their requests"
  ON public.mentorship_requests FOR SELECT TO authenticated
  USING (auth.uid() = student_id OR auth.uid() = alumni_id);
CREATE POLICY "Students create requests"
  ON public.mentorship_requests FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Alumni update status"
  ON public.mentorship_requests FOR UPDATE TO authenticated
  USING (auth.uid() = alumni_id);
CREATE POLICY "Student cancels"
  ON public.mentorship_requests FOR DELETE TO authenticated
  USING (auth.uid() = student_id);

CREATE TRIGGER set_mentorship_updated_at BEFORE UPDATE ON public.mentorship_requests
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
