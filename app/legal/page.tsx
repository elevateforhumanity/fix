export const dynamic = 'force-static';
export const revalidate = 86400;
import Link from 'next/link';
import { legalDocs } from '@/content/cf-legal';
import { buildMetadata } from '@/lib/cf-seo';
      <p className="mt-4 text-slate-700">
            <p className="mt-1 text-sm text-slate-700">{doc.summary}</p>

export const metadata = buildMetadata({
  title: 'Legal',
  description: 'Legal documents including privacy policy, enrollment agreement, EULA, and partner agreements for Elevate for Humanity.',
  path: '/legal',
});

export default function LegalPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold">Legal</h1>
        Legal agreements, disclosures, and documents governing use of Elevate for Humanity
        programs and platforms.
      </p>
      <ul className="mt-8 divide-y">
        {legalDocs.map((doc) => (
          <li key={doc.slug} className="py-4">
            <Link href={`/legal/${doc.slug}`} className="font-medium hover:underline">
              {doc.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
