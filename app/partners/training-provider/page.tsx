export const revalidate = 3600;

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import {
  ArrowRight,
  CheckCircle,
  DollarSign,
  FileText,
  Users,
  Award,
  TrendingUp,
  ShieldCheck,
  BookOpen,
  Briefcase,
  Building2,
  ClipboardList,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Training Provider Partnership | Elevate for Humanity',
  description:
    'Become an approved training provider on the Elevate platform. Access WIOA-funded student referrals, ETPL listing support, compliance tools, and outcome tracking.',
  alternates: { canonical: 'https://www.elevateforhumanity.org/partners/training-provider' },
};

const WHAT_WE_PROVIDE = [
  {
    icon: DollarSign,
    title: 'WIOA & State Funding Referrals',
    desc: 'Receive Individual Training Account (ITA) referrals from WorkOne case managers. Students arrive with funding already approved — no tuition collection from participants.',
  },
  {
    icon: FileText,
    title: 'ETPL Listing & Renewal Support',
    desc: 'We guide you through Indiana DWD\'s Eligible Training Provider List application, annual performance reporting, and renewal. Most providers are listed within 30 days.',
  },
  {
    icon: BookOpen,
    title: 'LMS & Enrollment Management',
    desc: 'Use Elevate\'s LMS to manage enrollment, track attendance, issue credentials, and generate compliance reports — all in one place.',
  },
  {
    icon: TrendingUp,
    title: 'Automated Outcome Reporting',
    desc: 'Credential attainment, job placement rates, and wage data are tracked and reported automatically to meet WIOA Title I performance requirements.',
  },
  {
    icon: Users,
    title: 'Case Manager Coordination',
    desc: 'Our enrollment team coordinates directly with WorkOne case managers, reducing administrative burden on your staff.',
  },
  {
    icon: Award,
    title: 'Credential Issuance Infrastructure',
    desc: 'Certificates of completion and industry credentials are issued and publicly verifiable through the Elevate platform.',
  },
];

const REQUIREMENTS = [
  'Licensed or industry-recognized training provider in good standing',
  'Programs that lead to industry-recognized certifications or credentials',
  'Demonstrated employment outcomes for program graduates',
  'Willingness to meet WIOA and ETPL reporting requirements',
  'Capacity to serve WIOA-eligible and funded students',
  'Qualified instructors with relevant industry credentials or licensure',
];

const WHO_QUALIFIES = [
  { icon: Briefcase, label: 'Trade & vocational schools' },
  { icon: Building2, label: 'Healthcare training programs' },
  { icon: ShieldCheck, label: 'CDL & transportation providers' },
  { icon: ClipboardList, label: 'IT & cybersecurity bootcamps' },
  { icon: BookOpen, label: 'Business & office skills programs' },
  { icon: Users, label: 'Community-based training orgs' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Submit Your Application',
    desc: 'Tell us about your organization, programs, credentials offered, instructor qualifications, and current student outcomes.',
    image: '/images/pages/partners-pub-page-1.jpg',
  },
  {
    step: '02',
    title: 'Review & Approval',
    desc: 'Elevate staff review your application within 5–7 business days. We may request supporting documents such as licenses, syllabi, or outcome data.',
    image: '/images/pages/partners-pub-page-4.jpg',
  },
  {
    step: '03',
    title: 'ETPL Listing',
    desc: 'We help you complete the Indiana DWD ETPL application. Once listed, your programs are visible to WorkOne case managers statewide.',
    image: '/images/pages/partners-pub-page-6.jpg',
  },
  {
    step: '04',
    title: 'Receive Funded Referrals',
    desc: 'WIOA-eligible students are referred to your programs with funding already approved. You deliver training; we handle enrollment coordination and reporting.',
    image: '/images/pages/partners-pub-page-7.jpg',
  },
];

export default function TrainingProviderPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Breadcrumbs items={[{ label: 'Partners', href: '/partners' }, { label: 'Training Provider' }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: 'clamp(420px, 52vw, 600px)' }}>
        <Image
          src="/images/pages/training-providers-page-1.jpg"
          alt="Training provider partnership with Elevate for Humanity"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-4 pb-12 pt-20">
          <span className="inline-block bg-brand-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            ETPL Approved · WIOA Funded · DOL Registered
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight drop-shadow-md">
            Training Provider Partnership
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed drop-shadow mb-6">
            Join Elevate's provider network to access WIOA-funded student referrals, ETPL listing
            support, and a full compliance infrastructure — so you can focus on delivering
            great training.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/partners/apply"
              className="inline-flex items-center gap-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Apply Now <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:3173143757"
              className="inline-flex items-center gap-2 border border-white/50 hover:border-white text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Call (317) 314-3757
            </a>
          </div>
        </div>
      </section>

      {/* What is a Training Provider */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">What Is a Training Provider?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                A training provider is an organization that delivers structured, credential-bearing
                instruction in a high-demand field. On the Elevate platform, approved providers
                receive referrals from WorkOne case managers whose clients have WIOA Individual
                Training Account (ITA) funding already approved.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                To receive WIOA-funded referrals, providers must be listed on Indiana's
                <strong> Eligible Training Provider List (ETPL)</strong> — a state-maintained
                registry of approved programs. Elevate helps providers get listed and stay
                compliant with annual performance reporting requirements.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Providers keep their existing curriculum, instructors, and facilities. Elevate
                adds the compliance layer, student tracking, and funding pipeline on top.
              </p>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/pages/training-classroom.jpg"
                alt="Training provider classroom"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3">What Providers Get</h2>
            <p className="text-slate-700 max-w-2xl mx-auto">
              Approved providers gain access to Elevate's full infrastructure — from funded
              student referrals to credential issuance to automated compliance reporting.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHAT_WE_PROVIDE.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex gap-4">
                  <div className="w-10 h-10 bg-brand-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-brand-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who Qualifies */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">Who Can Apply?</h2>
              <p className="text-slate-700 leading-relaxed mb-6">
                We work with a wide range of training organizations. If you deliver structured,
                credential-bearing instruction in a high-demand field and can meet WIOA reporting
                requirements, you likely qualify.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {WHO_QUALIFIES.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <Icon className="w-4 h-4 text-brand-blue-600 flex-shrink-0" />
                      <span className="text-sm text-slate-700 font-medium">{item.label}</span>
                    </div>
                  );
                })}
              </div>
              <h3 className="font-bold text-slate-900 mb-4">Provider Requirements</h3>
              <ul className="space-y-3">
                {REQUIREMENTS.map((r) => (
                  <li key={r} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/pages/platform-partners-hero.jpg"
                alt="Training provider requirements"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-brand-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3">How the Partnership Works</h2>
            <p className="text-slate-700 max-w-2xl mx-auto">
              From application to receiving your first funded referral, most providers are
              fully onboarded within 2–4 weeks.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm flex flex-col">
                <div className="relative h-40 overflow-hidden flex-shrink-0">
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

      {/* CTA */}
      <section className="py-16 bg-brand-blue-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Become an Approved Provider</h2>
          <p className="text-lg text-white/90 mb-2 max-w-2xl mx-auto">
            Apply to join our training provider network and start receiving WIOA-funded
            student referrals.
          </p>
          <p className="text-white/70 text-sm mb-8">
            Questions first? Call <a href="tel:3173143757" className="font-semibold text-white underline">(317) 314-3757</a> — most provider agreements are set up within a week.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/partners/apply"
              className="inline-flex items-center gap-2 bg-white text-brand-blue-700 font-bold px-8 py-4 rounded-lg hover:bg-slate-50 transition-colors shadow-lg"
            >
              Apply as Training Provider <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:3173143757"
              className="inline-flex items-center gap-2 border-2 border-white/50 hover:border-white text-white font-bold px-8 py-4 rounded-lg transition-colors"
            >
              Call (317) 314-3757
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
