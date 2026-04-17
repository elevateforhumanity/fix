// Server Component — no 'use client'
// Minimal admin portal footer. No public marketing links.

import Link from 'next/link';
import Copyright from '@/components/ui/Copyright';

export default function AdminPortalFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <Copyright entity="2Exclusive LLC-S d/b/a Elevate for Humanity" />

        <div className="flex items-center gap-4">
          <Link href="/admin/settings" className="hover:text-slate-700 transition-colors">
            Settings
          </Link>
          <Link href="/admin/audit-logs" className="hover:text-slate-700 transition-colors">
            Audit Logs
          </Link>
          <Link href="/admin/system-health" className="hover:text-slate-700 transition-colors">
            System Health
          </Link>
          <a
            href="https://www.elevateforhumanity.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-700 transition-colors"
          >
            Public Site ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
