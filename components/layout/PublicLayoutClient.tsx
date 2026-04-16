'use client';

// Hides marketing chrome on app routes during client-side navigation.
// Uses CSS visibility (not conditional rendering) to avoid DOM reconciliation
// errors — the nodes stay mounted, they are just hidden.

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

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

// Applies/removes a CSS class on the marketing chrome wrapper elements.
// The class is defined in globals.css: .marketing-chrome-hidden { display: none !important; }
export function MarketingChromeGuard() {
  const pathname = usePathname();

  useEffect(() => {
    const els = document.querySelectorAll('[data-marketing-chrome]');
    const hide = isAppRoute(pathname);
    els.forEach(el => {
      if (hide) {
        el.classList.add('marketing-chrome-hidden');
      } else {
        el.classList.remove('marketing-chrome-hidden');
      }
    });

    // Also fix the main content padding — app routes manage their own top offset
    const main = document.getElementById('main-content');
    if (main) {
      if (hide) {
        main.classList.remove('pt-\\[70px\\]');
        main.style.paddingTop = '0';
      } else {
        main.style.paddingTop = '';
      }
    }
  }, [pathname]);

  return null;
}
