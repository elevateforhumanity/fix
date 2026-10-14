import type { Metadata } from 'next';
import Link from 'next/link';
import { ProgramStructuredData } from '@/components/seo/CourseStructuredData';
import ProgramDetailPage from '@/components/programs/ProgramDetailPage';
import { TAX_PREPARATION } from '@/data/programs/tax-preparation';

export const revalidate = 3600;
const p = TAX_PREPARATION;

export const metadata: Metadata = {
  title: 'FREE Tax Training May Be Available | Learn Taxes or Start a Tax Business',
  description: 'Explore two workforce training pathways: Bookkeeping & Accounting to learn tax preparation, or Business Administration to learn how to launch a tax office. WorkOne funding may cover approved tuition for eligible participants.',
  alternates: { canonical: '/programs/tax-preparation' },
};

const options = [
  {
    title: 'Learn How to Prepare Taxes',
    program: 'BOOKKEEPING',
    description: 'Complete the full Bookkeeping & Accounting program, including financial literacy and the tax preparation component delivered through Supersonic Fast Cash.',
    href: '/apply?program=bookkeeping&interest=tax-preparation',
    action: 'Apply for Bookkeeping Training',
  },
  {
    title: 'Start Your Own Tax Business',
    program: 'BUSINESS ADMINISTRATION',
    description: 'Complete the full Business Administration program and learn business planning, registration, office operations, marketing and tax-business management. Explore separate multi-office opportunities with Supersonic Fast Cash.',
    href: '/apply?program=business-administration&interest=tax-business',
    action: 'Apply for Business Training',
  },
];

export default function TaxPreparationPage() {
  return (
    <>
      <ProgramStructuredData program={{
        id: p.slug, title: p.title, description: p.metaDescription ?? p.subtitle,
        image_url: p.heroImage, duration_weeks: p.durationWeeks,
        price: p.selfPayCost ? Number(p.selfPayCost.replace(/[^\d.]/g, '')) : 0,
        category: p.category,
      }} />
      <main className="bg-white">
        <section className="bg-slate-950 text-white px-5 py-12 sm:py-16">
          <div className="max-w-6xl mx-auto">
            <p className="text-orange-300 font-bold uppercase tracking-wider mb-3">WorkOne / WIOA funding opportunities</p>
            <h1 className="text-4xl sm:text-6xl font-black leading-tight">FREE TAX &amp; BUSINESS TRAINING <span className="text-orange-300">MAY BE AVAILABLE!</span></h1>
            <p className="text-lg sm:text-xl mt-5 max-w-3xl">Want to learn to prepare taxes—or start your own tax business? Choose the full training program that matches your goal. Eligible students may receive up to 100% tuition funding through WorkOne.</p>
            <p className="text-sm text-white/80 mt-4">Free tuition is not guaranteed. Eligibility, approved curriculum, funding availability and WorkOne authorization determine coverage.</p>
            <div className="flex flex-wrap gap-3 mt-7">
              <Link href="/check-eligibility" className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold rounded-lg px-6 py-3">Check FREE Training Eligibility</Link>
              <Link href="/next-steps" className="border-2 border-white text-white font-bold rounded-lg px-6 py-3">WorkOne Appointment &amp; Orientation Steps</Link>
            </div>
          </div>
        </section>
        <section className="max-w-6xl mx-auto px-5 py-12" aria-labelledby="choose-path">
          <h2 id="choose-path" className="text-3xl font-extrabold text-slate-950">Two options. Know what to request at WorkOne.</h2>
          <p className="mt-3 text-slate-800">Tell your WorkOne advisor the official program name below and describe your training goal. Ask them to confirm the specialized component is covered under the approved 2Exclusive LLC-S program before your voucher is issued.</p>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {options.map((option) => (
              <article key={option.program} className="rounded-2xl border-2 border-slate-200 p-7 shadow-sm">
                <p className="text-red-700 font-black text-sm uppercase">Ask WorkOne for: {option.program}</p>
                <h3 className="text-2xl font-extrabold text-slate-950 mt-3">{option.title}</h3>
                <p className="text-slate-800 mt-4 leading-relaxed">{option.description}</p>
                <Link href={option.href} className="inline-block mt-6 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold px-5 py-3">{option.action}</Link>
              </article>
            ))}
          </div>
          <div className="mt-8 rounded-xl bg-blue-50 border border-blue-200 p-6 text-slate-900">
            <h3 className="font-extrabold text-xl">What happens next?</h3>
            <p className="mt-2">1. Check funding eligibility. 2. Schedule a WorkOne appointment and request Bookkeeping or Business Administration. 3. Obtain program-specific authorization. 4. Complete your full approved training curriculum. The tax preparation portion is delivered through Supersonic Fast Cash.</p>
            <p className="mt-3 text-sm">Tax business franchise or multi-office participation is a separate opportunity and is not automatically included in workforce-funded tuition.</p>
            <div className="flex flex-wrap gap-3 mt-5">
              <Link href="/check-eligibility" className="bg-blue-800 text-white font-bold rounded-lg px-5 py-3">Apply for Funding</Link>
              <Link href="/next-steps" className="border-2 border-blue-800 text-blue-900 font-bold rounded-lg px-5 py-3">Schedule Orientation / Next Steps</Link>
            </div>
          </div>
        </section>
        <section className="max-w-6xl mx-auto px-5 pb-12">
          <details className="border-t border-slate-200 pt-5">
            <summary className="cursor-pointer font-bold text-slate-900">View detailed tax preparation course information</summary>
            <div className="mt-6"><ProgramDetailPage program={p} /></div>
          </details>
        </section>
      </main>
    </>
  );
}
