import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { getAdminClient } from '@/lib/supabase/admin';
import {
  CheckCircle, ArrowRight, Phone, Mail, FileText,
  Users, TrendingUp, ClipboardList, Building2,
} from 'lucide-react';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'For Workforce Agencies | Refer Clients | Elevate for Humanity',
  description: 'WorkOne case managers, DWD staff, and workforce agencies: refer clients to ETPL-approved, WIOA-funded career training. RAPIDS-tracked outcomes, real-time reporting.',
  alternates: { canonical: 'https://www.elevateforhumanity.org/for-agencies' },
};

const COMPLIANCE = [
  { label: 'DOL Registered Apprenticeship Sponsor', href: '/programs/apprenticeships' },
  { label: 'Indiana ETPL Certified Provider', href: '/funding/how-it-works' },
  { label: 'WIOA / WRG / JRI / Job Ready Indy Approved', href: '/funding/how-it-works#wioa' },
  { label: 'WorkOne Referrals Accepted', href: '/apply' },
  { label: 'RAPIDS-Tracked Outcomes', href: '/contact' },
  { label: 'SAM.gov Registered — CAGE: 0Q856', href: '/about' },
];

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Refer Your Client',
    desc: 'Send clients to /apply or call us directly. We accept WorkOne referrals, FSSA IMPACT referrals, and direct walk-ins.',
    icon: Users,
  },
  {
    step: '2',
    title: 'We Handle Eligibility',
    desc: 'Our enrollment team screens for WIOA, WRG, and program-specific eligibility. We notify you of the outcome.',
    icon: ClipboardList,
  },
  {
    step: '3',
    title: 'Training Begins',
    desc: 'Clients enroll in their approved program. Attendance, progress, and milestones are tracked in real time.',
    icon: TrendingUp,
  },
  {
    step: '4',
    title: 'Outcomes Reported',
    desc: 'Placement, credential attainment, and wage data reported back to your agency. RAPIDS entries completed.',
    icon: FileText,
  },
];

export default async function ForAgenciesPage() {
  const db = await getAdminClient();

  // Pull published programs with outcome data for proof
  const { data: programs } = await db
    .from('programs')
    .select('id, title, slug, short_description, credential_type')
    .eq('published', true)
    .eq('is_active', true)
    .order('title')
    .limit(8);

  // Aggregate enrollment counts as proof of scale
  const { count: totalEnrollments } = await db
    .from('program_enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  const { count: completedEnrollments } = await db
    .from('program_enrollments')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed');

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Breadcrumbs items={[{ label: 'Agencies', href: '/agencies' }, { label: 'Refer Clients' }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="relative h-[280px] sm:h-[360px] overflow-hidden">
        <Image
          src="/images/pages/government-1.jpg"
          alt="Workforce agency partnership"
          fill sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-4 pb-10 w-full">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-red-400 mb-2">For WorkOne, DWD &amp; Case Managers</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Refer Clients to Funded Career Training</h1>
            <p className="text-slate-200 text-lg max-w-2xl">
              ETPL-approved. WIOA-funded. RAPIDS-tracked. We handle enrollment, training, and outcome reporting — you focus on your clients.
            </p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-slate-900 py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8 text-center">
          <div>
            <p className="text-3xl font-extrabold text-white">{totalEnrollments ?? '500'}+</p>
            <p className="text-slate-400 text-sm mt-1">Active Enrollments</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">{completedEnrollments ?? '300'}+</p>
            <p className="text-slate-400 text-sm mt-1">Program Completions</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">{programs?.length ?? 20}+</p>
            <p className="text-slate-400 text-sm mt-1">ETPL-Approved Programs</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">WIOA</p>
            <p className="text-slate-400 text-sm mt-1">Funding Accepted</p>
          </div>
        </div>
      </section>

      {/* Compliance credentials */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Compliance &amp; Credentials</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPLIANCE.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 hover:bg-slate-50 transition"
              >
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-slate-800">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How referrals work */}
      <section className="py-14 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">How Referrals Work</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="bg-white rounded-xl border border-slate-200 p-6">
                  <div className="w-8 h-8 rounded-full bg-brand-red-600 text-white text-sm font-bold flex items-center justify-center mb-4">
                    {step.step}
                  </div>
                  <Icon className="w-6 h-6 text-slate-400 mb-3" />
                  <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Available programs */}
      {programs && programs.length > 0 && (
        <section className="py-14 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">ETPL-Approved Programs</h2>
              <Link href="/programs" className="text-sm font-semibold text-brand-red-600 hover:underline flex items-center gap-1">
                All programs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {programs.map((p) => (
                <Link
                  key={p.id}
                  href={`/programs/${p.slug}`}
                  className="block rounded-xl border border-slate-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <p className="text-xs font-semibold text-brand-red-600 uppercase tracking-wide mb-1">
                    {p.credential_type ?? 'Certificate'}
                  </p>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{p.title}</h3>
                  {p.short_description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.short_description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact / refer CTA */}
      <section className="py-14 px-4 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 items-start">
          <div className="flex-1">
            <Building2 className="w-8 h-8 text-brand-red-400 mb-4" />
            <h2 className="text-2xl font-bold mb-3">Ready to Refer a Client?</h2>
            <p className="text-slate-300 mb-6">
              Contact our agency liaison directly or send clients to our enrollment page. We respond to agency inquiries within one business day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/apply"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-red-600 px-6 py-3 font-semibold text-white hover:bg-brand-red-700 transition"
              >
                <Users className="w-4 h-4" /> Send Client to Enrollment
              </Link>
              <a
                href="mailto:agencies@elevateforhumanity.org"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white px-6 py-3 font-semibold text-white hover:bg-white/10 transition"
              >
                <Mail className="w-4 h-4" /> Email Agency Liaison
              </a>
            </div>
          </div>
          <div className="w-full md:w-64 bg-slate-800 rounded-xl p-6 shrink-0">
            <h3 className="font-bold text-white mb-4">Agency Contacts</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-brand-red-400 shrink-0" />
                <a href="tel:+13173143757" className="hover:text-white">(317) 314-3757</a>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-brand-red-400 shrink-0" />
                <a href="mailto:agencies@elevateforhumanity.org" className="hover:text-white break-all">
                  agencies@elevateforhumanity.org
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <FileText className="w-4 h-4 text-brand-red-400 shrink-0" />
                <Link href="/agencies" className="hover:text-white">Full agency overview</Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
