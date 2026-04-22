// Canonical review page is /admin/applications/review/[id].
// This route redirects for backward compatibility with bookmarked links.
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ApplicationDetailRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/applications/review/${id}`);
}
