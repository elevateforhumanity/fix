export const dynamic = 'force-static';
export const revalidate = 3600;

import { redirect } from 'next/navigation';
export default function Page() {
  redirect('https://learn.elevateforhumanity.org/admin/dashboard');
}
