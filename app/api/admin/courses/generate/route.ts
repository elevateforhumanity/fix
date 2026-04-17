/**
 * POST /api/admin/courses/generate
 *
 * Accepts { raw_text, input_type } and calls OpenAI to produce a
 * structured course draft. Returns the draft — does NOT write to DB.
 * Writing happens at /generate/publish after human review.
 */

import { NextRequest, NextResponse } from 'next/server';
import { withApiAudit } from '@/lib/audit/withApiAudit';
import { apiRequireAdmin } from '@/lib/admin/guards';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { safeError, safeInternalError } from '@/lib/api/safe-error';
import { logger } from '@/lib/logger';
import OpenAI from 'openai';

import { withRuntime } from '@/lib/api/withRuntime';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

export interface GeneratedQuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

export interface GeneratedLesson {
  lesson_number: number;
  title: string;
  description: string;
  objectives: string[];
  content: string;
  content_type: 'video' | 'reading' | 'quiz' | 'assignment';
  duration_minutes: number;
  is_required: boolean;
  quiz_questions: GeneratedQuizQuestion[];
  /** 1–3 sentence learner-facing summary for preview and audit scoring */
  summary_text?: string;
  /** Open-ended reflection question at end of lesson */
  reflection_prompt?: string;
  /** Competency keys this lesson covers. Max 3. */
  competency_keys?: string[];
}

export interface GeneratedModule {
  title: string;
  sort_order: number;
  lessons: GeneratedLesson[];
}

export interface GeneratedCourse {
  title: string;
  subtitle: string;
  description: string;
  audience: string;
  duration_hours: number;
  category: string;
  passing_score: number;
  completion_rule: 'all_lessons' | 'required_lessons';
  modules: GeneratedModule[];
}

const SYSTEM_PROMPT = `You are a professional instructional designer for a workforce development LMS.
Given a syllabus, training script, or topic description, produce a complete course structure.

Return ONLY valid JSON — no markdown, no explanation:

{
  "title": "string",
  "subtitle": "string — one sentence",
  "description": "string — 2-3 sentences learner-facing",
  "audience": "string — who this is for",
  "duration_hours": number,
  "category": "healthcare|trades|technology|business|transportation|personal-services|tax",
  "passing_score": number 70-90,
  "completion_rule": "all_lessons",
  "modules": [
    {
      "title": "string",
      "sort_order": 0,
      "lessons": [
        {
          "lesson_number": 1,
          "title": "string",
          "description": "string — one sentence",
          "objectives": ["string"],
          "content": "string — 200-500 words of real instructional content",
          "summary_text": "string — 1-3 sentences: what the learner will be able to do after this lesson",
          "reflection_prompt": "string — one open-ended question for learner reflection",
          "competency_keys": ["string — 1-3 kebab-case keys naming the specific competency taught, e.g. peer-support-boundaries"],
          "content_type": "video|reading|quiz|assignment",
          "duration_minutes": number,
          "is_required": true,
          "quiz_questions": [
            {
              "question": "string",
              "options": ["A","B","C","D"],
              "correct_index": 0,
              "explanation": "string"
            }
          ]
        }
      ]
    }
  ]
}

Rules:
- 3-6 modules, 2-5 lessons per module
- Every lesson: minimum 2 quiz questions. Quiz-type lessons: 5+ questions
- content must be real instructional text, not placeholder
- lesson_number sequential across ALL modules starting at 1
- duration_minutes realistic: reading 5-15, video 5-20, quiz 10-30`;

async function _POST(req: NextRequest) {
  // AI generation is expensive — strict tier (3 req / 5 min per admin)
  const rateLimited = await applyRateLimit(req, 'strict');
  if (rateLimited) return rateLimited;

  const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;

  try {
    if (!process.env.OPENAI_API_KEY) {
      return safeError('OPENAI_API_KEY is not configured. Add it to Netlify environment variables.', 503);
    }

    const body = await req.json();
    const { raw_text, input_type } = body as { raw_text: string; input_type: string };
    if (!raw_text?.trim()) {
      return safeError('raw_text is required', 400);
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Input type: ${input_type || 'syllabus'}\n\n${raw_text.trim()}` },
      ],
      temperature: 0.3,
      max_tokens: 8000,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return safeError('Empty response from OpenAI', 500);

    let course: GeneratedCourse;
    try { course = JSON.parse(raw); }
    catch { return safeError('OpenAI returned invalid JSON', 500); }

    if (!course.title || !course.modules?.length) {
      return safeError('Generated course missing required fields', 500);
    }

    // Normalize lesson_number sequential across all modules
    let n = 1;
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) { lesson.lesson_number = n++; }
    }

    logger.info('Course generated', {
      userId: auth.user.id, title: course.title,
      modules: course.modules.length,
      lessons: course.modules.reduce((s, m) => s + m.lessons.length, 0),
    });

    return NextResponse.json({ course });
  } catch (err: any) {
    logger.error('Course generation error:', err);
    return safeInternalError(err, 'Generation failed');
  }
}

export const POST = withRuntime(withApiAudit('/api/admin/courses/generate', _POST));
