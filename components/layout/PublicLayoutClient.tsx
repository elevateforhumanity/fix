'use client';

import { useEffect } from 'react';
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

function isAppRoute(pathname: string) {
  return APP_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );
}

export function MarketingChromeGuard() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.querySelector('[data-public-layout-root]');
    if (!root) return;

    if (isAppRoute(pathname)) {
      root.setAttribute('data-app-route', 'true');
    } else {
      root.removeAttribute('data-app-route');
    }
  }, [pathname]);

  return null;
}
