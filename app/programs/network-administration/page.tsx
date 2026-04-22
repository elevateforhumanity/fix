
export const revalidate = 86400;

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, DollarSign, Award, CheckCircle, Users, Server, TrendingUp, Database , ArrowRight, Phone } from 'lucide-react';
import { CredentialsOutcomes } from '@/components/programs/CredentialsOutcomes';
import PathwayDisclosure from '@/components/PathwayDisclosure';
import PageAvatar from '@/components/PageAvatar';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import HeroVideo from '@/components/marketing/HeroVideo';
import heroBanners from '@/content/heroBanners';
import { ProgramStructuredData } from '@/components/seo/CourseStructuredData';

const SITE_URL = 'https://www.elevateforhumanity.org';

export const metadata: Metadata = {
  title: 'Network & Systems Administration | Certiport IT Specialist | Indianapolis',
  description: 'Earn the Certiport IT Specialist — Databases certification. 12-week program. WorkOne-eligible 4-star Top Job. Network and systems administrators in Indiana.',
  keywords: 'network administration training, database certification, IT Specialist databases, systems administrator training Indianapolis, WorkOne funded',
  alternates: { canonical: `${SITE_URL}/programs/network-administration` },
};

export default function Page() {
  return (
    <>
    <ProgramStructuredData program={{
      id: 'network-administration',
      name: 'Network & Systems Administration — IT Specialist Certification',
      slug: 'network-administration',
      description: 'Earn the Certiport IT Specialist — Databases certification. 12-week program covering SQL, server administration, and enterprise systems.',
      duration_weeks: 12,
      price: 4950,
      image_url: `${SITE_URL}/images/pages/tech-classroom.jpg`,
      category: 'Technology',
      outcomes: ['IT Specialist — Databases (Certiport)', 'Certificate of Completion'],
    }} />
    <div className="min-h-screen bg-white">
      
      <Breadcrumbs items={[{ label: 'Programs', href: '/programs' }, { label: 'Technology', href: '/programs/technology' }, { label: 'Network & Systems Administration' }]} />
      <HeroVideo
        videoSrcDesktop={heroBanners['network-administration'].videoSrcDesktop}
        posterImage={heroBanners['network-administration'].posterImage}
        voiceoverSrc={heroBanners['network-administration'].voiceoverSrc}
        microLabel={heroBanners['network-administration'].microLabel}
        belowHeroHeadline={heroBanners['network-administration'].belowHeroHeadline}
        belowHeroSubheadline={heroBanners['network-administration'].belowHeroSubheadline}
        ctas={[heroBanners['network-administration'].primaryCta, ...(heroBanners['network-administration'].secondaryCta ? [heroBanners['network-administration'].secondaryCta] : [])]}
        trustIndicators={heroBanners['network-administration'].trustIndicators}
        transcript={heroBanners['network-administration'].transcript}
        analyticsName={heroBanners['network-administration'].analyticsName}
      />

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Systems Administration?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: TrendingUp, title: '4-Star Top Job', desc: 'High-demand IT infrastructure role' },
              { icon: DollarSign, title: '$75K+ Avg Salary', desc: 'Indiana average for sysadmins' },
              { icon: Database, title: 'Data Is Everything', desc: 'Every company runs on databases' },
              { icon: Award, title: 'Industry Certification', desc: 'IT Specialist — Databases' },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-16 h-16 bg-brand-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><item.icon className="w-6 h-6 text-brand-blue-600" /></div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3><p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">How to Enroll</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: 1, title: 'Apply Online', desc: 'Complete our simple application' },
              { num: 2, title: 'Register at Indiana Career Connect', desc: 'Verify WIOA funding eligibility' },
              { num: 3, title: 'Orientation', desc: 'Attend program orientation' },
              { num: 4, title: 'Start Training', desc: 'Begin your sysadmin career' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-brand-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to Run the Systems?</h2>
          <p className="text-xl text-slate-300 mb-8">12 weeks. Certiport certified. WorkOne funding available.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/apply?program=network-administration" className="inline-flex items-center gap-2 bg-brand-red-600 hover:bg-brand-red-700 text-white px-10 py-5 rounded-full font-bold text-lg transition-all hover:scale-105">
              Apply Now <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="/support" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-10 py-5 rounded-full font-bold text-lg transition-all border border-white/30">
              <Phone className="w-5 h-5" /> Get Help Online
            </a>
          </div>
          <p className="mt-6 text-slate-400">Call <a href="tel:3173143757" className="font-bold underline text-white">317-314-3757</a></p>
        </div>
      </section>
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Program Details</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-xl p-6 text-center"><Clock className="w-8 h-8 text-brand-blue-600 mx-auto mb-3" /><h3 className="font-bold text-lg mb-1">Duration</h3><p className="text-slate-600">12 weeks</p></div>
            <div className="bg-slate-50 rounded-xl p-6 text-center"><DollarSign className="w-8 h-8 text-brand-green-600 mx-auto mb-3" /><h3 className="font-bold text-lg mb-1">Tuition</h3><p className="text-slate-600">$4,950 (WorkOne funding available)</p></div>
            <div className="bg-slate-50 rounded-xl p-6 text-center"><Users className="w-8 h-8 text-purple-600 mx-auto mb-3" /><h3 className="font-bold text-lg mb-1">Format</h3><p className="text-slate-600">In-person at Indianapolis Training Center</p></div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <CredentialsOutcomes programName="Network & Systems Administration" partnerCertifications={['IT Specialist — Databases (issued by Certiport)', 'Certificate of Completion (issued by Elevate for Humanity)']} employmentOutcomes={['Network/Computer Systems Administrator (SOC 15-1244)', 'Database Administrator', 'Systems Administrator', 'IT Infrastructure Specialist']} />
        </div>
      </section>
    </div>
    </>
  );
}
