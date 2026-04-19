<<<<<<< HEAD
export const dynamic = 'force-static';
export const revalidate = 86400;

import Link from 'next/link';
import { teamMembers } from '@/content/team';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Our Team',
  description: 'Meet the Elevate for Humanity team — educators, workforce specialists, and community advocates.',
  path: '/about/team',
});
=======
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { TEAM } from '@/data/team';

export const metadata: Metadata = {
  title: 'Our Team | Elevate for Humanity',
  description: 'Meet the Elevate for Humanity team — educators, workforce specialists, and community advocates.',
};
>>>>>>> preview/branch-consolidation-20260418

export default function TeamPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
<<<<<<< HEAD
      <h1 className="text-3xl font-bold">Our Team</h1>
      <p className="mt-4 text-gray-600">
        Educators, workforce specialists, and community advocates committed to learner success.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {teamMembers.map((member) => (
          <article key={member.slug} className="rounded border p-6 hover:bg-gray-50">
            <h2 className="text-xl font-semibold">{member.name}</h2>
            <p className="text-sm text-gray-500">{member.title}</p>
            <p className="mt-2 text-sm text-gray-600">{member.bio}</p>
            <Link href={`/about/team/${member.slug}`} className="mt-3 inline-block text-sm underline">
              Read more
            </Link>
=======
      <h1 className="text-3xl font-bold text-slate-900">Our Team</h1>
      <p className="mt-4 text-slate-700">
        Educators, workforce specialists, and community advocates committed to learner success.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {TEAM.map((member) => (
          <article key={member.id} className="flex gap-4 rounded border p-6 hover:bg-slate-50">
            {member.headshotSrc && (
              <Image
                src={member.headshotSrc}
                alt={member.name}
                width={72}
                height={72}
                className="rounded-full object-cover shrink-0"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{member.name}</h2>
              <p className="text-sm text-slate-500">{member.title}</p>
              <p className="mt-2 text-sm text-slate-700 line-clamp-3">{member.bio}</p>
              <Link
                href={`/about/team/${member.id}`}
                className="mt-3 inline-block text-sm font-medium text-brand-red-600 underline hover:text-brand-red-700"
              >
                Read more
              </Link>
            </div>
>>>>>>> preview/branch-consolidation-20260418
          </article>
        ))}
      </div>
    </section>
  );
}
