export const revalidate = 3600;

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Award, ArrowRight, Shield, Clock, CheckCircle, TrendingUp, Star } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import HeroVideo from '@/components/marketing/HeroVideo';
import heroBanners from '@/content/heroBanners';

export const metadata: Metadata = {
  title: 'Industry Certifications | Elevate for Humanity',
  description: 'Earn industry-recognized certifications in healthcare, technology, trades, and business. Free with WIOA or Next Level Jobs funding for eligible Indiana residents.',
  alternates: { canonical: 'https://www.elevateforhumanity.org/certifications' },
};

const CERTIFICATIONS = [
  { name: 'Certified Nursing Assistant (CNA)', industry: 'Healthcare', duration: '4–6 weeks', demand: 'High', image: '/images/pages/healthcare-hero.jpg', slug: 'cna', body: 'Indiana State Dept. of Health' },
  { name: 'Certified Phlebotomy Technician (CPT)', industry: 'Healthcare', duration: '4–6 weeks', demand: 'High', image: '/images/pages/comp-pathway-healthcare.jpg', slug: 'phlebotomy', body: 'NHA' },
  { name: 'Certified Medical Assistant (CCMA)', industry: 'Healthcare', duration: '8–12 weeks', demand: 'High', image: '/images/pages/healthcare-classroom.jpg', slug: 'medical-assistant', body: 'NHA' },
  { name: 'EPA 608 Certification', industry: 'HVAC', duration: '10–16 weeks', demand: 'Required', image: '/images/pages/hvac-technician.jpg', slug: 'hvac-technician', body: 'ESCO Group' },
  { name: 'OSHA 10 / OSHA 30', industry: 'Construction', duration: '1–3 days', demand: 'Required', image: '/images/pages/welding-sparks.jpg', slug: 'construction-trades-certification', body: 'OSHA / USDOL' },
  { name: 'CompTIA A+ / IT Specialist', industry: 'Technology', duration: '8–12 weeks', demand: 'High', image: '/images/pages/it-help-desk.jpg', slug: 'it-help-desk', body: 'Certiport / CompTIA' },
  { name: 'Microsoft Office Specialist (MOS)', industry: 'Business', duration: '6–8 weeks', demand: 'High', image: '/images/pages/business-sector.jpg', slug: 'business-administration', body: 'Certiport / Microsoft' },
  { name: 'QuickBooks Certified User', industry: 'Business', duration: '5 weeks', demand: 'High', image: '/images/pages/card-business.jpg', slug: 'bookkeeping', body: 'Certiport / Intuit' },
  { name: 'Indiana Barber License', industry: 'Beauty', duration: '2,000 hours', demand: 'Required', image: '/images/pages/barber-gallery-1.jpg', slug: 'barber-apprenticeship', body: 'Indiana PLA' },
  { name: 'Indiana Cosmetology License', industry: 'Beauty', duration: '1,500 hours', demand: 'Required', image: '/images/pages/cosmetology-hero.jpg', slug: 'cosmetology-apprenticeship', body: 'Indiana PLA' },
  { name: 'Indiana CPRS', industry: 'Behavioral Health', duration: '8 weeks', demand: 'High', image: '/images/pages/career-services-page-1.jpg', slug: 'peer-recovery-specialist', body: 'ICAADA' },
  { name: 'IRS PTIN (Tax Preparer)', industry: 'Finance', duration: '8 weeks', demand: 'Required', image: '/images/pages/admin-tax-training-hero.jpg', slug: 'tax-preparation', body: 'Internal Revenue Service' },
];

const WHY = [
  { icon: <TrendingUp className="w-6 h-6 text-brand-blue-600" />, title: 'Higher Earnings', desc: 'Certified professionals earn 15–25% more than uncertified peers in the same role.' },
  { icon: <Star className="w-6 h-6 text-amber-500" />, title: 'Employer Recognition', desc: 'All credentials we offer are nationally recognized and required or preferred by employers.' },
  { icon: <Shield className="w-6 h-6 text-green-600" />, title: 'Career Advancement', desc: 'Certifications open doors to promotions, supervisory roles, and specialized positions.' },
];

export default function CertificationsPage() {
  const banner = heroBanners['certifications'];
  return (
    <div className="bg-white">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <Breadcrumbs items={[{ label: 'Certifications' }]} />
        </div>
      </div>

      <HeroVideo
        videoSrcDesktop={banner.videoSrcDesktop}
        posterImage={banner.posterImage}
        voiceoverSrc={banner.voiceoverSrc}
        microLabel={banner.microLabel}
        belowHeroHeadline={banner.belowHeroHeadline}
        belowHeroSubheadline={banner.belowHeroSubheadline}
        ctas={[banner.primaryCta, ...(banner.secondaryCta ? [banner.secondaryCta] : [])]}
        trustIndicators={banner.trustIndicators}
        transcript={banner.transcript}
      />

      {/* Certifications grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2 text-center">Available Certifications</h2>
          <p className="text-slate-600 text-center mb-10">All programs are ETPL-approved and eligible for WIOA or Next Level Jobs funding.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CERTIFICATIONS.map((cert) => (
              <Link key={cert.slug + cert.name} href={`/programs/${cert.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-md transition-shadow flex flex-col">
                <div className="relative h-40 overflow-hidden flex-shrink-0">
                  <Image src={cert.image} alt={cert.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${cert.demand === 'Required' ? 'bg-brand-red-600 text-white' : 'bg-green-600 text-white'}`}>
                    {cert.demand} Demand
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-900 mb-2 leading-snug">{cert.name}</h3>
                  <div className="space-y-1.5 text-xs text-slate-600 mb-3">
                    <p className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 flex-shrink-0" />{cert.industry} · {cert.body}</p>
                    <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 flex-shrink-0" />{cert.duration}</p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1 text-xs font-bold text-brand-blue-600 group-hover:text-brand-blue-800">
                    View Program <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why certifications matter */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-10 text-center">Why Certifications Matter</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {WHY.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
                <div className="flex justify-center mb-3">{item.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-8 text-center">Certification FAQ</h2>
          <div className="space-y-3">
            {[
              { q: 'Are exam fees included in the program?', a: 'Yes, for most programs. WIOA funding covers certification exam fees for eligible participants. Self-pay students may have exam fees included depending on the program.' },
              { q: 'What if I fail the certification exam?', a: 'Most programs include exam prep and practice tests. If you don\'t pass on the first attempt, we provide additional study support. Some funding covers retake fees.' },
              { q: 'How long are certifications valid?', a: 'It varies. OSHA 10 doesn\'t expire. CNA requires renewal every 2 years. NHA credentials require continuing education. We explain renewal requirements for your specific credential.' },
              { q: 'Will employers recognize these certifications?', a: 'Yes. All certifications we offer are nationally or state recognized and valued by employers. Many are legally required to work in the field.' },
              { q: 'Do I need prior experience?', a: 'No prior experience is needed for most programs. Our training prepares you from the basics through certification.' },
            ].map((faq) => (
              <details key={faq.q} className="bg-white rounded-xl border border-slate-200 group">
                <summary className="p-5 cursor-pointer font-semibold text-slate-900 flex justify-between items-center list-none">
                  {faq.q}
                  <ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-blue-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Get Certified Today</h2>
          <p className="text-white/80 mb-8 text-lg">Free with WIOA or Next Level Jobs funding for eligible Indiana residents. Apply now and start in as little as 2 weeks.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/apply" className="inline-flex items-center gap-2 bg-brand-red-600 hover:bg-brand-red-700 text-white font-bold px-8 py-4 rounded-xl transition-colors">
              Apply Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/check-eligibility" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl transition-colors">
              Check Eligibility
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
