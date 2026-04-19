import 'server-only';
// Never initialize at module load — STRIPE_SECRET_KEY lives in app_secrets
// and is only available after hydrateProcessEnv() runs at request time.
// Callers must use getStripe() after hydrating secrets.

type StripeInstance = import('stripe').default;

let _StripeClass: typeof import('stripe').default | null = null;

/**
 * Returns a fresh Stripe client using the current process.env value.
 * Always call after hydrateProcessEnv() so the key is populated.
 * Returns null if the key is still missing (misconfiguration).
 *
 * Stripe SDK is require()'d lazily on first call so it is not traced into
 * routes that never invoke this function.
 */
export function getStripe(): StripeInstance | null {
  const key = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_RESTRICTED_KEY;
  if (!key) return null;
  if (!_StripeClass) {
    _StripeClass = require('stripe').default ?? require('stripe');
  }
  return new _StripeClass!(key, {
    apiVersion: '2025-10-29.clover' as any,
    typescript: true,
  });
}

// Module-level export for callers that import `stripe` directly.
// Resolves at import time using whatever key is in process.env at that moment.
// Always null-check before use — key may be absent at build time.
export const stripe: Stripe | null = getStripe();
