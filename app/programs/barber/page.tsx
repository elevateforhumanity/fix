import type { Metadata } from 'next';
import Link from 'next/link';
import { Scissors, Clock, DollarSign, Award, Calendar, ArrowRight, CheckCircle, Users } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { CredentialsOutcomes } from '@/components/programs/CredentialsOutcomes';
import PathwayDisclosure from '@/components/PathwayDisclosure';
import HeroVideo from '@/components/marketing/HeroVideo';
import heroBanners from '@/content/heroBanners';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Barber Apprenticeship Program | Earn While You Learn | Elevate for Humanity',
  description: 'Become a licensed barber through our USDOL Registered Apprenticeship. Earn $12–15/hr while training at a licensed barbershop. Indiana Barber License upon completion.',
};

const CURRICULUM = [
  { phase: 'Foundation', duration: '3 months', topics: ['Sanitation & safety', 'Tool knowledge', 'Basic cuts', 'Client consultation'] },
  { phase: 'Intermediate', duration: '6 months', topics: ['Fades & tapers', 'Beard grooming', 'Razor techniques', 'Hair textures'] },
  { phase: 'Advanced', duration: '6 months', topics: ['Creative styling', 'Color basics', 'Business skills', 'Client retention'] },
  { phase: 'Licensure', duration: '3 months', topics: ['State exam prep', 'Portfolio building', 'Shop management', 'Marketing'] },
];

const SKILLS = [
  'Clipper cuts and fades', 'Scissor cutting techniques', 'Beard trimming and shaping',
  'Hot towel shaves', 'Hair styling and finishing', 'Sanitation and safety',
  'Client consultation', 'Business management',
];

const SHOP_BENEFITS = [
  { title: 'No Cost to You', detail: 'Training costs are covered through WIOA funding and apprenticeship grants.' },
  { title: 'Develop Your Team', detail: 'Train apprentices in your shop\'s style and culture from day one.' },
  { title: 'USDOL Registered', detail: 'Our program is officially registered with the U.S. Department of Labor.' },
  { title: 'Ongoing Support', detail: 'We handle paperwork, compliance, and provide mentorship resources.' },
];

export default async function BarberProgramPage() {
  const supabase = await createClient();
  const b = heroBanners['barber-apprenticeship'];

  const { data: program } = await supabase
    .from('programs').select('id').eq('slug', 'barber').maybeSingle();

  const { data: cohorts } = program?.id ? await supabase
    .from('cohorts').select('id, start_date, seats_available')
    .eq('program_id', program.id)
    .gte('start_date', new Date().toISOString())
    .order('start_date', { ascending: true })
    .limit(3) : { data: null };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Video hero */}
      <HeroVideo
        videoSrcDesktop={b.videoSrcDesktop}
        posterImage={b.posterImage}
        voiceoverSrc={'voiceoverSrc' in b ? b.voiceoverSrc : undefined}
        microLabel={b.microLabel}
        analyticsName="barber-program"
        belowHeroHeadline={b.belowHeroHeadline}
        belowHeroSubheadline={b.belowHeroSubheadline}
        ctas={[
          { label: 'Apply Now', href: '/programs/barber-apprenticeship/apply' },
          { label: 'Check Eligibility', href: '/start', variant: 'secondary' },
        ]}
        trustIndicators={b.trustIndicators}
        transcript={b.transcript}
      />

      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <Breadcrumbs items={[
            { label: 'Programs', href: '/programs' },
            { label: 'Barber Apprenticeship' },
          ]} />
        </div>
      </div>

      <PathwayDisclosure programName="Barber" programSlug="barber" />

      {/* Stats strip */}
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '18', label: 'Months' },
              { value: '$4,980', label: 'Tuition' },
              { value: '2,000', label: 'Hours Required' },
              { value: '$60K+', label: 'Earning Potential' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-black text-slate-900">{value}</div>
                <div className="text-sm text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content + sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Left: content */}
          <div className="lg:col-span-2 space-y-14">

            {/* About */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About This Program</h2>
              <p className="text-slate-700 text-lg mb-4 leading-relaxed">
                Our Barber Apprenticeship is a USDOL Registered Apprenticeship that lets you earn while you learn.
                Work alongside licensed barbers at a partner shop, build your skills and clientele from day one,
                and graduate with your Indiana Barber License.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Unlike traditional barber school, you earn $12–15/hr during your 2,000-hour apprenticeship.
                WIOA and Workforce Ready Grant funding available for eligible participants — many pay $0 in tuition.
              </p>
            </section>

            {/* Program phases */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Program Phases</h2>
              <div className="space-y-4">
                {CURRICULUM.map(({ phase, duration, topics }, i) => (
                  <div key={phase} className="bg-white rounded-xl border border-slate-200 p-6 flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-red-600 text-white rounded-full flex items-center justify-center font-black flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-slate-900">{phase}</h3>
                        <span className="text-sm text-slate-500">{duration}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {topics.map((t) => (
                          <span key={t} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Skills You'll Learn</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {SKILLS.map((skill) => (
                  <div key={skill} className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 p-4">
                    <CheckCircle className="w-5 h-5 text-brand-green-600 flex-shrink-0" />
                    <span className="text-slate-800 text-sm font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Certification */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Certification</h2>
              <div className="bg-brand-blue-50 border-2 border-brand-blue-200 rounded-xl p-6 flex items-start gap-4">
                <Award className="w-10 h-10 text-brand-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Indiana Barber License</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Upon completing 2,000 hours and passing the Indiana State Board exam, you receive your
                    Indiana Barber License — valid statewide, for life.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right: sidebar */}
          <div className="space-y-6">

            {/* Apply CTA */}
            <div className="bg-slate-900 text-white rounded-xl p-6">
              <h3 className="font-bold text-xl mb-2">Start Your Journey</h3>
              <p className="text-slate-300 text-sm mb-5">Apply now — many students pay $0 through WIOA funding.</p>
              <Link
                href="/programs/barber-apprenticeship/apply"
                className="block w-full text-center bg-brand-red-600 hover:bg-brand-red-700 text-white py-3 rounded-lg font-bold transition-colors mb-3"
              >
                Apply Now
              </Link>
              <Link
                href="/start"
                className="block w-full text-center border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white py-3 rounded-lg font-semibold text-sm transition-colors"
              >
                Check Funding Eligibility
              </Link>
            </div>

            {/* Cohorts */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" /> Upcoming Start Dates
              </h3>
              {cohorts && cohorts.length > 0 ? (
                <div className="space-y-3">
                  {cohorts.map((c: any) => (
                    <div key={c.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="font-medium text-slate-900 text-sm">
                        {new Date(c.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-xs text-slate-500">{c.seats_available} spots</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">Rolling admissions — apply anytime</p>
              )}
            </div>

            {/* Eligibility */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Eligibility</h3>
              <ul className="space-y-2">
                {['18 years or older', 'High school diploma or GED', 'Pass background check', 'Reliable transportation'].map((req) => (
                  <li key={req} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-brand-green-600 flex-shrink-0 mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Earning potential */}
            <div className="bg-brand-green-50 border border-brand-green-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-3">Earning Potential</h3>
              <div className="space-y-2 text-sm">
                {[['Entry Level', '$30,000'], ['Experienced', '$45,000'], ['Shop Owner', '$60,000+']].map(([label, val]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-slate-600">{label}</span>
                    <span className="font-bold text-slate-900">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credentials & Outcomes */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <CredentialsOutcomes
            programName="Barber Apprenticeship"
            partnerCertifications={[
              'Indiana Barber License (issued by Indiana Professional Licensing Agency)',
              'USDOL Registered Apprenticeship Certificate of Completion',
            ]}
            employmentOutcomes={['Licensed Barber', 'Barbershop Owner/Operator', 'Master Barber', 'Barber Instructor']}
          />
        </div>
      </section>

      {/* Shop Owner — side by side */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* Left: pitch */}
            <div>
              <span className="inline-block bg-brand-blue-100 text-brand-blue-700 px-4 py-1 rounded-full text-sm font-semibold mb-4">
                For Shop Owners
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Host an Apprentice at Your Shop</h2>
              <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                Partner with Elevate to train the next generation of barbers. As a registered apprenticeship sponsor,
                you develop skilled talent while we handle compliance, paperwork, and curriculum.
              </p>
              <div className="space-y-5 mb-8">
                {SHOP_BENEFITS.map(({ title, detail }) => (
                  <div key={title} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">{title}</p>
                      <p className="text-slate-600 text-sm">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/partners/barbershop-apprenticeship"
                  className="inline-flex items-center gap-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Become a Partner Shop <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact?type=barber-shop"
                  className="inline-flex items-center gap-2 border-2 border-slate-300 hover:border-slate-400 text-slate-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Right: requirements card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Shop Requirements</h3>
              <ul className="space-y-4 mb-8">
                {[
                  'Licensed barbershop in Indiana',
                  'At least one licensed barber on staff',
                  'Willingness to mentor apprentices',
                  'Commitment to 2,000 training hours',
                  'Safe, professional work environment',
                ].map((req) => (
                  <li key={req} className="flex items-center gap-3 text-slate-700">
                    <span className="w-2 h-2 rounded-full bg-brand-red-500 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-600">
                  <strong className="text-slate-900">Questions?</strong>{' '}
                  Call us at{' '}
                  <a href="tel:+13173143757" className="text-brand-blue-600 font-semibold hover:underline">(317) 314-3757</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Become a Barber?</h2>
          <p className="text-slate-300 text-lg mb-8">
            Apply now and start earning while you train toward your Indiana Barber License.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/programs/barber-apprenticeship/apply"
              className="inline-flex items-center gap-2 bg-brand-red-600 hover:bg-brand-red-700 text-white px-8 py-4 rounded-xl font-bold transition-colors"
            >
              Apply as Apprentice <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/partners/barbershop-apprenticeship"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 px-8 py-4 rounded-xl font-bold transition-colors"
            >
              Partner as Shop Owner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
