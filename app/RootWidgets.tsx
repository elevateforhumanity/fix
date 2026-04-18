'use client';

import dynamicImport from 'next/dynamic';

const GlobalAvatar = dynamicImport(() => import('@/components/GlobalAvatar'), {
  ssr: false,
  loading: () => null,
});

const FacebookPixel = dynamicImport(() => import('@/components/FacebookPixel'), {
  ssr: false,
  loading: () => null,
});

const ConditionalAIBubble = dynamicImport(() => import('@/components/ConditionalAIBubble'), {
  ssr: false,
  loading: () => null,
});

const ServiceWorkerRegistration = dynamicImport(
  () => import('@/components/pwa/ServiceWorkerRegistration').then((m) => ({ default: m.ServiceWorkerRegistration })),
  { ssr: false, loading: () => null }
);

// Deferred — cookie banner shows after 1s delay anyway, no reason to block
// the critical bundle. Moved here from app/layout.tsx synchronous import.
const CookieConsent = dynamicImport(() => import('@/components/CookieConsent'), {
  ssr: false,
  loading: () => null,
});

export default function RootWidgets() {
  return (
    <>
      <GlobalAvatar />
      <FacebookPixel />
      <ConditionalAIBubble />
      <ServiceWorkerRegistration />
      <CookieConsent />
    </>
  );
}
