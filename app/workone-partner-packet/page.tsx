export const revalidate = 3600;

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import WorkOneHeroVideo from './HeroVideo';
import {
  Award,
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  Phone,
  Mail,
  Building2,
  GraduationCap,
  Shield,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { PrintButton } from './PrintButton';

export const metadata: Metadata = {
  title: 'WorkOne Partner Packet | Elevate for Humanity',
  description:
    'Registered Apprenticeship Sponsor | ETPL Approved | WIOA & WRG Eligible. Complete partner information for WorkOne regions and workforce development boards.',
  alternates: {
    canonical: 'https://www.elevateforhumanity.org/workone-partner-packet',
  },
};

const PROGRAMS = [
  {
    title: 'Barber Apprenticeship',
    duration: '18 months',
    credential: 'Indiana Barber License',
    funding: 'WIOA, WRG, DOL Apprenticeship',
    image: '/images/pages/barber-gallery-1.jpg',
    href: '/programs/barber-apprenticeship',
  },
  {
    title: 'Healthcare Certifications',
    duration: '4–12 weeks',
    credential: 'CNA, Medical Assistant, Home Health Aide',
    funding: 'WIOA, WRG',
    image: '/images/pages/healthcare-hero.jpg',
    href: '/programs/healthcare',
  },
  {
    title: 'IT & Cybersecurity',
    duration: '8–12 weeks',
    credential: 'Certiport IT Specialist, CompTIA',
    funding: 'WIOA, WRG',
    image: '/images/pages/cybersecurity-hero.jpg',
    href: '/programs/it-help-desk',
  },
  {
    title: 'CDL Training',
    duration: '4–6 weeks',
    credential: 'Class A Commercial Driver\'s License',
    funding: 'WIOA, WRG',
    image: '/images/pages/cdl-hero.jpg',
    href: '/programs/cdl-training',
  },
  {
    title: 'Skilled Trades',
    duration: '8–24 weeks',
    credential: 'OSHA 30, NCCER, EPA 608, Industry Certs',
    funding: 'WIOA, WRG, DOL Apprenticeship',
    image: '/images/pages/comp-pathway-trades.jpg',
    href: '/programs/hvac-technician',
  },
  {
    title: 'Business & Office Administration',
    duration: '4–8 weeks',
    credential: 'Microsoft Office Specialist, QuickBooks',
    funding: 'WIOA, WRG',
    image: '/images/pages/business-sector.jpg',
    href: '/programs/office-administration',
  },
];

const FUNDING_SOURCES = [
  'WIOA Title I — Adult',
  'WIOA Title I — Dislocated Worker',
  'WIOA Title I — Youth',
  'Workforce Ready Grant (WRG)',
  'SNAP Employment & Training',
  'TANF',
  'Trade Adjustment Assistance (TAA)',
  'Veterans Benefits (GI Bill / VR&E)',
];

export default function WorkOnePartnerPacketPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumbs */}
      <div className="bg-slate-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Breadcrumbs items={[{ label: 'Funding', href: '/funding' }, { label: 'WorkOne Partner Packet' }]} />
        </div>
      </div>

      {/* Hero — video with text overlay (handled inside HeroVideo component) */}
      <WorkOneHeroVideo />

      {/* Quick actions below hero */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-5 flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
          >
            <Phone className="w-4 h-4" /> Contact Our Team
          </Link>
          <Link
            href="tel:3173143757"
            className="inline-flex items-center gap-2 border border-slate-300 hover:border-brand-blue-400 text-slate-700 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            (317) 314-3757
          </Link>
          <PrintButton />
        </div>
      </div>

      {/* Organization Overview */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Organization Overview</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Building2, label: 'Organization Type', value: '501(c)(3) Nonprofit Workforce Training Institute' },
              { icon: Shield, label: 'Federal Oversight', value: 'U.S. Department of Labor — Registered Apprenticeship Sponsor' },
              { icon: Award, label: 'ETPL Status', value: 'Approved — All Indiana WorkOne Regions' },
              { icon: FileText, label: 'State Alignment', value: 'Indiana Department of Workforce Development (DWD)' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="bg-white rounded-xl p-5 border border-slate-200 flex gap-3">
                  <Icon className="w-5 h-5 text-brand-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{item.label}</div>
                    <div className="text-slate-600 text-sm mt-0.5">{item.value}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-6">Who We Are</h2>
              <div className="space-y-4 text-slate-700 leading-relaxed">
                <p>
                  Elevate for Humanity is a <strong className="text-slate-900">DOL-registered apprenticeship sponsor</strong> and{' '}
                  <strong className="text-slate-900">ETPL-approved workforce training provider</strong> serving Indiana job seekers
                  and employers. We are a 501(c)(3) nonprofit headquartered in Indianapolis.
                </p>
                <p>
                  We are <strong className="text-slate-900">not a staffing agency</strong> and{' '}
                  <strong className="text-slate-900">not a traditional school</strong>. We provide training infrastructure,
                  compliance coordination, and employer partnerships so WorkOne participants can earn
                  industry-recognized credentials and connect to real jobs.
                </p>
                <p>
                  Our model connects workforce boards, employers, and job seekers in structured
                  pathways that produce measurable outcomes and meet all federal WIOA reporting requirements.
                </p>
              </div>
              <ul className="mt-6 space-y-2">
                {[
                  'ETPL-approved in all Indiana WorkOne regions',
                  'DOL-registered apprenticeship sponsor (RAPIDS)',
                  'WIOA Title I Adult, DW, and Youth eligible',
                  'WRG-approved for all offered programs',
                  'FERPA, ADA, and EEO compliant',
                  'Real-time outcome reporting for case managers',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/pages/workone-partner-packet-page-1.jpg"
                alt="Elevate for Humanity workforce training"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works for WorkOne */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3">How Referrals Work</h2>
            <p className="text-slate-700 max-w-2xl mx-auto">
              A streamlined process for referring WIOA and WRG participants. From referral to
              enrollment in 48 hours or less.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Case Manager Referral',
                desc: 'WorkOne case manager identifies an eligible participant and submits a referral via our online portal, email, or phone.',
                image: '/images/pages/partner-page-1.jpg',
              },
              {
                step: '02',
                title: 'Intake & Eligibility',
                desc: 'We complete intake, verify WIOA/WRG eligibility, and confirm the appropriate program within 24 hours.',
                image: '/images/pages/partner-page-14.jpg',
              },
              {
                step: '03',
                title: 'Enrollment & Training',
                desc: 'Participant enrolls and begins training. Weekly progress updates are sent to the case manager. Support services available.',
                image: '/images/pages/workone-packet-1.jpg',
              },
              {
                step: '04',
                title: 'Credential & Placement',
                desc: 'Upon completion, we issue credentials, provide job placement assistance, and report employment outcomes for WIOA performance measures.',
                image: '/images/pages/workone-packet-2.jpg',
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm flex flex-col">
                <div className="relative h-36 overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-3xl font-black text-brand-blue-200 mb-2">{item.step}</span>
                  <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ETPL-Approved Programs */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3">ETPL-Approved Programs</h2>
            <p className="text-slate-700 max-w-2xl mx-auto">
              All programs are listed on Indiana's Eligible Training Provider List and lead to
              industry-recognized credentials. ITA vouchers accepted for all programs.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROGRAMS.map((program) => (
              <Link
                key={program.title}
                href={program.href}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col group"
              >
                <div className="relative h-44 overflow-hidden flex-shrink-0">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-900 mb-3">{program.title}</h3>
                  <div className="space-y-1.5 text-sm flex-1">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-brand-blue-500 flex-shrink-0" />
                      <span>{program.duration}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-600">
                      <Award className="w-3.5 h-3.5 text-brand-blue-500 flex-shrink-0 mt-0.5" />
                      <span>{program.credential}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <DollarSign className="w-3.5 h-3.5 text-brand-blue-500 flex-shrink-0" />
                      <span>{program.funding}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-brand-blue-600 text-sm font-semibold">
                    View Program <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              View All Programs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Funding & Billing */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-6">Funding & Billing</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We accept all major workforce funding streams and provide transparent billing
                with no hidden fees. ITA vouchers, direct contracts, and employer-sponsored
                arrangements are all supported.
              </p>
              <p className="text-slate-700 leading-relaxed mb-6">
                Our team handles all enrollment paperwork, progress reporting, and outcome
                documentation required for WIOA performance measures. Case managers receive
                weekly progress updates and final outcome reports.
              </p>
              <h3 className="font-bold text-slate-900 mb-3">Accepted Funding Sources</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FUNDING_SOURCES.map((source) => (
                  <div key={source} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-blue-600 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{source}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Billing Process</h3>
              <div className="space-y-5">
                {[
                  { step: '1', title: 'ITA / Voucher Submission', desc: 'Case manager submits ITA or funding authorization to our enrollment team.' },
                  { step: '2', title: 'Enrollment Confirmation', desc: 'We confirm enrollment and send the participant\'s start date within 24 hours.' },
                  { step: '3', title: 'Training Delivery', desc: 'Participant completes training. Progress reports sent weekly to case manager.' },
                  { step: '4', title: 'Invoice & Outcome Report', desc: 'Invoice submitted upon completion with credential attainment and employment outcome data.' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-8 h-8 bg-brand-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{item.title}</div>
                      <div className="text-slate-600 text-sm mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reporting & Compliance */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-72 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/pages/workone-packet-2.jpg"
                alt="Outcome reporting and compliance"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-6">Reporting & Compliance</h2>
              <p className="text-slate-700 leading-relaxed mb-6">
                We provide full transparency on participant progress and outcomes. All data
                is formatted for WIOA performance reporting and available to authorized
                case managers and workforce board staff.
              </p>
              <div className="space-y-4">
                {[
                  { icon: TrendingUp, title: 'Weekly Progress Reports', desc: 'Attendance, module completion, and milestone updates sent to case managers.' },
                  { icon: Award, title: 'Credential Attainment Records', desc: 'Digital certificates issued and verifiable through our public credential portal.' },
                  { icon: Briefcase, title: 'Employment Outcome Tracking', desc: 'Job placement, employer name, wage, and retention data reported at 2nd and 4th quarter.' },
                  { icon: FileText, title: 'Audit-Ready Documentation', desc: 'All enrollment, attendance, and outcome records maintained and available for DWD audits.' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-3">
                      <div className="w-9 h-9 bg-brand-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-brand-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{item.title}</div>
                        <div className="text-slate-600 text-sm mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-brand-blue-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Ready to Refer a Participant?</h2>
          <p className="text-lg text-white/90 mb-2 max-w-2xl mx-auto">
            Contact our WorkOne liaison to set up a referral agreement, request program
            information, or submit your first referral.
          </p>
          <p className="text-white/70 text-sm mb-8">
            Elevate for Humanity · 501(c)(3) Nonprofit · Indianapolis, Indiana
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-blue-700 font-bold px-8 py-4 rounded-lg hover:bg-slate-50 transition-colors shadow-lg"
            >
              <Mail className="w-5 h-5" /> Send a Message
            </Link>
            <a
              href="tel:3173143757"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/50 hover:border-white text-white font-bold px-8 py-4 rounded-lg transition-colors"
            >
              <Phone className="w-5 h-5" /> (317) 314-3757
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
