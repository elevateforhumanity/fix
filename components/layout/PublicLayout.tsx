// Server Component - NO 'use client'
// Layout for public marketing pages.
//
// Two-layer guard:
//   1. Server: x-pathname header check — skips chrome on direct load of app routes.
//   2. Client: MarketingChromeGuard toggles data-app-route on the root div,
//              CSS handles hide/show. No conditional rendering, no DOM removal.

import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import Header from '@/components/site/Header';
import ServerFooter from '@/components/site/ServerFooter';
import ClientWidgets from './ClientWidgets';

const MarketingChromeGuard = dynamic(() => import('./MarketingChromeGuard'), { ssr: false });

const APP_ROUTE_PREFIXES = [
  '/lms',
  '/learner',
  '/admin',
  '/instructor',
  '/employer',
  '/partner',
  '/staff-portal',
  '/mentor',
  '/program-holder',
];

function isAppRoute(pathname: string): boolean {
  return APP_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );
}

function extractPathname(value: string): string {
  try {
    if (value.startsWith('http')) return new URL(value).pathname;
    if (value.startsWith('/')) return value.split('?')[0];
  } catch { /* ignore */ }
  return '';
}

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const headersList = await headers();

  const raw =
    headersList.get('x-pathname') ||
    headersList.get('x-invoke-path') ||
    headersList.get('x-forwarded-uri') ||
    headersList.get('x-url') ||
    '/';

  const pathname = extractPathname(raw);

  // Server fast path: app routes render no marketing chrome at all.
  if (isAppRoute(pathname)) {
    return <>{children}</>;
  }

  // Public route: render full chrome. MarketingChromeGuard handles client-side
  // navigation to app routes by toggling data-app-route on the root div.
  // CSS (globals.css) hides [data-marketing-chrome] and resets padding when
  // data-app-route="true" — no DOM removal, no reconciliation errors.
  return (
    <>
      <div data-public-layout-root>
        <div data-marketing-chrome>
          <Header />
        </div>

        <div data-main-shell>
          <main
            id="main-content"
            className="overflow-x-hidden"
            data-marketing-main
            role="main"
            tabIndex={-1}
          >
            {children}
          </main>
        </div>

        <div data-marketing-chrome>
          <ServerFooter />
        </div>

        <ClientWidgets />
      </div>

      <MarketingChromeGuard />
    </>
  );
}
