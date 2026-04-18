// PUBLIC ROUTE: public-facing refund calculator — no auth required
import { NextRequest, NextResponse } from 'next/server';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { calculateForm1040 } from '@/lib/tax-software/forms/form-1040';
import type { TaxReturn } from '@/lib/tax-software/types';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const rateLimited = await applyRateLimit(request, 'public');
    if (rateLimited) return rateLimited;

    const body = await request.json();

    // Normalise filing status — the calculator sends short aliases like
    // "married_joint"; the engine expects the full canonical key.
    const STATUS_MAP: Record<string, TaxReturn['filingStatus']> = {
      single: 'single',
      married_joint: 'married_filing_jointly',
      married_filing_jointly: 'married_filing_jointly',
      married_separate: 'married_filing_separately',
      married_filing_separately: 'married_filing_separately',
      head_of_household: 'head_of_household',
      head: 'head_of_household',
      qualifying_widow: 'qualifying_surviving_spouse',
      qualifying_surviving_spouse: 'qualifying_surviving_spouse',
    };

    const filingStatus: TaxReturn['filingStatus'] =
      STATUS_MAP[body.filingStatus] ?? 'single';

    const taxReturn: TaxReturn = {
      taxYear: body.taxYear || 2024,
      efin: process.env.IRS_EFIN || '000000',
      returnId: `CALC${Date.now()}`,
      filingStatus,
      taxpayer: body.taxpayer || {
        firstName: '',
        lastName: '',
        ssn: '',
        dateOfBirth: '',
      },
      address: body.address || { street: '', city: '', state: '', zip: '' },
      dependents: body.dependents || [],
      w2Income: (body.w2Income || []).map((w2: any) => ({
        employerEIN: w2.employerEIN || '',
        employerName: w2.employerName || w2.employer || '',
        employerAddress: w2.employerAddress || { street: '', city: '', state: '', zip: '' },
        wages: Number(w2.wages) || 0,
        federalWithholding: Number(w2.federalWithholding) || 0,
        stateWithholding: Number(w2.stateWithholding) || 0,
        socialSecurityWages: Number(w2.wages) || 0,
        socialSecurityWithholding: 0,
        medicareWages: Number(w2.wages) || 0,
        medicareWithholding: 0,
      })),
      deductionType: body.deductionType || 'standard',
      itemizedDeductions: body.itemizedDeductions,
      totalIncome: 0,
      adjustedGrossIncome: 0,
      taxableIncome: 0,
      taxBeforeCredits: 0,
      credits: {
        childTaxCredit: 0,
        creditForOtherDependents: 0,
        earnedIncomeCredit: 0,
        additionalChildTaxCredit: 0,
      },
      totalCredits: 0,
      federalWithholding: 0,
      totalTax: 0,
      totalPayments: 0,
    };

    const result = calculateForm1040(taxReturn);

    return NextResponse.json({
      success: true,
      estimatedRefund: result.line35,
      refundAmount: result.line35 > 0 ? result.line35 : -result.line37,
      totalIncome: result.line9,
      adjustedGrossIncome: result.line11,
      taxableIncome: result.line15,
      federalTax: result.line16,
      totalCredits: result.line22,
      totalTax: result.line25,
      federalWithholding: result.line26,
      eitc: result.line28,
      childTaxCredit: result.line19,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to calculate tax' },
      { status: 500 }
    );
  }
}
