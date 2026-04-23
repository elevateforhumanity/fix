# Canonical Component Map

This document records the canonical version of each diverged component family.
When migrating callers, update imports to the canonical path and delete dead copies.

---

## Status Key

- ✅ **Canonical** — this is the one source of truth
- 🔴 **Dead** — zero importers, safe to delete after confirming no dynamic imports
- 🟡 **Active non-canonical** — has importers, needs migration before deletion
- ⚠️ **Review** — context-specific, may be intentionally different

---

## Breadcrumbs

Two distinct components — different APIs, different purposes. Both are canonical.

| Path | Importers | Status | Purpose |
|------|-----------|--------|---------|
| `components/ui/Breadcrumbs.tsx` | 806 | ✅ Canonical | Explicit `items[]` prop, controlled, no JSON-LD |
| `components/seo/Breadcrumbs.tsx` | 7 | ✅ Canonical | Zero-prop, auto-generates from `usePathname()`, includes JSON-LD structured data |
| `components/Breadcrumbs.tsx` | 0 | 🔴 Delete | Dead copy — deleted |

**Action:** None. Both variants are intentional. `components/Breadcrumbs.tsx` was deleted (zero importers).

---

## Button

Two distinct components — different APIs, different purposes. Both are canonical.

| Path | Importers | Status | Purpose |
|------|-----------|--------|---------|
| `components/ui/Button.tsx` | 67 | ✅ Canonical | Full design-system button: `loading`, `size`, `fullWidth`, extends `HTMLButtonElement` |
| `components/locked/Button.tsx` | 1 | ✅ Canonical | Link-aware button: `href` renders as `<Link>`, `arrow` prop — used in locked/gated pages |
| `components/ui/design-system/Button.tsx` | 0 | 🔴 Delete | Dead copy — deleted |

**Action:** `design-system/Button` was deleted (zero importers). `locked/Button` is intentionally different — it supports `href` and `arrow` which `ui/Button` does not.

---

## HeroVideo

| Path | Importers | Status |
|------|-----------|--------|
| `components/marketing/HeroVideo.tsx` | 30 | ✅ Canonical |
| `components/HeroVideo.tsx` | 0 | 🔴 Delete |
| `components/home/HeroVideo.tsx` | 0 | 🔴 Delete |
| `components/ui/HeroVideo.tsx` | 0 | 🔴 Delete |

**Action:** Delete the 3 dead copies immediately.

---

## NotificationBell

| Path | Importers | Status |
|------|-----------|--------|
| `components/lms/NotificationBell.tsx` | 1 | ✅ Canonical (LMS context) |
| `components/NotificationBell.tsx` | 0 | 🔴 Delete |
| `components/community/NotificationBell.tsx` | 0 | 🔴 Delete |
| `components/navigation/NotificationBell.tsx` | 0 | 🔴 Delete |
| `components/notifications/NotificationBell.tsx` | 0 | 🔴 Delete |

**Action:** Delete the 4 dead copies. Verify `components/lms/NotificationBell` is the right
long-term home or move to `components/ui/` if it needs to be used outside LMS.

---

## LoadingSpinner

| Path | Importers | Status |
|------|-----------|--------|
| `components/LoadingSpinner.tsx` | 1 | ✅ Canonical (used by RouteGuard) |
| `components/lms/LoadingSpinner.tsx` | 0 | 🔴 Delete |
| `components/ui/LoadingSpinner.tsx` | 0 | 🔴 Delete |

**Action:** Delete the 2 dead copies. Consider moving canonical to `components/ui/` and
updating the 1 importer (`components/RouteGuard.tsx`).

---

## VideoPlayer

| Path | Importers | Status |
|------|-----------|--------|
| `components/VideoPlayer.tsx` | 0 | 🔴 Delete |
| `components/lms/VideoPlayer.tsx` | 0 | 🔴 Delete |
| `components/video/VideoPlayer.tsx` | 0 | 🔴 Delete |

**Note:** Active video playback uses `components/lms/InteractiveVideoPlayer` (30+ importers)
and `components/video/ProfessionalVideoPlayer`. The `VideoPlayer` family is entirely dead.

**Action:** Delete all 3 copies.

---

## Hero

| Path | Importers | Status |
|------|-----------|--------|
| `components/blocks/Hero.tsx` | 1 | ✅ Canonical (only active copy) |
| `components/Hero.tsx` | 0 | 🔴 Delete |
| `components/home/Hero.tsx` | 0 | 🔴 Delete |
| `components/marketing/Hero.tsx` | 0 | 🔴 Delete |

**Action:** Delete the 3 dead copies.

---

## HeroSection

Two distinct components — different APIs, different purposes. Both are canonical.

| Path | Importers | Status | Purpose |
|------|-----------|--------|---------|
| `components/ui/HeroSection.tsx` | 1 | ✅ Canonical | Design-system hero: `full`/`split`/`illustration`/`video` variants, exports `HeroVariant`, `HeroHeight`, `HeroCTA` types used by `lib/hero-config.ts` |
| `components/sections/HeroSection.tsx` | 2 | ✅ Canonical | Template hero: simpler API (`title`, `description`, `badges`, `primaryCTA`/`secondaryCTA` as `{text, href}`) — used by category page templates |
| `components/home/HeroSection.tsx` | 0 | 🔴 Delete | Dead copy — deleted |
| `components/layout/HeroSection.tsx` | 0 | 🔴 Delete | Dead copy — deleted |

**Action:** Dead copies deleted. Both active variants are intentional — do not merge without unifying the prop APIs first.

---

## CTASection

| Path | Importers | Status |
|------|-----------|--------|
| `components/sections/CTASection.tsx` | 2 | ✅ Canonical |
| `components/blocks/CTASection.tsx` | 0 | 🔴 Delete |
| `components/shared/CTASection.tsx` | 0 | 🔴 Delete |

**Action:** Delete the 2 dead copies.

---

## CoursePlayer

| Path | Importers | Status |
|------|-----------|--------|
| `app/career-services/courses/[slug]/learn/CoursePlayer.tsx` | 1 | ⚠️ Route-local, keep |
| `app/courses/[courseId]/learn/CoursePlayer.tsx` | 0 | 🔴 Delete (unused) |
| `components/CoursePlayer.tsx` | 0 | 🔴 Delete |
| `components/course/CoursePlayer.tsx` | 0 | 🔴 Delete |

**Action:** Delete the 3 dead copies. The career-services copy is route-local and intentional.

---

## Summary: Immediate Safe Deletes (all zero importers)

```
components/Breadcrumbs.tsx
components/ui/design-system/Button.tsx
components/HeroVideo.tsx
components/home/HeroVideo.tsx
components/ui/HeroVideo.tsx
components/NotificationBell.tsx
components/community/NotificationBell.tsx
components/navigation/NotificationBell.tsx
components/notifications/NotificationBell.tsx
components/lms/LoadingSpinner.tsx
components/ui/LoadingSpinner.tsx
components/VideoPlayer.tsx
components/lms/VideoPlayer.tsx
components/video/VideoPlayer.tsx
components/Hero.tsx
components/home/Hero.tsx
components/marketing/Hero.tsx
components/home/HeroSection.tsx
components/layout/HeroSection.tsx
components/blocks/CTASection.tsx
components/shared/CTASection.tsx
app/courses/[courseId]/learn/CoursePlayer.tsx
components/CoursePlayer.tsx
components/course/CoursePlayer.tsx
```

24 files. Verify with `grep -r "ComponentName" app/ components/ --include="*.tsx"` before each delete.

## Pending Migrations Before Delete

None. All previously flagged "migrations" were API-incompatible components serving distinct
purposes. They are documented above as intentional dual-canonical pairs.
