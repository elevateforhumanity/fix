import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { CheckCircle, ArrowRight, Phone, Users, DollarSign, Award } from 'lucide-react';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'WIOA Funded Training | Elevate for Humanity',
  description: 'Get free career training through WIOA — Workforce Innovation and Opportunity Act. For unemployed, underemployed, and workers facing barriers in Indiana.',
  alternates: { canonical: 'https://www.elevateforhumanity.org/funding/wioa' },
};

const WHO_QUALIFIES = [
  'Unemployed or recently laid off',
  'Underemployed or working part-time',
  'Low-income adults (income-based eligibility)',
  'Recipients of public assistance (SNAP, TANF, Medicaid)',
  'Veterans and eligible spouses',
  'Individuals with disabilities',
  'Justice-involved individuals',
  'Youth ages 16–24 facing barriers',
];

const WHAT_COVERS = [
  'Full tuition for approved training programs',
  'Certification and exam fees',
  'Books and required materials',
  'Supportive services (transportation, childcare — case-by-case)',
  'Career coaching and job placement support',
];

const PROGRAMS = [
  { name: 'CNA / Nursing Assistant', slug: 'cna', duration: '4–6 weeks' },
  { name: 'HVAC Technician', slug: 'hvac-technician', duration: '10–16 weeks' },
  { name: 'Medical Assistant', slug: 'medical-assistant', duration: '8–12 weeks' },
  { name: 'IT Help Desk Specialist', slug: 'it-help-desk', duration: '8–12 weeks' },
  { name: 'Pharmacy Technician', slug: 'pharmacy-technician', duration: '8–10 weeks' },
  { name: 'Business Administration', slug: 'business-administration', duration: '8 weeks' },
  { name: 'Bookkeeping', slug: 'bookkeeping', duration: '5 weeks' },
  { name: 'Phlebotomy Technician', slug: 'phlebotomy', duration: '4–6 weeks' },
];

export default function WioaPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-50 border-b">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <Breadcrumbs items={[{ label: 'Funding', href: '/funding' }, { label: 'WIOA' }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: 'clamp(360px, 42vw, 500px)' }}>
        <Image
          src="/images/pages/card-wioa.jpg"
          alt="WIOA funded career training"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/60 to-transparent" />
        <div className="relative z-10 h-full flex items-center" style={{ minHeight: 'clamp(360px, 42vw, 500px)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-red-400 mb-3">WIOA Funding</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 max-w-xl leading-tight">
              Free Career Training Through WIOA
            </h1>
            <p className="text-white/80 text-lg max-w-lg mb-8">
              The Workforce Innovation and Opportunity Act funds 100% of tuition for eligible adults. No loans. No repayment. Ever.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/check-eligibility" className="inline-flex items-center gap-2 bg-brand-red-600 hover:bg-brand-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                Check Eligibility <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/apply" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partner logos */}
      <section className="bg-slate-50 border-b border-slate-200 py-6">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 text-center mb-5">Administered through</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { src: '/images/partners/dwd.webp', alt: 'Indiana DWD' },
              { src: '/images/partners/workone.webp', alt: 'WorkOne' },
              { src: '/images/partners/usdol.webp', alt: 'U.S. Department of Labor' },
            ].map((p) => (
              <div key={p.alt} className="relative h-10 w-28">
                <Image src={p.src} alt={p.alt} fill className="object-contain" sizes="112px" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who qualifies + what it covers */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-brand-blue-600" />
                <h2 className="text-xl font-extrabold text-slate-900">Who Qualifies</h2>
              </div>
              <div className="space-y-2">
                {WHO_QUALIFIES.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/check-eligibility" className="inline-flex items-center gap-1 mt-4 text-brand-blue-600 font-semibold text-sm hover:text-brand-blue-800">
                Check your eligibility in 30 seconds <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-extrabold text-slate-900">What WIOA Covers</h2>
              </div>
              <div className="space-y-2">
                {WHAT_COVERS.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-green-50 border border-green-100 rounded-xl p-4">
                <p className="text-sm font-bold text-green-800">$0 out of pocket</p>
                <p className="text-xs text-green-700 mt-0.5">WIOA is not a loan. You never repay it.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WIOA-eligible programs */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-brand-blue-600" />
            <h2 className="text-2xl font-extrabold text-slate-900">WIOA-Eligible Programs at Elevate</h2>
          </div>
          <p className="text-slate-600 mb-8">All programs below are on Indiana&apos;s Eligible Training Provider List (ETPL).</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROGRAMS.map((p) => (
              <Link key={p.slug} href={`/programs/${p.slug}`} className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition-shadow group">
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-brand-blue-700 transition-colors">{p.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{p.duration}</p>
                <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-brand-blue-600">
                  View program <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/programs" className="inline-flex items-center gap-2 text-brand-blue-600 font-semibold hover:text-brand-blue-800 text-sm">
              View all programs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How to apply */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-8 text-center">How to Apply for WIOA Funding</h2>
          <div className="space-y-4">
            {[
              { n: '1', title: 'Apply to Elevate', desc: 'Complete our online application and select your program of interest.' },
              { n: '2', title: 'Eligibility Review', desc: 'We review your application and confirm WIOA eligibility based on your situation.' },
              { n: '3', title: 'WorkOne Appointment', desc: 'We schedule you with your local WorkOne center to complete the ITA (Individual Training Account) paperwork.' },
              { n: '4', title: 'Funding Authorized', desc: 'WorkOne issues your ITA. Tuition is covered — you pay nothing.' },
              { n: '5', title: 'Start Training', desc: 'Enroll and begin your program. We handle all billing directly with the funding agency.' },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-4 bg-white rounded-2xl border border-slate-200 p-5">
                <div className="w-9 h-9 rounded-full bg-brand-blue-600 text-white font-extrabold flex items-center justify-center flex-shrink-0">{s.n}</div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-0.5">{s.title}</h3>
                  <p className="text-sm text-slate-600">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-blue-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Start Your WIOA Application Today</h2>
          <p className="text-white/80 mb-8">Free training. Real credentials. No debt. Apply now and we&apos;ll guide you through every step.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/apply" className="inline-flex items-center gap-2 bg-brand-red-600 hover:bg-brand-red-700 text-white font-bold px-8 py-4 rounded-xl transition-colors">
              Apply Now <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="tel:3173143757" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl transition-colors">
              <Phone className="w-5 h-5" /> (317) 314-3757
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
