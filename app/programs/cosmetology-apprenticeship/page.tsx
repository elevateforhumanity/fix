export const revalidate = 3600;

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, XCircle } from 'lucide-react';
import HeroVideo from '@/components/marketing/HeroVideo';
import heroBanners from '@/content/heroBanners';
import { CredentialsOutcomes } from '@/components/programs/CredentialsOutcomes';
import { FundingBadge } from '@/components/programs/FundingBadge';
import PathwayDisclosure from '@/components/PathwayDisclosure';
import { HostShopRequirements } from '@/components/compliance/HostShopRequirements';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Registered Cosmetology Apprenticeship | DOL Sponsorship & Oversight | Indiana',
  description:
    'DOL Registered Cosmetology Apprenticeship sponsorship, oversight, and related instruction (Milady Theory) in Indiana. Federal apprenticeship sponsorship, employer coordination, compliance reporting. ETPL approved.',
  keywords:
    'cosmetology apprenticeship Indiana, DOL registered apprenticeship, apprenticeship sponsorship, cosmetology training Indianapolis, RAPIDS registered, ETPL approved, beauty school apprenticeship',
  alternates: {
    canonical: 'https://www.elevateforhumanity.org/programs/cosmetology-apprenticeship',
  },
};

const FAQS = [
  {
    q: 'Does the $4,980 change if I transfer in hours?',
    a: 'No. The program fee is a flat rate. Transferred hours reduce time-in-program, not the scope of services or fee.',
  },
  {
    q: 'Does this program replace cosmetology school?',
    a: 'No. Apprentices must complete licensure-required instructional hours through a licensed cosmetology school.',
  },
  {
    q: 'What does the $4,980 cover?',
    a: 'Federal apprenticeship sponsorship, compliance reporting, employer coordination, Milady theory instruction, and program completion documentation.',
  },
  {
    q: 'How many hours are required for an Indiana cosmetology license?',
    a: 'Indiana requires 1,500 hours of cosmetology training to be eligible for licensure.',
  },
  {
    q: "What's the difference between cosmetology and barber?",
    a: 'Cosmetology covers hair styling, coloring, chemical treatments, skincare, and nail services. Barbering focuses on hair cutting, shaving, and beard trimming. Cosmetology requires 1,500 hours; barbering requires 2,000 hours in Indiana.',
  },
];

const PAYMENT_PLANS = [
  { label: '4-Month Plan', months: 4, amount: '$1,245' },
  { label: '6-Month Plan', months: 6, amount: '$830' },
  { label: '12-Month Plan', months: 12, amount: '$415' },
];

export default function CosmetologyApprenticeshipPage() {
  const b = heroBanners['cosmetology-apprenticeship'];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Video hero — poster loads instantly behind the video, no flash */}
      <HeroVideo
        videoSrcDesktop={b.videoSrcDesktop}
        posterImage={b.posterImage}
        voiceoverSrc={'voiceoverSrc' in b ? b.voiceoverSrc : undefined}
        microLabel={b.microLabel}
        analyticsName={b.analyticsName}
        belowHeroHeadline={b.belowHeroHeadline}
        belowHeroSubheadline={b.belowHeroSubheadline}
        ctas={[b.primaryCta, b.secondaryCta]}
        trustIndicators={b.trustIndicators}
        transcript={b.transcript}
      />

      {/* How it works — 3 steps */}
      <section className="bg-white border-b border-slate-100 py-12">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-sm font-bold text-slate-900 mb-8 text-center uppercase tracking-widest">How it works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: '1', label: 'Learn', detail: 'Complete Milady theory online — hair, skin, nails, sanitation, state law, and exam prep.' },
              { step: '2', label: 'Train', detail: 'Work in a licensed salon under a cosmetologist-mentor. Earn wages while logging your 1,500 required hours.' },
              { step: '3', label: 'Get Licensed', detail: 'Pass the Indiana IPLA written and practical exams and earn your Indiana Cosmetology License.' },
            ].map(({ step, label, detail }) => (
              <div key={step} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-red-600 text-white font-black text-lg flex items-center justify-center flex-shrink-0">{step}</div>
                <div>
                  <p className="font-bold text-slate-900 mb-1">{label}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: 'Programs', href: '/programs' },
          { label: 'Cosmetology Apprenticeship' },
        ]}
      />

      <PathwayDisclosure programName="Cosmetology Apprenticeship" programSlug="cosmetology-apprenticeship" />

      {/* Program Description */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <FundingBadge type="self-pay" />
                <span className="px-3 py-1 bg-brand-blue-600 text-white text-sm font-semibold rounded-full">DOL Registered</span>
                <span className="px-3 py-1 bg-brand-red-600 text-white text-sm font-semibold rounded-full">Apprenticeship Sponsorship</span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Program Description</h2>
              <p className="text-lg text-slate-700 mb-4">
                Launch your career in the beauty industry through our DOL-registered apprenticeship program.
                Gain hands-on experience while earning, with comprehensive theory instruction through Milady.
              </p>
              <p className="text-slate-700">
                Our program combines federal apprenticeship sponsorship with employer coordination and compliance
                reporting to ensure you meet all requirements for a successful career in cosmetology.
              </p>
            </div>
            <div className="relative h-[350px] rounded-2xl overflow-hidden">
              <Image
                src="/images/pathways/beauty-hero.jpg"
                alt="Cosmetology training"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-6">
          <div className="bg-brand-blue-50 border-2 border-brand-blue-200 rounded-xl p-6 mb-8">
            <p className="text-lg text-slate-900 leading-relaxed font-semibold">
              Registered Cosmetology Apprenticeship Sponsorship, Oversight &amp; Related Instruction (Milady Theory).
            </p>
            <p className="text-slate-700 mt-4 leading-relaxed">
              This program provides federal apprenticeship sponsorship, employer coordination, compliance reporting, and related instruction.
              Practical skills training and licensure-required instructional hours are provided by a licensed cosmetology school.
              This program does not grant cosmetology licensure or clock hours toward state exams.
            </p>
          </div>

          {/* Indiana Requirements */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Indiana Cosmetology Requirements</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-brand-green-600 flex-shrink-0 mt-0.5" />
                <span><strong>1,500 hours</strong> of cosmetology training required</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-brand-green-600 flex-shrink-0 mt-0.5" />
                <span>Pass written and practical exams</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-brand-green-600 flex-shrink-0 mt-0.5" />
                <span>Prepares learners for licensure through <strong>Indiana Professional Licensing Agency (IPLA)</strong></span>
              </li>
            </ul>
          </div>

          {/* Included vs Not Included */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-brand-green-50 border-2 border-brand-green-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-brand-green-600" />
                What the Program Fee Covers
              </h3>
              <ul className="space-y-3">
                {[
                  'DOL Registered Apprenticeship sponsorship',
                  'Compliance and RAPIDS reporting',
                  'Employer (salon) coordination and OJT verification',
                  'Program monitoring and completion documentation',
                  'Related Instruction: Milady theory curriculum',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-brand-green-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <XCircle className="w-6 h-6 text-red-500" />
                What the Program Fee Does NOT Cover
              </h3>
              <ul className="space-y-3">
                {[
                  'Practical hands-on cosmetology training',
                  'State licensure-required instructional hours',
                  'Cosmetology school enrollment',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-700">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Program Fee</h2>

          <div className="bg-white border-2 border-slate-200 rounded-xl p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="text-5xl font-black text-brand-blue-600">$4,980</div>
              <div className="text-xl text-slate-600 mt-2">Flat Program Fee</div>
            </div>

            <div className="bg-brand-blue-50 border border-brand-blue-200 rounded-lg p-4 mb-6">
              <p className="text-slate-700 text-center text-sm">
                <strong>The program fee applies regardless of transferred hours.</strong> Credit for prior learning may reduce the duration of participation but does not alter the program fee.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900">Payment Options</h3>

              <Link
                href="/apply?program=cosmetology-apprenticeship&payment=full"
                className="w-full flex items-center justify-between px-6 py-4 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-bold rounded-lg transition-colors"
              >
                <div>
                  <div className="font-bold text-lg">Pay in Full</div>
                  <div className="text-sm text-brand-blue-100">One-time payment of $4,980</div>
                </div>
                <span className="text-2xl font-bold">$4,980</span>
              </Link>

              {PAYMENT_PLANS.map(({ label, months, amount }) => (
                <Link
                  key={months}
                  href={`/apply?program=cosmetology-apprenticeship&payment=plan&months=${months}`}
                  className="w-full flex items-center justify-between px-6 py-4 bg-white border-2 border-slate-200 hover:border-brand-blue-400 text-slate-900 font-bold rounded-lg transition-colors"
                >
                  <div>
                    <div className="font-bold text-lg">{label}</div>
                    <div className="text-sm text-slate-500">{months} payments of {amount}</div>
                  </div>
                  <span className="text-xl font-bold text-brand-blue-600">{amount}/mo</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map(({ q, a }) => (
              <div key={q} className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{q}</h3>
                <p className="text-slate-700">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HostShopRequirements
        programTrack="cosmetology"
        showApprovalProcess={true}
        showMultiRegion={true}
      />

      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <CredentialsOutcomes
            programName="Cosmetology Apprenticeship"
            partnerCertifications={[
              'Indiana Cosmetology License (issued by Indiana Professional Licensing Agency)',
              'USDOL Registered Apprenticeship Certificate of Completion',
            ]}
            employmentOutcomes={[
              'Licensed Cosmetologist',
              'Hair Stylist',
              'Salon Owner/Operator',
              'Cosmetology Instructor',
            ]}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-blue-600">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-brand-blue-100 text-lg mb-8">
            Apply now to begin your Registered Cosmetology Apprenticeship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/programs/cosmetology-apprenticeship/apply"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-bold text-brand-blue-600 hover:bg-brand-blue-50 transition-colors shadow-lg"
            >
              Apply Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-4 text-lg font-bold text-white hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
