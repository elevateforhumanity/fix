<<<<<<< HEAD
export const dynamic = 'force-static';
export const revalidate = 86400;

import Link from 'next/link';
import { policies } from '@/content/policies';
import { buildMetadata } from '@/lib/seo';
=======
import Link from 'next/link';
import { policies } from '@/content/cf-policies';
import { buildMetadata } from '@/lib/cf-seo';
>>>>>>> preview/branch-consolidation-20260418

export const metadata = buildMetadata({
  title: 'Policies',
  description: 'Elevate for Humanity institutional policies covering admissions, attendance, academic integrity, privacy, and more.',
  path: '/policies',
});

export default function PoliciesPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold">Policies</h1>
<<<<<<< HEAD
      <p className="mt-4 text-gray-600">
=======
      <p className="mt-4 text-slate-700">
>>>>>>> preview/branch-consolidation-20260418
        Institutional policies governing enrollment, conduct, privacy, and program operations.
      </p>
      <ul className="mt-8 divide-y">
        {policies.map((policy) => (
          <li key={policy.slug} className="py-4">
            <Link href={`/policies/${policy.slug}`} className="font-medium hover:underline">
              {policy.title}
            </Link>
<<<<<<< HEAD
            <p className="mt-1 text-sm text-gray-600">{policy.summary}</p>
=======
            <p className="mt-1 text-sm text-slate-700">{policy.summary}</p>
>>>>>>> preview/branch-consolidation-20260418
          </li>
        ))}
      </ul>
    </section>
  );
}
