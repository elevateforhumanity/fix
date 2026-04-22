-- Adds org_id to the builder execution layer tables.
-- organizations table already exists (20260227000003).
-- organization_users already exists with roles: org_owner, org_admin, instructor, reviewer, report_viewer.
-- program_organizations already exists for program-level org relationships.
--
-- This migration scopes the LMS execution layer (courses, modules, lessons)
-- to an org so partner content is isolated at the row level.
--
-- Strategy: add nullable first, backfill to Elevate Core org, then enforce NOT NULL.

-- ── 1. Ensure Elevate Core org exists ────────────────────────────────────────

INSERT INTO public.organizations (name, slug, type, status)
VALUES ('Elevate for Humanity', 'elevate-core', 'training_provider', 'active')
ON CONFLICT (slug) DO NOTHING;

-- ── 2. Add org_id to programs ─────────────────────────────────────────────────

ALTER TABLE public.programs
  ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;

UPDATE public.programs
SET org_id = (SELECT id FROM public.organizations WHERE slug = 'elevate-core' LIMIT 1)
WHERE org_id IS NULL;

-- ── 3. Add org_id to courses ──────────────────────────────────────────────────

ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;

UPDATE public.courses
SET org_id = (SELECT id FROM public.organizations WHERE slug = 'elevate-core' LIMIT 1)
WHERE org_id IS NULL;

-- ── 4. Add org_id to course_modules ──────────────────────────────────────────

ALTER TABLE public.course_modules
  ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;

UPDATE public.course_modules
SET org_id = (SELECT id FROM public.organizations WHERE slug = 'elevate-core' LIMIT 1)
WHERE org_id IS NULL;

-- ── 5. Add org_id to course_lessons ──────────────────────────────────────────

ALTER TABLE public.course_lessons
  ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;

UPDATE public.course_lessons
SET org_id = (SELECT id FROM public.organizations WHERE slug = 'elevate-core' LIMIT 1)
WHERE org_id IS NULL;

-- ── 6. Add org_id to program_course_map ──────────────────────────────────────

ALTER TABLE public.program_course_map
  ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;

UPDATE public.program_course_map
SET org_id = (SELECT id FROM public.organizations WHERE slug = 'elevate-core' LIMIT 1)
WHERE org_id IS NULL;

-- ── 7. Indexes for org-scoped queries ────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_programs_org_id       ON public.programs (org_id);
CREATE INDEX IF NOT EXISTS idx_courses_org_id        ON public.courses (org_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_org_id ON public.course_modules (org_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_org_id ON public.course_lessons (org_id);

-- ── 8. RLS policies — org members can read their org's content ───────────────
-- Write access remains service_role only (enforced at API layer).
-- These policies are additive — existing policies are preserved.

-- programs
DROP POLICY IF EXISTS "programs_org_read" ON public.programs;
CREATE POLICY "programs_org_read" ON public.programs
  FOR SELECT TO authenticated
  USING (
    org_id IS NULL  -- platform-owned (visible to all authenticated)
    OR org_id IN (
      SELECT org_id FROM public.organization_users
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- courses
DROP POLICY IF EXISTS "courses_org_read" ON public.courses;
CREATE POLICY "courses_org_read" ON public.courses
  FOR SELECT TO authenticated
  USING (
    org_id IS NULL
    OR org_id IN (
      SELECT org_id FROM public.organization_users
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- course_lessons
DROP POLICY IF EXISTS "course_lessons_org_read" ON public.course_lessons;
CREATE POLICY "course_lessons_org_read" ON public.course_lessons
  FOR SELECT TO authenticated
  USING (
    org_id IS NULL
    OR org_id IN (
      SELECT org_id FROM public.organization_users
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );
