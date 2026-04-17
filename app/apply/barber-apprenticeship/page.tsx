import { redirect } from 'next/navigation';

// Canonical apply URL is /apply/barber — redirect legacy path
export default function Page() {
  redirect('/apply/barber');
}
