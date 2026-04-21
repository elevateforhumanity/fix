import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import HeroVideo from '@/components/marketing/HeroVideo';
import heroBanners from '@/content/heroBanners';
import {
  Users, Briefcase, Building2, GraduationCap, Shield, Handshake,
  Scissors, Sparkles, Heart, FileText, Globe, BookOpen,
  ArrowRight, Phone, ChevronRight, Zap,
} from 'lucide-react';


export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Partners | Elevate for Humanity',
  description: 'Partner with Elevate for Humanity — barbershops, salons, workforce agencies, employers, training providers, reentry organizations, and technology partners.',
  alternates: { canonical: 'https://www.elevateforhumanity.org/partners' },
};

// ── Partner categories ────────────────────────────────────────────────────────

const APPRENTICESHIP_PARTNERS = [
  {
    icon: Scissors,
    title: 'Barbershop Partners',
    badge: 'DOL Registered Apprenticeship',
    who: 'Licensed barbershop owners in Indiana who want to host apprentices through the state Registered Apprenticeship program.',
    what: 'Host barber apprentices at your shop. Elevate handles DOL registration, curriculum, and compliance paperwork. You provide the chair and mentorship.',
    cta: { label: 'Learn More', href: '/partners/barbershop-apprenticeship' },
    apply: { label: 'Apply to Host', href: '/partners/barbershop-apprenticeship/apply' },
    image: '/images/pages/barber-shop-interior.jpg',
  },
  {
    icon: Sparkles,
    title: 'Cosmetology & Salon Partners',
    badge: 'DOL Registered Apprenticeship',
    who: 'Licensed salon owners who want to host cosmetology apprentices and grow their team through earn-while-you-learn training.',
    what: 'Host cosmetology apprentices at your salon. Elevate manages DOL paperwork, curriculum, and state board compliance. You mentor and grow your team.',
    cta: { label: 'Learn More', href: '/partners/cosmetology-apprenticeship' },
    apply: { label: 'Apply to Host', href: '/partners/cosmetology-apprenticeship/apply' },
    image: '/images/pages/cosmetology-hero.jpg',
  },
];

const WORKFORCE_PARTNERS = [
  {
    icon: Users,
    title: 'Workforce Agencies',
    badge: 'WIOA & Funding Partners',
    who: 'WorkOne centers, workforce boards, DWD case managers, and WIOA service providers.',
    what: 'Refer WIOA, Workforce Ready Grant, and Job Ready Indy participants to Elevate for funded career training. We handle enrollment, training, testing, and outcome reporting.',
    cta: { label: 'Learn More', href: '/partners/workforce' },
    apply: { label: 'Start a Referral Partnership', href: '/apply/intake' },
    image: '/images/pages/workforce-partners-page-1.jpg',
  },
  {
    icon: Shield,
    title: 'Reentry Organizations',
    badge: 'Job Ready Indy',
    who: 'Community corrections, probation departments, reentry nonprofits, and case managers serving justice-involved individuals.',
    what: 'Connect your clients to Job Ready Indy-funded career training in trades, CDL, healthcare, and barbering. We work with background-friendly employers and provide wrap-around support.',
    cta: { label: 'Learn More', href: '/partners/reentry' },
    apply: { label: 'Refer a Participant', href: '/apply/intake' },
    image: '/images/pages/community-page-4.jpg',
  },
  {
    icon: Heart,
    title: 'JRI & Justice Partners',
    badge: 'Justice Reinvestment Initiative',
    who: 'JRI-funded organizations, public defenders, courts, and reentry coalitions seeking workforce training for justice-involved populations.',
    what: 'Access Elevate\'s JRI-aligned training programs, outcome tracking, and employer network for justice-involved participants.',
    cta: { label: 'Learn More', href: '/partners/jri' },
    apply: { label: 'Partner With Us', href: '/apply/intake' },
    image: '/images/pages/partners-pub-page-1.jpg',
  },
];

const EMPLOYER_PARTNERS = [
  {
    icon: Briefcase,
    title: 'Employers & OJT Hosts',
    badge: 'Hire & Train',
    who: 'Businesses looking to hire certified workers or host on-the-job training at their facility.',
    what: 'Post open positions, receive pre-screened certified graduates, and access OJT wage reimbursement through WIOA. No recruiting fees.',
    cta: { label: 'Learn More', href: '/for-employers' },
    apply: { label: 'Apply as Employer Partner', href: '/apply/employer' },
    image: '/images/pages/employer-handshake.jpg',
  },
  {
    icon: Building2,
    title: 'Training Sites & Facilities',
    badge: 'Facility Partners',
    who: 'Businesses, community centers, and facilities that can host in-person training sessions or provide lab and classroom space.',
    what: 'Provide space for Elevate training cohorts and receive compensation. We handle scheduling, instruction, and compliance.',
    cta: { label: 'Learn More', href: '/partners/training-sites' },
    apply: { label: 'List Your Facility', href: '/partners/join' },
    image: '/images/pages/tech-classroom.jpg',
  },
];

const TRAINING_PARTNERS = [
  {
    icon: GraduationCap,
    title: 'Training Providers',
    badge: 'ETPL & Program Holders',
    who: 'Schools, training centers, and instructors who want to co-deliver programs or get listed on the Indiana ETPL.',
    what: 'Co-deliver programs under the Elevate umbrella, access funded student referrals, and use our LMS platform for enrollment and compliance tracking.',
    cta: { label: 'Learn More', href: '/partners/training-provider' },
    apply: { label: 'Apply as Training Provider', href: '/apply/program-holder' },
    image: '/images/pages/training-providers-page-1.jpg',
  },
  {
    icon: BookOpen,
    title: 'Safety & Short-Term Courses',
    badge: 'CareerSafe · HSI · NRF',
    who: 'Organizations needing OSHA 10/30, first aid, CPR, or retail certifications for their workforce.',
    what: 'Access CareerSafe OSHA training, HSI safety courses, and NRF Foundation RISE Up retail certifications through Elevate — individually or for your whole team.',
    cta: { label: 'CareerSafe Courses', href: '/partners/careersafe' },
    apply: { label: 'Enroll Your Team', href: '/partners/careersafe' },
    image: '/images/pages/workforce-training.jpg',
  },
];

const TECH_PARTNERS = [
  {
    icon: Globe,
    title: 'Technology Partners',
    badge: 'API & Integration',
    who: 'Software vendors, LMS providers, and workforce data platforms seeking API integration or data interoperability.',
    what: 'Integrate with the Elevate platform via API or build data interoperability for workforce outcome reporting and student tracking.',
    cta: { label: 'Learn More', href: '/partners/technology' },
    apply: { label: 'Request API Access', href: '/partners/sales' },
    image: '/images/pages/technology-sector.jpg',
  },
  {
    icon: Zap,
    title: 'LMS & Platform Licensing',
    badge: 'White-Label',
    who: 'Workforce organizations, training providers, and government agencies that want to run their own branded LMS.',
    what: 'License the Elevate LMS platform under your brand. Full curriculum management, student tracking, compliance reporting, and credential issuance included.',
    cta: { label: 'See Licensing Options', href: '/partners/sales' },
    apply: { label: 'Request a Demo', href: '/partners/sales' },
    image: '/images/pages/platform-partners-hero.jpg',
  },
];

const RESOURCE_LINKS = [
  { label: 'Sign an MOU', href: '/partners/mou', icon: FileText },
  { label: 'Partner Resources', href: '/partners/resources', icon: BookOpen },
  { label: 'Compliance Tools', href: '/partners/compliance', icon: Shield },
  { label: 'Create a Program', href: '/partners/create-program', icon: GraduationCap },
  { label: 'Requirements', href: '/partners/requirements', icon: FileText },
  { label: 'General Application', href: '/partners/join', icon: Handshake },
];

// ── Reusable section ──────────────────────────────────────────────────────────

type PartnerCard = {
  icon: React.ElementType;
  title: string;
  badge: string;
  who: string;
  what: string;
  cta: { label: string; href: string };
  apply: { label: string; href: string };
  image: string;
};

function PartnerSection({ heading, sub, cards }: { heading: string; sub: string; cards: PartnerCard[] }) {
  return (
    <section className="py-10 border-b border-slate-100 last:border-0">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{heading}</h2>
          <p className="text-slate-500 mt-1 text-sm">{sub}</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {cards.map((card) => (
            <div key={card.title} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="relative h-44 w-full flex-shrink-0">
                <Image src={card.image} alt={card.title} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <span className="absolute bottom-3 left-3 bg-white/90 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {card.badge}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1 gap-3">
                <div className="flex items-center gap-2">
                  <card.icon className="w-5 h-5 text-brand-blue-600 flex-shrink-0" />
                  <h3 className="text-base font-bold text-slate-900">{card.title}</h3>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue-600 mb-1">Who this is for</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{card.who}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue-600 mb-1">What you get</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{card.what}</p>
                </div>
                <div className="flex flex-wrap gap-2 pt-2 mt-auto border-t border-slate-100">
                  <Link href={card.apply.href} className="inline-flex items-center gap-1.5 bg-brand-blue-600 hover:bg-brand-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    {card.apply.label} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href={card.cta.href} className="inline-flex items-center gap-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                    {card.cta.label} <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PartnersIndexPage() {
  const banner = heroBanners['partners'];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Breadcrumbs items={[{ label: 'Partners' }]} />
        </div>
      </div>

      {/* Hero */}
      <HeroVideo
        posterImage="/images/pages/partner-page-1.jpg"
        videoSrcDesktop={banner.videoSrcDesktop}
        voiceoverSrc={banner.voiceoverSrc}
        microLabel={banner.microLabel}
        belowHeroHeadline={banner.belowHeroHeadline}
        belowHeroSubheadline={banner.belowHeroSubheadline}
        ctas={[banner.primaryCta, banner.secondaryCta].filter(Boolean)}
        trustIndicators={banner.trustIndicators}
        transcript={banner.transcript}
      />

      {/* How it works */}
      <section className="border-b border-slate-100 py-10 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-lg font-bold text-slate-900 mb-6 text-center">How to get started</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            {[
              { step: '1', heading: 'Find your type', body: 'Scroll down and identify which partnership category fits your organization.' },
              { step: '2', heading: 'Read what is required', body: 'Each section explains who qualifies, what you get, and what we need from you.' },
              { step: '3', heading: 'Apply or call us', body: 'Click the application button for your type, or call (317) 314-3757 to talk first.' },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-brand-blue-600 text-white font-extrabold text-lg flex items-center justify-center">{s.step}</div>
                <h3 className="font-bold text-slate-900">{s.heading}</h3>
                <p className="text-slate-500 text-sm">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All partner sections */}
      <PartnerSection
        heading="Apprenticeship Host Partners"
        sub="Licensed shops and salons that host DOL Registered Apprentices — earn-while-you-learn training at your location."
        cards={APPRENTICESHIP_PARTNERS}
      />
      <PartnerSection
        heading="Workforce & Reentry Partners"
        sub="Agencies, case managers, and reentry organizations that refer participants to funded career training."
        cards={WORKFORCE_PARTNERS}
      />
      <PartnerSection
        heading="Employer & Facility Partners"
        sub="Businesses that hire our graduates, host OJT, or provide training space."
        cards={EMPLOYER_PARTNERS}
      />
      <PartnerSection
        heading="Training Providers & Instructors"
        sub="Schools, instructors, and training centers that co-deliver programs under the Elevate umbrella."
        cards={TRAINING_PARTNERS}
      />
      <PartnerSection
        heading="Technology & Platform Partners"
        sub="Software vendors and organizations seeking API integration or white-label LMS licensing."
        cards={TECH_PARTNERS}
      />

      {/* Resource links */}
      <section className="py-10 bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-lg font-bold text-slate-900 mb-5">Partner resources</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {RESOURCE_LINKS.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href} className="flex flex-col items-center gap-2 bg-white border border-slate-200 rounded-xl p-4 text-center hover:border-brand-blue-300 hover:shadow-sm transition-all group">
                <Icon className="w-5 h-5 text-brand-blue-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-slate-700">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Not sure which type fits?</h2>
          <p className="text-slate-500 mb-6">Call us and we will figure it out together. Most partnerships are set up within a week.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:317-314-3757" className="inline-flex items-center justify-center gap-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-colors">
              <Phone className="w-4 h-4" /> (317) 314-3757
            </a>
            <Link href="/partners/join" className="inline-flex items-center justify-center gap-2 border-2 border-slate-300 text-slate-700 px-8 py-3 rounded-lg font-bold hover:bg-slate-50 transition-colors">
              General Partner Application <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
