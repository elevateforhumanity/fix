export const dynamic = 'force-static';
export const revalidate = 86400;
import { buildMetadata } from '@/lib/cf-seo';
import { siteConfig } from '@/content/cf-site';
      <p className="mt-4 text-slate-700">
        <a href="/career-services" className="rounded border px-5 py-3 hover:bg-slate-50">All Services</a>

export const metadata = buildMetadata({
  title: 'Career Counseling',
  description: 'Elevate for Humanity career services — Career Counseling.',
  path: '/career-services/career-counseling',
});

export default function Page() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold">Career Counseling</h1>
        Available to all Elevate for Humanity program graduates. Contact us to schedule your session.
      </p>
      <div className="mt-8 flex gap-4">
        <a href={siteConfig.handoff.apply} className="rounded bg-black px-5 py-3 text-white hover:bg-gray-800">Apply Now</a>
      </div>
    </section>
  );
}
