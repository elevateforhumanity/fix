import { requireRole } from '@/lib/auth/require-role';
import { getAdminClient } from '@/lib/supabase/admin';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { FerpaDirectoryInfoClient } from './FerpaDirectoryInfoClient';

export const dynamic = 'force-dynamic';

// Directory information fields that institutions may designate as public
const DIRECTORY_FIELDS = [
  { key: 'ferpa_dir_name',           label: 'Student Name' },
  { key: 'ferpa_dir_address',        label: 'Address' },
  { key: 'ferpa_dir_phone',          label: 'Phone Number' },
  { key: 'ferpa_dir_email',          label: 'Email Address' },
  { key: 'ferpa_dir_photo',          label: 'Photograph' },
  { key: 'ferpa_dir_enrollment',     label: 'Enrollment Status' },
  { key: 'ferpa_dir_program',        label: 'Program of Study' },
  { key: 'ferpa_dir_dates',          label: 'Dates of Attendance' },
  { key: 'ferpa_dir_degrees',        label: 'Degrees & Certificates Earned' },
  { key: 'ferpa_dir_honors',         label: 'Honors & Awards' },
];

export default async function FerpaDirectoryInfoPage() {
  await requireRole(['admin', 'super_admin']);
  const db = await getAdminClient();

  // Read current directory info settings from platform_settings
  const { data: rows } = await db
    .from('platform_settings')
    .select('key, value')
    .in('key', DIRECTORY_FIELDS.map((f) => f.key));

  const settings: Record<string, string> = {};
  for (const row of rows ?? []) {
    settings[row.key] = row.value ?? 'false';
  }

  const fields = DIRECTORY_FIELDS.map((f) => ({
    ...f,
    enabled: settings[f.key] === 'true',
  }));

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Breadcrumbs
          items={[
            { label: 'Admin', href: '/admin' },
            { label: 'FERPA', href: '/admin/ferpa' },
            { label: 'Directory Information' },
          ]}
        />

        <div className="mt-6 mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Directory Information</h1>
          <p className="text-slate-600 mt-1">
            Configure which student data fields are designated as directory information
            and may be disclosed without prior consent under FERPA.
          </p>
        </div>

        <FerpaDirectoryInfoClient fields={fields} />
      </div>
    </div>
  );
}
