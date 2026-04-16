'use client';

import { useEffect } from 'react';

// Injected at build time — unique per deploy, no manual bumping needed.
const DEPLOY_VERSION = process.env.NEXT_PUBLIC_BUILD_ID ?? 'dev';

export default function PWAManager() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    // On first load after a new deploy, clear all old caches so users
    // never see stale content. The SW itself handles cache versioning,
    // but this client-side check catches edge cases where the SW hasn't
    // activated yet (e.g. first visit after a hard refresh).
    const lastDeploy = localStorage.getItem('elevate-deploy-version');
    if (lastDeploy !== DEPLOY_VERSION) {
      // New deploy — wipe ALL caches so users get fresh assets immediately.
      if ('caches' in window) {
        caches.keys()
          .then(keys => Promise.all(keys.map(k => caches.delete(k))))
          .catch(() => {});
      }
      localStorage.setItem('elevate-deploy-version', DEPLOY_VERSION);
    }

    // Register the service worker
    navigator.serviceWorker
      .register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .then(reg => {
        // Check for updates every 60 minutes
        setInterval(() => reg.update(), 60 * 60 * 1000);

        // When a new SW is waiting, activate it immediately
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New SW ready — skip waiting and reload to get fresh content
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
      })
      .catch(() => {
        // SW registration failed — site still works, just no offline support
      });

    // When a new SW takes control, reload once to pick up fresh assets.
    // Guard with sessionStorage so a reload triggered by SW activation
    // doesn't immediately trigger another reload on the next page load.
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      const key = 'elevate-sw-reload';
      if (sessionStorage.getItem(key)) {
        sessionStorage.removeItem(key);
        return;
      }
      sessionStorage.setItem(key, '1');
      window.location.reload();
    });
  }, []);

  return null;
}
