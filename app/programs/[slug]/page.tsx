<<<<<<< HEAD
import { getAdminClient } from '@/lib/supabase/admin';

import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { programs } from '@/app/data/programs';
import { ProgramTemplate } from '@/components/programs/ProgramTemplate';
import { VisualProgramTemplate } from '@/components/programs/VisualProgramTemplate';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { PROGRAM_CATEGORIES } from '@/components/programs/ProgramPageWrapper';
import { EligibilityNotice } from '@/components/EligibilityNotice';
import { ProgramTutorCTA } from '@/components/ProgramTutorCTA';
import { PROGRAMS } from '@/lib/ai/programRegistry';

// Programs that use the new visual-first template (DB canonical slugs + aliases)
const VISUAL_TEMPLATE_PROGRAMS = [
  'barber-apprenticeship',
  'cna-cert',
  'esthetician',
  'hvac-technician',
  'cdl-training',
  'tax-prep',
  'business-startup',
  'peer-recovery-specialist',
  'beauty-career-educator',
  'phlebotomy-technician',
  // Aliases that may still be hit before redirect
  'barber', 'cna', 'cna-certification', 'healthcare', 'beauty',
  'esthetician-apprenticeship', 'hvac', 'skilled-trades', 'business',
  'tax-preparation', 'cdl', 'jri',
];

// ISR: render on first request, cache for 10 minutes.
// generateStaticParams is intentionally absent — pre-building all slugs causes OOM.
// Next.js renders unknown slugs on demand and caches them at the CDN edge.
export const revalidate = 600;

type Params = Promise<{ slug: string }>;

const SITE_URL = 'https://www.elevateforhumanity.org';


// Load program from JSON file or TypeScript data
async function loadProgram(slug: string): Promise<Program | null> {
  // First, try to load from JSON file
  const jsonPath = path.join(process.cwd(), 'data', 'programs', `${slug}.json`);

  if (fs.existsSync(jsonPath)) {
    try {
      const fileContent = fs.readFileSync(jsonPath, 'utf-8');
      const data = JSON.parse(fileContent);
      return data as Program;
    } catch (error) { /* Error handled silently */ }
  }

  // Fallback to TypeScript data
  return programs.find((p) => p.slug === slug) || null;
}


// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  let program = await loadProgram(slug);

  // Fallback to DB if no static data
  if (!program) {
    try {
      const supabase = await getAdminClient();
      if (supabase) {
        const { data } = await supabase
          .from('programs')
          .select('title, description')
          .eq('slug', slug)
          .eq('status', 'active')
          .single();
        program = data;
      }
    } catch { /* DB unavailable */ }
  }

  if (!program) {
    return {
      title: 'Program Not Found | Elevate for Humanity',
      description: 'The requested program could not be found.',
    };
  }

  return {
    title: `${program.title || program.title || program.name} | Career Training | Elevate for Humanity`,
    description: program.shortDescription || program.description,
    alternates: {
      canonical: `https://www.elevateforhumanity.org/programs/${slug}`,
    },
    openGraph: {
      title: program.title || program.name,
      description: program.shortDescription,
      type: 'website',
      url: `https://www.elevateforhumanity.org/programs/${slug}`,
    },
  };
}

// Main page component - Server Component by default
export default async function ProgramDetailPage({
  params,
}: {
  params: Params;
}) {
  let slug: string;
  
  try {
    slug = (await params).slug;
  } catch {
    return notFound();
  }

  // Validate slug format to prevent bad queries
  if (!slug || typeof slug !== 'string' || slug.length > 100) {
    return notFound();
  }

  // Only skip slugs that have a real dedicated page.tsx still present.
  // All other program pages were consolidated into this catch-all route.
  const DEDICATED_PAGES = [
    'cdl', // app/programs/cdl/page.tsx exists
  ];
  if (DEDICATED_PAGES.includes(slug)) {
    return notFound();
  }

  let program: Program | null = null;

  let dbOutcomes: { outcome: string }[] = [];
  let dbRequirements: { requirement: string }[] = [];

  // Try static data first (fast, no network)
  program = await loadProgram(slug);

  // If no static data, query DB using canonical data layer
  if (!program) {
    try {
      const { getProgramBySlug: getDbProgram } = await import('@/lib/db/programs');
      const dbProgram = await getDbProgram(slug);
      // Map DbProgram shape to the display shape expected by this page
      program = {
        ...dbProgram,
        name: dbProgram.title,
        // Map DB funding to display-compatible shape
        fundingOptions: dbProgram.program_funding
          ?.filter(f => f.is_active)
          .map(f => f.type) ?? [],
      };
    } catch {
      // Program not in DB — will 404 below
    }
  }

  // Fetch outcomes/requirements from DB if program has an ID
  if (program?.id) {
    try {
      const supabase = await getAdminClient();
      if (supabase) {
        const { data: outcomes } = await supabase
          .from('program_outcomes')
          .select('outcome')
          .eq('program_id', program.id)
          .order('outcome_order', { ascending: true });

        const { data: requirements } = await supabase
          .from('program_requirements')
          .select('requirement')
          .eq('program_id', program.id)
          .order('requirement_order', { ascending: true });

        dbOutcomes = outcomes || [];
        dbRequirements = requirements || [];
      }
    } catch {
      // Non-fatal — page renders without outcomes/requirements
    }
  }

  // Return 404 if program not found
  if (!program) {
    return notFound();
  }

  // Get category for breadcrumbs
  const category = PROGRAM_CATEGORIES[slug];
  const breadcrumbItems = [
    { label: 'Programs', href: '/programs' },
    ...(category ? [{ label: category.name, href: category.href }] : []),
    { label: program.title || program.name || slug },
  ];

  // Map database fields to display fields
  const displayProgram = {
    name: program.title || program.name || program.title,
    description: program.full_description || program.description || program.longDescription || program.shortDescription || program.excerpt,
    shortDescription: program.excerpt || program.shortDescription || program.description,
    duration: program.duration_weeks ? `${program.duration_weeks} weeks` : program.duration || program.estimated_weeks ? `${program.estimated_weeks} weeks` : null,
    hours: program.training_hours || program.estimated_hours,
    credential: program.credential_name || program.credential_type,
    deliveryMethod: program.delivery_method,
    cost: program.total_cost,
    salaryMin: program.salary_min,
    salaryMax: program.salary_max,
    whatYouLearn: (() => {
      const raw = program.what_you_learn || program.whatYouLearn;
      if (!raw) return null;
      if (!Array.isArray(raw)) return [String(raw)];
      return raw.map((item: any) => {
        if (typeof item === 'string') return item;
        return item?.topic || item?.title || item?.statement || String(item);
      });
    })(),
    careerOutcomes: (() => {
      const raw = dbOutcomes.length > 0
        ? dbOutcomes.map(o => o.outcome)
        : (program.career_outcomes || program.careerOutcomes || program.outcomes);
      if (!Array.isArray(raw)) return raw ? [String(raw)] : [];
      // Flatten objects to strings — DB may return {outcome:string} or {statement:string}
      return raw.map((item: any) => {
        if (typeof item === 'string') return item;
        return item?.outcome || item?.statement || item?.title || JSON.stringify(item);
      });
    })(),
    prerequisites: dbRequirements.length > 0
      ? dbRequirements.map(r => r.requirement).join(', ')
      : program.prerequisites,
    fundingEligible: program.funding_eligible || program.wioa_approved,
    placementRate: program.placement_rate,
    completionRate: program.completion_rate,
  };

  // If program has minimal data (from simple JSON), render simple template
  if (!program.heroTitle || !program.whatYouLearn) {
    return (
      <div className="min-h-screen bg-white">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
        </div>
        
        <div className="py-16 px-6 bg-white text-black">
          <div className="max-w-4xl mx-auto">
            {/* Eligibility Notice */}
            <EligibilityNotice variant="banner" className="mb-6" />
            
            <h1 className="text-3xl font-bold mb-6">{displayProgram.name}</h1>
            
            {/* Program Quick Facts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-white rounded-lg">
              {displayProgram.duration && (
                <div>
                  <p className="text-sm text-black">Duration</p>
                  <p className="font-semibold">{displayProgram.duration}</p>
                </div>
              )}
              {displayProgram.hours && (
                <div>
                  <p className="text-sm text-black">Training Hours</p>
                  <p className="font-semibold">{displayProgram.hours} hours</p>
                </div>
              )}
              {displayProgram.credential && (
                <div>
                  <p className="text-sm text-black">Credential</p>
                  <p className="font-semibold">{displayProgram.credential}</p>
                </div>
              )}
              {displayProgram.deliveryMethod && (
                <div>
                  <p className="text-sm text-black">Format</p>
                  <p className="font-semibold capitalize">{displayProgram.deliveryMethod}</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">About This Program</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {displayProgram.description}
              </p>
            </div>

            {/* Salary Range */}
            {(displayProgram.salaryMin || displayProgram.salaryMax) && (
              <div className="mb-8 p-4 bg-white rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Earning Potential</h2>
                <p className="text-2xl font-bold text-brand-green-700">
                  ${displayProgram.salaryMin?.toLocaleString() || '—'} - ${displayProgram.salaryMax?.toLocaleString() || '—'} / year
                </p>
              </div>
            )}

            {/* What You'll Learn */}
            {displayProgram.whatYouLearn && displayProgram.whatYouLearn.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">What You'll Learn</h2>
                <ul className="list-disc pl-6 space-y-2">
                  {(Array.isArray(displayProgram.whatYouLearn) ? displayProgram.whatYouLearn : [displayProgram.whatYouLearn]).map((item: string, idx: number) => (
                    <li key={idx} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Career Outcomes */}
            {displayProgram.careerOutcomes && displayProgram.careerOutcomes.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Career Outcomes</h2>
                <ul className="list-disc pl-6 space-y-2">
                  {(Array.isArray(displayProgram.careerOutcomes) ? displayProgram.careerOutcomes : [displayProgram.careerOutcomes]).map((item: string, idx: number) => (
                    <li key={idx} className="text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prerequisites */}
            {displayProgram.prerequisites && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Prerequisites</h2>
                <p className="text-gray-700">{displayProgram.prerequisites}</p>
              </div>
            )}

            {/* Funding Badge */}
            {displayProgram.fundingEligible && (
              <div className="mb-8 inline-block px-4 py-2 bg-brand-blue-100 text-brand-blue-800 rounded-full text-sm font-medium">
                • Funding Available (WIOA Eligible)
              </div>
            )}

            {/* Cost */}
            {displayProgram.cost && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Program Cost</h2>
                <p className="text-2xl font-bold">${Number(displayProgram.cost).toLocaleString()}</p>
                <p className="text-sm text-black">Financial assistance may be available</p>
              </div>
            )}

          <div className="mt-10 flex gap-4">
            <Link
              href={program.ctaPrimary?.href || `/apply?program=${slug}`}
              className="bg-brand-blue-600 hover:bg-brand-blue-700 text-white px-6 py-3 rounded-xl transition font-semibold"
            >
              {program.ctaPrimary?.label || 'Apply Now'}
            </Link>
            <Link
              href="/programs"
              className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-xl transition"
            >
              Back to Programs
            </Link>
          </div>
          {PROGRAMS[slug] && (
            <div className="mt-6 bg-white rounded-xl p-6">
              <ProgramTutorCTA
                programSlug={slug}
                programName={displayProgram.title}
                applyHref={program.ctaPrimary?.href || `/apply?program=${slug}`}
              />
            </div>
          )}
        </div>
        </div>
      </div>
    );
  }

  // Check if this program should use the visual-first template
  const useVisualTemplate = VISUAL_TEMPLATE_PROGRAMS.includes(slug);

  if (useVisualTemplate) {
    return <VisualProgramTemplate program={program} slug={slug} />;
  }

  // Render full program template for complete data with breadcrumbs
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: program.title || program.name,
    description: program.shortDescription || program.description,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Elevate for Humanity Career & Technical Institute',
      url: 'https://www.elevateforhumanity.org',
    },
    url: `https://www.elevateforhumanity.org/programs/${slug}`,
    ...(program.duration && { timeRequired: program.duration }),
    ...(program.tuition && { offers: { '@type': 'Offer', price: program.tuition, priceCurrency: 'USD' } }),
    educationalCredentialAwarded: program.credential || program.title || program.name,
    isAccessibleForFree: !program.price && program.fundingEligible !== false,
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>
      <ProgramTemplate program={program} />
    </div>
=======
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAdminClient } from '@/lib/supabase/admin';
import { programs as staticPrograms } from '@/content/cf-programs';

export const revalidate = 3600;

export async function generateStaticParams() {
  const db = await getAdminClient();
  if (db) {
    const { data } = await db
      .from('programs')
      .select('slug')
      .eq('is_active', true)
      .neq('status', 'archived');
    if (data && data.length > 0) return data.map((p) => ({ slug: p.slug }));
  }
  return staticPrograms.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const db = await getAdminClient();
  if (db) {
    const { data } = await db
      .from('programs')
      .select('title, description, short_description')
      .eq('slug', slug)
      .maybeSingle();
    if (data) return {
      title: `${data.title} | Elevate for Humanity`,
      description: data.short_description || data.description || '',
    };
  }
  const p = staticPrograms.find((p) => p.slug === slug);
  if (!p) return {};
  return { title: `${p.title} | Elevate for Humanity`, description: p.summary };
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Try Supabase first
  const db = await getAdminClient();
  if (db) {
    const { data: p } = await db
      .from('programs')
      .select('slug, title, description, short_description, credential, duration_weeks, image_url')
      .eq('slug', slug)
      .maybeSingle();

    if (p) {
      return (
        <section className="mx-auto max-w-4xl px-4 py-16">
          <h1 className="text-3xl font-bold text-slate-900">{p.title}</h1>
          {p.short_description && (
            <p className="mt-4 text-lg text-slate-700">{p.short_description}</p>
          )}
          {p.description && (
            <div className="mt-6 text-slate-700 leading-relaxed whitespace-pre-line">
              {p.description}
            </div>
          )}
          <div className="mt-10 flex gap-4">
            <Link
              href={`/apply?program=${p.slug}`}
              className="rounded bg-brand-red-600 px-6 py-3 text-white font-semibold hover:bg-brand-red-700"
            >
              Apply Now
            </Link>
            <Link
              href="/programs"
              className="rounded border px-6 py-3 text-slate-700 font-semibold hover:bg-slate-50"
            >
              All Programs
            </Link>
          </div>
        </section>
      );
    }
  }

  // Fall back to static content
  const p = staticPrograms.find((p) => p.slug === slug);
  if (!p) return notFound();

  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">{p.title}</h1>
      <p className="mt-4 text-lg text-slate-700">{p.description}</p>
      <div className="mt-8 space-y-6">
        {p.sections.map((section) => (
          <div key={section.heading}>
            <h2 className="text-xl font-semibold text-slate-900">{section.heading}</h2>
            <p className="mt-2 text-slate-700">{section.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <a
          href={p.ctaHref}
          className="rounded bg-brand-red-600 px-5 py-3 text-white font-semibold hover:bg-brand-red-700"
        >
          {p.ctaLabel}
        </a>
      </div>
    </section>
>>>>>>> preview/branch-consolidation-20260418
  );
}
