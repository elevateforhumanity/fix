import { notFound, redirect } from 'next/navigation';

const PROGRAM_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export default async function ProgramSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!PROGRAM_SLUG_PATTERN.test(slug)) {
    notFound();
  }

  redirect(`/programs/${slug}/training`);
}
