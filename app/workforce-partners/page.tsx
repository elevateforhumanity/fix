<<<<<<< HEAD
export const dynamic = 'force-static';
export const revalidate = 86400;

import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/content/site';
=======
import { buildMetadata } from '@/lib/cf-seo';
import { siteConfig } from '@/content/cf-site';
>>>>>>> preview/branch-consolidation-20260418

export const metadata = buildMetadata({
  title: 'Workforce Partners',
  description: 'Employer and workforce board partners who connect learners to jobs and funding.',
  path: '/workforce-partners',
});

export default function Page() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold">Workforce Partners</h1>
<<<<<<< HEAD
      <p className="mt-4 text-gray-600">Employer and workforce board partners who connect learners to jobs and funding.</p>
=======
      <p className="mt-4 text-slate-700">Employer and workforce board partners who connect learners to jobs and funding.</p>
>>>>>>> preview/branch-consolidation-20260418
      <div className="mt-8 flex gap-4">
        <a href="mailto:partnerships@elevateforhumanity.org" className="rounded bg-black px-5 py-3 text-white hover:bg-gray-800">
          Get in Touch
        </a>
<<<<<<< HEAD
        <a href={siteConfig.handoff.apply} className="rounded border px-5 py-3 hover:bg-gray-50">
=======
        <a href={siteConfig.handoff.apply} className="rounded border px-5 py-3 hover:bg-slate-50">
>>>>>>> preview/branch-consolidation-20260418
          Apply Now
        </a>
      </div>
    </section>
  );
}
