<<<<<<< HEAD
export const dynamic = 'force-static';
export const revalidate = 86400;

import { notFound } from 'next/navigation';
import { policies } from '@/content/policies';
import { findBySlug, staticParamsFromSlugs } from '@/lib/content-helpers';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/content/site';
=======
import { notFound } from 'next/navigation';
import { policies } from '@/content/cf-policies';
import { findBySlug, staticParamsFromSlugs } from '@/lib/cf-content-helpers';
import { buildMetadata } from '@/lib/cf-seo';
import { siteConfig } from '@/content/cf-site';
>>>>>>> preview/branch-consolidation-20260418

export function generateStaticParams() {
  return staticParamsFromSlugs(policies);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = findBySlug(policies, slug);
  if (!policy) return {};
  return buildMetadata({
    title: policy.title,
    description: policy.summary,
    path: `/policies/${slug}`,
  });
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = findBySlug(policies, slug);
  if (!policy) return notFound();

  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold">{policy.title}</h1>
<<<<<<< HEAD
      <p className="mt-4 text-gray-600">{policy.summary}</p>

      <div className="mt-8 rounded border bg-gray-50 p-6">
        <p className="text-sm text-gray-600">
=======
      <p className="mt-4 text-slate-700">{policy.summary}</p>

      <div className="mt-8 rounded border bg-slate-50 p-6">
        <p className="text-sm text-slate-700">
>>>>>>> preview/branch-consolidation-20260418
          For the full text of this policy, contact us at{' '}
          <a href={`mailto:${siteConfig.email}`} className="underline">
            {siteConfig.email}
          </a>{' '}
          or call{' '}
          <a href={`tel:${siteConfig.phone}`} className="underline">
            {siteConfig.phone}
          </a>.
        </p>
      </div>
    </section>
  );
}
