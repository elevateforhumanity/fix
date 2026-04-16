'use client';

// Client guard for PublicLayout.
// Reads the actual client-side pathname via usePathname() — this is always
// correct regardless of what headers() returned on the server.
// Hides marketing chrome (Header + Footer) on authenticated app routes.

import { usePathname } from 'next/navigation';

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

interface Props {
  children: React.ReactNode;
}

// Wraps the marketing chrome — hidden on app routes.
export function MarketingChrome({ children }: Props) {
  const pathname = usePathname();
  if (isAppRoute(pathname)) return null;
  return <>{children}</>;
}

// Wraps the main content — removes pt-[70px] offset on app routes (they have their own shell).
export function MarketingMain({ children }: Props) {
  const pathname = usePathname();
  if (isAppRoute(pathname)) return <>{children}</>;
  return (
    <main id="main-content" className="pt-[70px] overflow-x-hidden" role="main" tabIndex={-1}>
      {children}
    </main>
  );
}
