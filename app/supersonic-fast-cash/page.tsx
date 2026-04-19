<<<<<<< HEAD
export const dynamic = 'force-static';
export const revalidate = 86400;

import Link from 'next/link';
import { supersonicServices, supersonicConfig } from '@/content/supersonic-fast-cash';
import { buildMetadata } from '@/lib/seo';
=======
import Link from 'next/link';
import { supersonicServices, supersonicConfig } from '@/content/cf-supersonic-fast-cash';
import { buildMetadata } from '@/lib/cf-seo';
>>>>>>> preview/branch-consolidation-20260418

export const metadata = buildMetadata({
  title: 'Supersonic Fast Cash — Tax & Financial Services',
  description: supersonicConfig.description,
  path: '/supersonic-fast-cash',
});

export default function SupersonicFastCashPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold">{supersonicConfig.name}</h1>
<<<<<<< HEAD
      <p className="mt-4 text-lg text-gray-600">{supersonicConfig.description}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {supersonicServices.map((service) => (
          <article key={service.slug} className="rounded border p-6 hover:bg-gray-50">
            <h2 className="text-xl font-semibold">{service.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{service.summary}</p>
=======
      <p className="mt-4 text-lg text-slate-700">{supersonicConfig.description}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {supersonicServices.map((service) => (
          <article key={service.slug} className="rounded border p-6 hover:bg-slate-50">
            <h2 className="text-xl font-semibold">{service.title}</h2>
            <p className="mt-2 text-sm text-slate-700">{service.summary}</p>
>>>>>>> preview/branch-consolidation-20260418
            <Link
              href={`/supersonic-fast-cash/${service.slug}`}
              className="mt-4 inline-block text-sm underline"
            >
              Learn more
            </Link>
          </article>
        ))}
      </div>

<<<<<<< HEAD
      <div className="mt-10 rounded border bg-gray-50 p-6">
        <p className="font-semibold">Contact us</p>
        <p className="mt-1 text-sm text-gray-600">{supersonicConfig.phone}</p>
=======
      <div className="mt-10 rounded border bg-slate-50 p-6">
        <p className="font-semibold">Contact us</p>
        <p className="mt-1 text-sm text-slate-700">{supersonicConfig.phone}</p>
>>>>>>> preview/branch-consolidation-20260418
        <a
          href={supersonicConfig.ctaHref}
          className="mt-4 inline-block rounded bg-black px-5 py-3 text-sm text-white hover:bg-gray-800"
        >
          Book Appointment
        </a>
      </div>
    </section>
  );
}
