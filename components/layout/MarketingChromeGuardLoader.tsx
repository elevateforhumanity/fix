'use client';

import dynamic from 'next/dynamic';

const MarketingChromeGuard = dynamic(() => import('./MarketingChromeGuard'), { ssr: false });

export default function MarketingChromeGuardLoader() {
  return <MarketingChromeGuard />;
}
