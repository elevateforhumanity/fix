// PUBLIC ROUTE: Public chatbot lead capture
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/sendgrid';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { safeError, safeInternalError } from '@/lib/api/safe-error';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';



// Internal notification email address
const INTERNAL_EMAIL = process.env.LEAD_NOTIFICATION_EMAIL || 'elevate4humanityedu@gmail.com';

interface LeadData {
  // Contact info
  name?: string;
  email?: string;
  organization?: string;
  
  // Intake responses
  orgType?: string;
  learnerVolume?: string;
  compliance?: string[];
  primaryGoal?: string;
  timeline?: string;
  budget?: string;
  decisionAuthority?: string;
  
  // Classification
  buyerType?: 'buyer' | 'learner' | 'partner' | 'other';
  buyerScore?: 'high' | 'medium' | 'low';
  
  // Metadata
  source?: string;
  conversationId?: string;
  notes?: string;
}

function calculateBuyerScore(data: LeadData): 'high' | 'medium' | 'low' {
  let score = 0;
  
  // Budget scoring
  if (data.budget?.includes('Over $150,000')) score += 3;
  else if (data.budget?.includes('$50,000-$150,000')) score += 2;
  else if (data.budget?.includes('$10,000-$50,000')) score += 1;
  
  // Timeline scoring
  if (data.timeline?.includes('Immediate')) score += 3;
  else if (data.timeline?.includes('Soon')) score += 2;
  else if (data.timeline?.includes('Planning')) score += 1;
  
  // Decision authority scoring
  if (data.decisionAuthority?.includes('I can decide')) score += 2;
  else if (data.decisionAuthority?.includes('Department head')) score += 1;
  
  // Learner volume scoring
  if (data.learnerVolume?.includes('Over 10,000')) score += 2;
  else if (data.learnerVolume?.includes('2,000-10,000')) score += 2;
  else if (data.learnerVolume?.includes('500-2,000')) score += 1;
  
  if (score >= 7) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
}

function generateBuyerSummary(data: LeadData): string {
  const buyerScore = calculateBuyerScore(data);
  const budgetQualified = data.budget && !data.budget.includes('Under $10,000') && !data.budget.includes('Not yet determined');
  const timelineQualified = data.timeline && !data.timeline.includes('Exploring');
  const authorityQualified = data.decisionAuthority && !data.decisionAuthority.includes('Procurement');
  
  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI BUYER SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Organization: ${data.organization || 'Not provided'}
Contact: ${data.name || 'Not provided'}
Email: ${data.email || 'Not provided'}
Type: ${data.orgType || 'Not specified'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTAKE RESPONSES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Learner Volume: ${data.learnerVolume || 'Not specified'}
Compliance Needs: ${data.compliance?.join(', ') || 'Not specified'}
Primary Goal: ${data.primaryGoal || 'Not specified'}
Timeline: ${data.timeline || 'Not specified'}
Budget Range: ${data.budget || 'Not specified'}
Decision Authority: ${data.decisionAuthority || 'Not specified'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
QUALIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Budget: ${budgetQualified ? '✓ Yes ($10K+ threshold)' : '✗ No (below threshold)'}
Timeline: ${timelineQualified ? '✓ Yes (90 days threshold)' : '✗ No (exploring only)'}
Authority: ${authorityQualified ? '✓ Yes (can influence decision)' : '✗ No (procurement required)'}

BUYER SCORE: ${buyerScore.toUpperCase()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${data.notes || 'No additional notes'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RECOMMENDED NEXT STEP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${buyerScore === 'high' ? '→ Schedule scope confirmation call immediately' : 
  buyerScore === 'medium' ? '→ Send relevant documents, follow up in 48 hours' : 
  '→ Add to nurture sequence, check back in 30 days'}

Source: ${data.source || 'Tidio Chat'}
Conversation ID: ${data.conversationId || 'N/A'}
Timestamp: ${new Date().toISOString()}
`.trim();
}

export async function POST(request: NextRequest) {
  try {
    const rateLimited = await applyRateLimit(request, 'strict');
    if (rateLimited) return rateLimited;

    const data: LeadData = await request.json();
    
    // Validate required fields
    if (!data.organization && !data.name && !data.email) {
      return safeError('At least one contact field is required', 400);
    }
    
    // Calculate buyer score
    const buyerScore = calculateBuyerScore(data);
    
    // Generate summary
    const summary = generateBuyerSummary({ ...data, buyerScore });
    
    // Send internal notification email
    try {
      await sendEmail({
        to: INTERNAL_EMAIL,
        subject: `AI Buyer Summary — ${data.organization || data.name || 'Unknown'}`,
        text: summary,
      });
    } catch (emailError) {
      logger.error('[Chatbot Lead] Failed to send email:', emailError);
      // Don't fail the request if email fails
    }
    
    // Log the lead (could also save to database here)
    logger.info('[Chatbot Lead] New lead captured:', {
      organization: data.organization,
      buyerScore,
      timestamp: new Date().toISOString(),
    });
    
    return NextResponse.json({
      success: true,
      buyerScore,
      message: 'Lead captured successfully',
    });
    
  } catch (error) {
    return safeInternalError(error as Error, 'Failed to process lead');
  }
}
