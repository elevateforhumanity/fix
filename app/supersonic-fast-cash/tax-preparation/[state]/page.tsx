import Link from 'next/link';
import SupersonicPageHero from '@/components/supersonic/SupersonicPageHero';

const services = [
  { label: 'W-2 & 1099 Filing', desc: 'Accurate preparation for employees and independent contractors.' },
  { label: 'Self-Employed & Schedule C', desc: 'Business income, deductions, and quarterly estimates.' },
  { label: 'EITC & Child Tax Credit', desc: 'We maximize every credit you are entitled to.' },
  { label: 'State Returns', desc: 'We handle both federal and state returns in every state we serve.' },
  { label: 'Amended Returns', desc: 'Corrections to prior-year federal or state returns.' },
  { label: 'Audit Protection', desc: 'One full year of IRS correspondence support included with every filing.' },
];

export default async function TaxPreparationStatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const displayState = state
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <>
      <SupersonicPageHero
        image="/images/pages/supersonic-tax-prep.jpg"
        alt={`Tax preparation services in ${displayState}`}
        title="Tax Preparation Services"
        subtitle="PTIN-certified preparers. In-person and remote. Refund advance available."
      />

      <main className="max-w-5xl mx-auto px-4 py-14 space-y-16">

        {/* State callout */}
        <section className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Serving Clients{displayState ? ` in ${displayState}` : ' Nationwide'}
          </h2>
          <p className="text-slate-600 leading-relaxed">
            Supersonic Fast Cash provides professional tax preparation services for individuals and small
            businesses{displayState ? ` across ${displayState}` : ''}. File in person at our Indianapolis
            home office or securely upload your documents and file remotely — wherever you are.
          </p>
        </section>

        {/* Why choose us */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Why Choose Supersonic Fast Cash</h2>
          <ul className="space-y-4">
            {[
              'PTIN-certified preparers — your return is signed by a credentialed professional',
              'Remote filing available — upload your documents and file from anywhere',
              'Same-day refund advance up to $7,500 — zero interest, zero fees',
              'Authorized IRS e-file provider — your return is transmitted securely and directly',
              'Flat-rate transparent pricing — no surprises at the end of your appointment',
            ].map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-brand-red-500 flex-shrink-0 mt-1" aria-hidden="true" />
                <span className="text-slate-600">{b}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Services */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Services Available</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {services.map(({ label, desc }) => (
              <div key={label} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-2">{label}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-blue-900 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-black text-white mb-3">Ready to Get Started?</h2>
          <p className="text-blue-200 mb-8">File with a PTIN-credentialed preparer and get your refund fast.</p>
          <Link
            href="/supersonic-fast-cash/start"
            className="inline-block bg-brand-red-600 hover:bg-brand-red-700 text-white font-bold px-10 py-4 rounded-xl transition-colors"
          >
            Start My Return
          </Link>
        </section>

      </main>
    </>
  );
}
