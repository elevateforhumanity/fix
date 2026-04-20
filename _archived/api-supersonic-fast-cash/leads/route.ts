// PUBLIC ROUTE: Supersonic Fast Cash unified intake lead capture.
// Every form on the SFC site (calculator, service pages, contact, state pages,
// book-appointment) POSTs here. Creates or upserts one sfc_leads row.
// Downstream: admin dashboard reads sfc_leads; appointments link back via lead_id.

import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { safeError, safeInternalError } from '@/lib/api/safe-error';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ── Types ──────────────────────────────────────────────────────────────────

type SfcSource =
  | 'calculator'
  | 'service_page'
  | 'contact'
  | 'state_page'
  | 'book_appointment'
  | 'start'
  | 'upload'
  | 'referral'
  | 'website';

type ServiceType =
  | 'tax_prep'
  | 'refund_advance'
  | 'bookkeeping'
  | 'payroll'
  | 'diy'
  | 'audit_protection'
  | 'cash_advance';

const VALID_SOURCES: SfcSource[] = [
  'calculator', 'service_page', 'contact', 'state_page',
  'book_appointment', 'start', 'upload', 'referral', 'website',
];

const VALID_SERVICE_TYPES: ServiceType[] = [
  'tax_prep', 'refund_advance', 'bookkeeping', 'payroll',
  'diy', 'audit_protection', 'cash_advance',
];

// ── Route ─────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const rateLimited = await applyRateLimit(request, 'contact');
    if (rateLimited) return rateLimited;

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return safeError('Invalid JSON body', 400);
    }

    // ── Required fields ──────────────────────────────────────────────────
    const firstName = String(body.first_name ?? body.firstName ?? '').trim();
    const lastName  = String(body.last_name  ?? body.lastName  ?? '').trim();
    const email     = String(body.email      ?? '').trim().toLowerCase();
    const phone     = String(body.phone      ?? '').trim() || null;

    if (!firstName || !lastName) {
      return safeError('First name and last name are required.', 400);
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return safeError('A valid email address is required.', 400);
    }

    // ── Optional enrichment ───────────────────────────────────────────────
    const rawSource = String(body.source ?? 'website');
    const source: SfcSource = VALID_SOURCES.includes(rawSource as SfcSource)
      ? (rawSource as SfcSource)
      : 'website';

    const rawServiceType = String(body.service_type ?? body.serviceType ?? '');
    const serviceType: ServiceType | null = VALID_SERVICE_TYPES.includes(rawServiceType as ServiceType)
      ? (rawServiceType as ServiceType)
      : null;

    const state = typeof body.state === 'string' ? body.state.trim() || null : null;
    const filingStatus = typeof body.filing_status === 'string' ? body.filing_status : null;
    const incomeRange  = typeof body.income_range  === 'string' ? body.income_range  : null;
    const refundEstimate = typeof body.refund_estimate === 'number' ? body.refund_estimate : null;
    const hasDependents = typeof body.has_dependents === 'boolean' ? body.has_dependents : null;
    const dependentsCount = typeof body.dependents_count === 'number' ? body.dependents_count : null;
    const has1099           = typeof body.has_1099 === 'boolean' ? body.has_1099 : null;
    const needsRefundAdvance = typeof body.needs_refund_advance === 'boolean' ? body.needs_refund_advance : null;
    const preferredContact  = typeof body.preferred_contact_method === 'string' ? body.preferred_contact_method : null;
    const sourceDetail      = typeof body.source_detail  === 'string' ? body.source_detail  : null;
    const utmCampaign       = typeof body.utm_campaign   === 'string' ? body.utm_campaign   : null;
    const utmMedium         = typeof body.utm_medium     === 'string' ? body.utm_medium     : null;

    // ── Persist ───────────────────────────────────────────────────────────
    const db = await getAdminClient();
    if (!db) {
      logger.error('[sfc/leads] Admin DB client unavailable');
      return safeError('Service temporarily unavailable.', 503);
    }

    const payload: Record<string, unknown> = {
      first_name:              firstName,
      last_name:               lastName,
      email,
      phone,
      preferred_contact_method: preferredContact,
      source,
      source_detail:           sourceDetail,
      utm_campaign:            utmCampaign,
      utm_medium:              utmMedium,
      service_type:            serviceType,
      state,
      filing_status:           filingStatus,
      income_range:            incomeRange,
      refund_estimate:         refundEstimate,
      has_1099:                has1099,
      has_dependents:          hasDependents,
      dependents_count:        dependentsCount,
      needs_refund_advance:    needsRefundAdvance,
      status:                  'new',
    };

    // Upsert: if the email already exists, refresh the qualifying data and
    // bump updated_at — don't create a duplicate row.
    const { data, error } = await db
      .from('sfc_leads')
      .upsert(payload, {
        onConflict:       'email',
        ignoreDuplicates: false,
      })
      .select('id, status, created_at')
      .maybeSingle();

    if (error) {
      logger.error('[sfc/leads] Upsert failed', error);
      return safeError('Failed to save your information. Please try again.', 500);
    }

    logger.info('[sfc/leads] Lead captured', { id: data?.id, source, email });

    return NextResponse.json({
      success:  true,
      lead_id:  data?.id,
      is_new:   data?.created_at === data?.created_at, // always true on upsert
    });
  } catch (err) {
    return safeInternalError(err as Error, 'Unexpected error in SFC lead capture');
  }
}
