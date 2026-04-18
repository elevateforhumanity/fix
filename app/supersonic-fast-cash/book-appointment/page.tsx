export const dynamic = 'force-static';
export const revalidate = 3600;

import Link from 'next/link';
import SupersonicPageHero from '@/components/supersonic/SupersonicPageHero';

export default function BookAppointmentPage() {
  return (
    <>
      <SupersonicPageHero
        image="/images/pages/supersonic-page-7.jpg"
        alt="Book a tax preparation appointment"
        title="Book a Tax Preparation Appointment"
        subtitle="Reserve your spot with a PTIN-certified tax preparer."
      />

      <main className="max-w-5xl mx-auto px-4 py-14 space-y-16">

        {/* Appointment types */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Choose Your Appointment Type</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                type: 'In-Person',
                location: 'Indianapolis Office',
                desc: 'Sit down with your preparer. Bring your documents and we handle everything while you wait.',
              },
              {
                type: 'Remote',
                location: 'Video Call + Secure Upload',
                desc: 'Upload your documents securely online, then connect with your preparer via video call from anywhere.',
              },
              {
                type: 'Drop-Off',
                location: 'Leave your documents with us',
                desc: 'Drop off your paperwork at our office. We\'ll prepare your return and call you to review and sign.',
              },
            ].map(({ type, location, desc }) => (
              <div key={type} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center flex flex-col gap-3">
                <h3 className="font-black text-slate-900 text-xl">{type}</h3>
                <p className="text-brand-red-600 font-semibold text-sm">{location}</p>
                <p className="text-slate-600 text-sm leading-relaxed flex-1">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What to bring */}
        <section className="bg-slate-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">What to Bring</h2>
          <ul className="space-y-3">
            {[
              'Government-issued photo ID (driver\'s license, state ID, or passport)',
              'Social Security cards for all household members being claimed',
              'All W-2, 1099, and other income statements',
              'Last year\'s tax return (if available)',
              'Bank account and routing numbers for direct deposit',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-brand-red-500 flex-shrink-0 mt-1" aria-hidden="true" />
                <span className="text-slate-600">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Tax season callout */}
        <section className="bg-brand-blue-900 text-white rounded-2xl p-8 text-center">
          <p className="text-lg font-semibold max-w-xl mx-auto">
            Appointments fill fast during January–April. Call or walk in to secure your time.
          </p>
        </section>

        {/* Large phone CTA */}
        <section className="text-center space-y-4">
          <a
            href="tel:3173143757"
            className="inline-block bg-brand-red-600 hover:bg-brand-red-700 text-white font-black text-2xl px-12 py-5 rounded-xl transition-colors"
          >
            Call (317) 314-3757
          </a>
          <p className="text-slate-500 text-sm">Walk-ins also welcome during business hours.</p>
        </section>
      </main>
    </>
  );
}
