-- Replaces the hardcoded PROGRAM_COURSE_MAP in lib/course-builder/schema.ts.
-- Links a program slug to its canonical course_id so new programs can be
-- registered without a code deploy.

CREATE TABLE IF NOT EXISTS public.program_course_map (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_slug    TEXT NOT NULL UNIQUE,
  course_id       UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed the two existing hardcoded entries.
-- UUIDs match lib/courses/hvac-uuids.ts and lib/course-builder/schema.ts.
INSERT INTO public.program_course_map (program_slug, course_id)
VALUES
  ('hvac-technician',      'f0593164-55be-5867-98e7-8a86770a8dd0'),
  ('barber-apprenticeship', '3fb5ce19-1cde-434c-a8c6-f138d7d7aa17')
ON CONFLICT (program_slug) DO NOTHING;

-- Trigger to keep updated_at current.
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS program_course_map_updated_at ON public.program_course_map;
CREATE TRIGGER program_course_map_updated_at
  BEFORE UPDATE ON public.program_course_map
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS: readable by authenticated users, writable only by service role.
ALTER TABLE public.program_course_map ENABLE ROW LEVEL SECURITY;

CREATE POLICY "program_course_map_read"
  ON public.program_course_map FOR SELECT
  TO authenticated USING (true);

-- Admin API for registering new programs.
-- POST /api/admin/course-builder/program-map
GRANT SELECT ON public.program_course_map TO authenticated, anon;
GRANT ALL    ON public.program_course_map TO service_role;
