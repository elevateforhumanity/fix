import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { CheckCircle, ArrowRight, Phone, Clock, DollarSign, FileText, Users } from 'lucide-react';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'How Funding Works | Free Career Training | Elevate for Humanity',
  description: 'Learn how WIOA, Workforce Ready Grant, JRI, and SNAP E&T funding works. Step-by-step guide from application to first day of class.',
  alternates: { canonical: 'https://www.elevateforhumanity.org/funding/how-it-works' },
};

const STEPS = [
  {
    n: '1',
    icon: <FileText className="w-6 h-6 text-brand-blue-600" />,
    title: 'Apply to Elevate',
    desc: 'Complete our short online application. Tell us which program interests you and your current employment situation. Takes about 5 minutes.',
    cta: { label: 'Start Application', href: '/apply' },
  },
  {
    n: '2',
    icon: <Users className="w-6 h-6 text-green-600" />,
    title: 'Eligibility Screening',
    desc: 'Our team reviews your application and identifies which funding programs you qualify for — WIOA, Workforce Ready Grant, JRI, SNAP E&T, or others. Most applicants qualify for at least one.',
    cta: null,
  },
  {
    n: '3',
    icon: <CheckCircle className="w-6 h-6 text-purple-600" />,
    title: 'WorkOne Referral & ITA',
    desc: 'We connect you with your local WorkOne center to complete the funding paperwork. An Individual Training Account (ITA) is issued in your name — this is your funding authorization.',
    cta: null,
  },
  {
    n: '4',
    icon: <DollarSign className="w-6 h-6 text-amber-600" />,
    title: 'Funding Approved — $0 Tuition',
    desc: 'Once your ITA or funding authorization is issued, your tuition is covered. You pay nothing out of pocket. We bill the funding agency directly.',
    cta: null,
  },
  {
    n: '5',
    icon: <Clock className="w-6 h-6 text-brand-red-600" />,
    title: 'Enroll & Start Training',
    desc: 'You enroll in your program and begin training. Career coaching, job placement support, and case management are included throughout.',
    cta: null,
  },
  {
    n: '6',
    icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    title: 'Earn Your Credential',
    desc: 'Complete your program, pass your certification exam, and receive your credential. We help you connect with employers and apply for jobs.',
    cta: { label: 'View Programs', href: '/programs' },
  },
];

const FUNDING_SOURCES = [
  { name: 'WIOA', desc: 'Workforce Innovation & Opportunity Act — federal funding for unemployed and underemployed adults', href: '/funding/wioa' },
  { name: 'Next Level Jobs', desc: 'Indiana Workforce Ready Grant — no income test for Indiana residents 25+', href: '/programs' },
  { name: 'JRI', desc: 'Justice Reinvestment Initiative — for justice-involved individuals in Marion County', href: '/partners/jri' },
  { name: 'SNAP E&T', desc: 'SNAP Employment & Training — for SNAP recipients', href: '/snap-et-partner' },
  { name: 'FSSA / IMPACT', desc: 'Indiana Family & Social Services — for TANF and public assistance recipients', href: '/fssa-partnership-request' },
  { name: 'OJT', desc: 'On-the-Job Training — wage reimbursement for employers who hire WIOA-eligible workers', href: '/ojt-and-funding' },
];

export default function HowFundingWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-50 border-b">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <Breadcrumbs items={[{ label: 'Funding', href: '/funding' }, { label: 'How It Works' }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: 'clamp(360px, 42vw, 500px)' }}>
        <Image
          src="/images/pages/funding-hero.jpg"
          alt="How workforce funding works"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/60 to-transparent" />
        <div className="relative z-10 h-full flex items-center" style={{ minHeight: 'clamp(360px, 42vw, 500px)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-red-400 mb-3">Funded Training</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 max-w-xl leading-tight">
              How Free Career Training Works
            </h1>
            <p className="text-white/80 text-lg max-w-lg mb-8">
              WIOA, Workforce Ready Grant, JRI, and SNAP E&T pay your tuition. Here&apos;s exactly how the process works — from application to credential.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/apply" className="inline-flex items-center gap-2 bg-brand-red-600 hover:bg-brand-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/check-eligibility" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                Check Eligibility
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 text-center">Step-by-Step Process</h2>
          <p className="text-slate-600 text-center mb-10">From your first application to your first day of work.</p>
          <div className="space-y-4">
            {STEPS.map((step) => (
              <div key={step.n} className="flex items-start gap-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-brand-blue-600 text-white font-extrabold text-lg flex items-center justify-center flex-shrink-0">
                  {step.n}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {step.icon}
                    <h3 className="font-bold text-slate-900">{step.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                  {step.cta && (
                    <Link href={step.cta.href} className="inline-flex items-center gap-1 mt-2 text-brand-blue-600 font-semibold text-sm hover:text-brand-blue-800">
                      {step.cta.label} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funding sources */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 text-center">Funding Programs We Work With</h2>
          <p className="text-slate-600 text-center mb-10">You may qualify for more than one.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FUNDING_SOURCES.map((f) => (
              <Link key={f.name} href={f.href} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-shadow group">
                <h3 className="font-extrabold text-slate-900 mb-2 group-hover:text-brand-blue-700 transition-colors">{f.name}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                <span className="inline-flex items-center gap-1 mt-3 text-xs font-bold text-brand-blue-600">
                  Learn more <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ strip */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-8 text-center">Common Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Do I have to pay anything back?', a: 'No. WIOA and Workforce Ready Grant funding is not a loan. You never repay it.' },
              { q: 'How long does funding approval take?', a: 'Typically 1–3 weeks from your WorkOne appointment. We help you prepare all required documents in advance.' },
              { q: 'What if I don\'t qualify for WIOA?', a: 'The Workforce Ready Grant has no income test for Indiana residents 25+. Most people qualify for at least one program.' },
              { q: 'Can I work while in training?', a: 'Yes. Most programs are hybrid with flexible scheduling designed around working adults.' },
              { q: 'What happens after I graduate?', a: 'We provide job placement support, resume help, and employer connections. Many graduates are hired within 30–60 days of completing their program.' },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-900 mb-2">{q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-blue-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/80 mb-8">Apply today — we&apos;ll identify your funding and walk you through every step at no cost.</p>
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
