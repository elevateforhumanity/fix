export const dynamic = 'force-static';
export const revalidate = 86400;
import { siteConfig } from '@/content/cf-site';
import { buildMetadata } from '@/lib/cf-seo';
      <p className="mt-4 text-lg text-slate-700">
          <p className="mt-3 text-slate-700">
          <p className="mt-3 text-slate-700">
          <p className="mt-3 text-slate-700">
          <p className="mt-3 text-slate-700">

export const metadata = buildMetadata({
  title: 'Funding & Financial Assistance',
  description: 'WIOA, Workforce Ready Grant, DOL apprenticeship funding, and payment options to cover career training costs.',
  path: '/funding',
});

export default function FundingPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold">Funding & Financial Assistance</h1>
        Multiple funding sources are available to cover tuition and fees for eligible participants.
        Most students pay little or nothing out of pocket.
      </p>

      <div className="mt-10 space-y-6">
        <div className="rounded border p-6">
          <h2 className="text-xl font-semibold">WIOA — Workforce Innovation and Opportunity Act</h2>
            Federal funding that covers tuition, fees, and support services for eligible participants.
            Available to Indiana residents who meet income and eligibility requirements.
            Contact us to determine eligibility and begin the application process.
          </p>
        </div>

        <div className="rounded border p-6">
          <h2 className="text-xl font-semibold">Indiana Workforce Ready Grant</h2>
            State grant covering tuition for eligible Indiana residents pursuing high-demand career
            training programs. Available for programs in healthcare, trades, technology, and more.
          </p>
        </div>

        <div className="rounded border p-6">
          <h2 className="text-xl font-semibold">DOL Registered Apprenticeship</h2>
            Department of Labor registered apprenticeship programs in barbering, cosmetology,
            nail technology, and culinary arts include earn-while-you-learn compensation.
            No tuition cost for apprentices.
          </p>
        </div>

        <div className="rounded border p-6">
          <h2 className="text-xl font-semibold">Buy Now, Pay Later</h2>
            Flexible payment plans available for students who do not qualify for grant funding.
            Split tuition into manageable installments with no interest for qualifying plans.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <a
          href={siteConfig.handoff.apply}
          className="rounded bg-black px-5 py-3 text-white hover:bg-gray-800"
        >
          Check Your Eligibility
        </a>
      </div>
    </section>
  );
}
