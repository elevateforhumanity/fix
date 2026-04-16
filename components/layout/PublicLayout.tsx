// Server Component - NO 'use client'
// Layout for public marketing pages - renders header/footer server-side.
// Skips marketing chrome for authenticated app routes (/lms, /learner,
// /admin, /instructor, /employer, /partner, /staff-portal, /mentor).
//
// The server-side pathname check (via x-pathname header) handles the initial
// SSR render. The client-side MarketingChrome/MarketingMain guards handle
// client-side navigation — usePathname() is always authoritative on the client.

import { Suspense } from 'react';
import { headers } from 'next/headers';
import Header from '@/components/site/Header';
import ServerFooter from '@/components/site/ServerFooter';
import ClientWidgets from './ClientWidgets';
import { MarketingChrome, MarketingMain } from './PublicLayoutClient';

// Routes that render their own shell — marketing header/footer must not appear.
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

  // x-pathname is set by proxy.ts middleware on every request.
  // It is the most reliable source — fall back to other headers only if absent.
  const raw =
    headersList.get('x-pathname') ||
    headersList.get('x-invoke-path') ||
    headersList.get('x-forwarded-uri') ||
    headersList.get('x-url') ||
    '/';

  const pathname = extractPathname(raw);

  // Server-side fast path: skip all marketing chrome on app routes.
  // MarketingChrome/MarketingMain below handle client-side navigation correctly.
  if (isAppRoute(pathname)) {
    return <>{children}</>;
  }

  // Public marketing route — render full chrome.
  // MarketingChrome hides Header+Footer if the user navigates client-side to an
  // app route without a full page reload (e.g. clicking "Admin Dashboard" in nav).
  return (
    <>
      <MarketingChrome>
        <Header />
      </MarketingChrome>
      <Suspense>
        <MarketingMain>
          {children}
        </MarketingMain>
      </Suspense>
      <MarketingChrome>
        <ServerFooter />
      </MarketingChrome>
      <ClientWidgets />
    </>
  );
}
