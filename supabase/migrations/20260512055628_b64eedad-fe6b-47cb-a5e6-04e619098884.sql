
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin', 'alumni', 'student');
CREATE TYPE public.job_type AS ENUM ('full_time', 'part_time', 'internship', 'contract');
CREATE TYPE public.mentorship_status AS ENUM ('pending', 'accepted', 'declined');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  role TEXT NOT NULL DEFAULT 'student',
  graduation_year INT,
  course TEXT,
  current_position TEXT,
  company TEXT,
  bio TEXT,
  location TEXT,
  linkedin TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles (separate)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Jobs
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  description TEXT NOT NULL,
  job_type public.job_type NOT NULL DEFAULT 'full_time',
  apply_url TEXT,
  posted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  image_url TEXT,
  posted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Mentorship requests
CREATE TABLE public.mentorship_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alumni_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status public.mentorship_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: any authenticated user can view, only owner can update
CREATE POLICY "Profiles viewable by authenticated" ON public.profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- user_roles: users can view their own; admins can view all (avoid recursion via has_role)
CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Jobs: everyone authenticated can view; alumni or admin can post; only owner/admin can update/delete
CREATE POLICY "Jobs viewable by authenticated" ON public.jobs
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Alumni post jobs" ON public.jobs
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = posted_by AND (public.has_role(auth.uid(), 'alumni') OR public.has_role(auth.uid(), 'admin'))
  );
CREATE POLICY "Owner or admin update jobs" ON public.jobs
  FOR UPDATE TO authenticated USING (auth.uid() = posted_by OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owner or admin delete jobs" ON public.jobs
  FOR DELETE TO authenticated USING (auth.uid() = posted_by OR public.has_role(auth.uid(), 'admin'));

-- Events: everyone authenticated views; alumni/admin posts
CREATE POLICY "Events viewable by authenticated" ON public.events
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Alumni or admin post events" ON public.events
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = posted_by AND (public.has_role(auth.uid(), 'alumni') OR public.has_role(auth.uid(), 'admin'))
  );
CREATE POLICY "Owner or admin update events" ON public.events
  FOR UPDATE TO authenticated USING (auth.uid() = posted_by OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owner or admin delete events" ON public.events
  FOR DELETE TO authenticated USING (auth.uid() = posted_by OR public.has_role(auth.uid(), 'admin'));

-- Mentorship: student creates; both parties view; alumni updates status
CREATE POLICY "Parties view mentorship" ON public.mentorship_requests
  FOR SELECT TO authenticated USING (auth.uid() = student_id OR auth.uid() = alumni_id);
CREATE POLICY "Students request mentorship" ON public.mentorship_requests
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Alumni update status" ON public.mentorship_requests
  FOR UPDATE TO authenticated USING (auth.uid() = alumni_id);

-- Auto-create profile + role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _role TEXT;
BEGIN
  _role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    _role
  );
  IF _role = 'alumni' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'alumni');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at trigger for profiles
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
