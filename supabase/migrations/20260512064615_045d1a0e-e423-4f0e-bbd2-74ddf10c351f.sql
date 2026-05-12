-- Add missing columns to profiles table for AlumBridge
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS role text DEFAULT 'student',
  ADD COLUMN IF NOT EXISTS graduation_year integer,
  ADD COLUMN IF NOT EXISTS course text,
  ADD COLUMN IF NOT EXISTS current_position text,
  ADD COLUMN IF NOT EXISTS company text,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS linkedin text;

-- Migrate existing display_name to full_name
UPDATE public.profiles SET full_name = display_name WHERE full_name IS NULL;
UPDATE public.profiles SET email = '' WHERE email IS NULL;
UPDATE public.profiles SET role = 'student' WHERE role IS NULL;

-- Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  posted_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  company text NOT NULL,
  location text,
  job_type text DEFAULT 'full-time',
  description text NOT NULL,
  apply_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jobs are viewable by everyone" ON public.jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create their own jobs" ON public.jobs FOR INSERT TO authenticated WITH CHECK (posted_by = auth.uid());
CREATE POLICY "Users can update their own jobs" ON public.jobs FOR UPDATE TO authenticated USING (posted_by = auth.uid());
CREATE POLICY "Users can delete their own jobs" ON public.jobs FOR DELETE TO authenticated USING (posted_by = auth.uid());

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  location text,
  event_date timestamp with time zone NOT NULL,
  max_attendees integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone" ON public.events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create their own events" ON public.events FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Users can update their own events" ON public.events FOR UPDATE TO authenticated USING (created_by = auth.uid());
CREATE POLICY "Users can delete their own events" ON public.events FOR DELETE TO authenticated USING (created_by = auth.uid());

-- Create mentorship_requests table
CREATE TABLE IF NOT EXISTS public.mentorship_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alumni_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view mentorship requests they are part of" ON public.mentorship_requests FOR SELECT TO authenticated USING (student_id = auth.uid() OR alumni_id = auth.uid());
CREATE POLICY "Students can create mentorship requests" ON public.mentorship_requests FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());
CREATE POLICY "Alumni can update status on their requests" ON public.mentorship_requests FOR UPDATE TO authenticated USING (alumni_id = auth.uid());

-- Clean up old sessions table (from previous app version)
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TYPE IF EXISTS public.session_status CASCADE;
DROP TYPE IF EXISTS public.project_type CASCADE;

-- Drop old messages table if exists
DROP TABLE IF EXISTS public.messages CASCADE;

-- Update trigger to also set full_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, full_name)
  VALUES (NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Ensure trigger is attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Updated at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Attach updated_at triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON public.jobs;
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_mentorship_updated_at ON public.mentorship_requests;
CREATE TRIGGER update_mentorship_updated_at BEFORE UPDATE ON public.mentorship_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Profiles RLS policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.jobs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.events FORCE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_requests FORCE ROW LEVEL SECURITY;

-- Constraints using DO blocks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_role_check' AND table_name = 'profiles'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('student', 'alumni'));
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'jobs_job_type_check' AND table_name = 'jobs'
  ) THEN
    ALTER TABLE public.jobs ADD CONSTRAINT jobs_job_type_check CHECK (job_type IN ('full-time', 'part-time', 'internship', 'contract'));
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'mentorship_requests_status_check' AND table_name = 'mentorship_requests'
  ) THEN
    ALTER TABLE public.mentorship_requests ADD CONSTRAINT mentorship_requests_status_check CHECK (status IN ('pending', 'accepted', 'declined'));
  END IF;
END
$$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_jobs_posted_by ON public.jobs(posted_by);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON public.events(created_by);
CREATE INDEX IF NOT EXISTS idx_mentorship_student ON public.mentorship_requests(student_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_alumni ON public.mentorship_requests(alumni_id);

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.mentorship_requests TO authenticated;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT INSERT ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT INSERT ON public.profiles TO anon;

-- User roles policies
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

ALTER TABLE public.user_roles FORCE ROW LEVEL SECURITY;

-- Ensure has_role function exists
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Verify
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
