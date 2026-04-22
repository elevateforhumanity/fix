export const revalidate = 3600;

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import {
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Users,
  Award,
  Briefcase,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Mail,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Job Ready Indy Partner | Elevate for Humanity',
  description:
    'Elevate for Humanity is an approved Job Ready Indy training partner. JRI-funded employability skills training for Indianapolis residents — free for eligible participants.',
  alternates: {
    canonical: 'https://www.elevateforhumanity.org/partners/jri',
  },
};

const BADGES = [
  {
    badge: 'Badge 1',
    title: 'Introduction to Job Ready Indy',
    desc: 'Orientation to the JRI program, goal-setting, and understanding the Indianapolis workforce landscape.',
    color: 'bg-brand-blue-100 text-brand-blue-700',
  },
  {
    badge: 'Badge 2',
    title: 'Professional Communication',
    desc: 'Workplace writing, verbal communication, active listening, and professional email etiquette.',
    color: 'bg-brand-blue-100 text-brand-blue-700',
  },
  {
    badge: 'Badge 3',
    title: 'Workplace Professionalism',
    desc: 'Attendance, punctuality, dress code, workplace conduct, and building a professional reputation.',
    color: 'bg-brand-blue-100 text-brand-blue-700',
  },
  {
    badge: 'Badge 4',
    title: 'Problem Solving & Critical Thinking',
    desc: 'Structured approaches to workplace challenges, decision-making frameworks, and conflict resolution.',
    color: 'bg-brand-blue-100 text-brand-blue-700',
  },
  {
    badge: 'Badge 5',
    title: 'Teamwork & Collaboration',
    desc: 'Working effectively in diverse teams, understanding roles, and contributing to shared goals.',
    color: 'bg-brand-blue-100 text-brand-blue-700',
  },
  {
    badge: 'Badge 6',
    title: 'Career Planning',
    desc: 'Resume building, interview preparation, job search strategies, and setting long-term career goals.',
    color: 'bg-brand-blue-100 text-brand-blue-700',
  },
  {
    badge: 'Bonus',
    title: 'Financial Literacy',
    desc: 'Budgeting, banking basics, understanding pay stubs, and building financial stability on a working income.',
    color: 'bg-green-100 text-green-700',
  },
  {
    badge: 'Bonus',
    title: 'Digital Literacy',
    desc: 'Computer basics, email, Microsoft Office fundamentals, and navigating online job applications.',
    color: 'bg-green-100 text-green-700',
  },
];

const BENEFITS = [
  {
    icon: DollarSign,
    title: 'Free for Eligible Participants',
    desc: 'Job Ready Indy funding covers 100% of tuition for eligible Indianapolis residents. No out-of-pocket cost.',
  },
  {
    icon: BookOpen,
    title: 'Self-Paced Online Learning',
    desc: 'Participants complete coursework on their own schedule through Elevate\'s LMS — no fixed class times.',
  },
  {
    icon: Award,
    title: 'Industry-Backed Credentials',
    desc: 'Each badge is recognized by EmployIndy and Indianapolis-area employers as proof of work-readiness.',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    desc: 'Case managers and participants can monitor badge completion and course progress in real time.',
  },
  {
    icon: Briefcase,
    title: 'Employer Connections',
    desc: 'JRI completers are connected to Elevate\'s employer network for job placement and career advancement.',
  },
  {
    icon: ShieldCheck,
    title: 'Facilitator Support',
    desc: 'Elevate staff provide coaching, accountability check-ins, and technical support throughout the program.',
  },
];

export default function JRIPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Breadcrumbs items={[{ label: 'Partners', href: '/partners' }, { label: 'Job Ready Indy' }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ minHeight: 'clamp(420px, 55vw, 600px)' }}>
        <Image
          src="/images/pages/career-services-page-1.jpg"
          alt="Job Ready Indy workforce training"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-4 pb-12 pt-20">
          <span className="inline-block bg-brand-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            EmployIndy · Job Ready Indy
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight drop-shadow-md">
            Job Ready Indy<br />at Elevate for Humanity
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed drop-shadow mb-6">
            Free employability skills training for Indianapolis residents. Earn six industry-recognized
            badges and connect to career training, job placement, and employer partnerships — all at no cost
            to eligible participants.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://learning.employindy.org/jri-participant-elevatehumanitycareertraining"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Enroll Now <ExternalLink className="w-4 h-4" />
            </a>
            <Link
              href="/apply/intake"
              className="inline-flex items-center gap-2 border border-white/50 hover:border-white text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Apply to Elevate <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* What is JRI */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">What Is Job Ready Indy?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Job Ready Indy (JRI) is an EmployIndy-funded program that provides free employability
                skills training to Indianapolis residents. It is designed for individuals who are
                entering or re-entering the workforce and need foundational professional skills to
                succeed in any career field.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Elevate for Humanity is an approved JRI training partner. Participants complete
                six badge courses covering communication, professionalism, teamwork, problem solving,
                and career planning — plus two bonus courses in financial and digital literacy.
              </p>
              <p className="text-slate-700 leading-relaxed mb-6">
                JRI is often paired with Elevate's career training programs in HVAC, CDL, barbering,
                healthcare, and IT — giving participants both the soft skills and the technical
                credentials employers require.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Free for eligible residents', 'Self-paced online', '6 badges + 2 bonus courses', 'EmployIndy recognized'].map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1.5 bg-brand-blue-50 text-brand-blue-700 text-sm font-semibold px-3 py-1.5 rounded-full border border-brand-blue-200">
                    <CheckCircle className="w-3.5 h-3.5" /> {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/pages/about-career-training.jpg"
                alt="Career training at Elevate"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3">What Participants Get</h2>
            <p className="text-slate-700 max-w-2xl mx-auto">
              JRI through Elevate includes more than just coursework — participants get coaching,
              employer connections, and a pathway into career training.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((item) => {
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

      {/* Course Badges */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3">The 8 Courses</h2>
            <p className="text-slate-700 max-w-2xl mx-auto">
              Six required badge courses plus two bonus courses. All self-paced and delivered
              through Elevate's LMS. Most participants complete the full program in 2–4 weeks.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {BADGES.map((item) => (
              <div key={item.title} className="bg-white border border-slate-200 rounded-xl p-6 hover:border-brand-blue-400 hover:shadow-md transition-all flex gap-4">
                <div className="flex-shrink-0">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${item.color}`}>
                    {item.badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Qualifies */}
      <section className="py-16 bg-brand-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-72 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/pages/community-page-2.jpg"
                alt="Indianapolis community members"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">Who Qualifies?</h2>
              <p className="text-slate-700 leading-relaxed mb-6">
                Job Ready Indy is funded by EmployIndy and available to Indianapolis residents
                who meet eligibility requirements. Elevate staff verify eligibility during enrollment.
              </p>
              <ul className="space-y-3">
                {[
                  'Indianapolis residents (Marion County)',
                  'Adults 18 and older',
                  'Individuals entering or re-entering the workforce',
                  'Justice-involved individuals (reentry-friendly)',
                  'SNAP, TANF, or public assistance recipients',
                  'Individuals referred by WorkOne or a case manager',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 text-center">
            <Users className="w-10 h-10 text-brand-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-slate-900 mb-2">Questions? We Can Help.</h2>
            <p className="text-slate-700 mb-6 max-w-xl mx-auto">
              Contact Elevate for Humanity to verify your eligibility, get help enrolling,
              or learn how JRI connects to our career training programs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4" /> Contact Us
              </Link>
              <a
                href="tel:3173143757"
                className="inline-flex items-center gap-2 border border-slate-300 hover:border-brand-blue-400 text-slate-700 font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                (317) 314-3757
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-blue-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Enroll in Job Ready Indy through Elevate for Humanity — or apply to pair JRI
            with a full career training program in trades, healthcare, or technology.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="https://learning.employindy.org/jri-participant-elevatehumanitycareertraining"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-blue-700 font-bold px-8 py-4 rounded-lg hover:bg-slate-50 transition-colors shadow-lg"
            >
              Enroll in JRI <ExternalLink className="w-4 h-4" />
            </a>
            <Link
              href="/apply"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/50 hover:border-white text-white font-bold px-8 py-4 rounded-lg transition-colors"
            >
              Apply to Elevate <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
