/**
 * /api/devstudio/execute
 *
 * SSE endpoint. Accepts a plain-English command, uses GPT-4o tool-calling to
 * map it to an action, then streams progress back line-by-line.
 *
 * Supported actions:
 *   generate_course      → POST /api/admin/courses/generate
 *   generate_video       → POST /api/video/generate
 *   run_report           → GET  /api/admin/reports/:type
 *   get_analytics        → GET  /api/admin/analytics
 *   list_applications    → GET  /api/admin/applications
 *   list_students        → GET  /api/admin/students
 *   list_enrollments     → GET  /api/admin/enrollments
 *   send_test_email      → POST /api/admin/test-email
 *   check_system_health  → GET  /api/admin/webhook-health
 *   ask_question         → answered directly by the AI (no action)
 */

import { NextRequest } from 'next/server';
// eslint-disable-next-line @typescript-eslint/no-require-imports
function _requireOpenAI() { return require('openai').default ?? require('openai'); }
import { apiRequireAdmin } from '@/lib/admin/guards';
import { applyRateLimit } from '@/lib/api/withRateLimit';
import { safeError } from '@/lib/api/safe-error';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const getOpenAI = () => new (_requireOpenAI())({ apiKey: process.env.OPENAI_API_KEY });

// ── Tool definitions ────────────────────────────────────────────────────────

const TOOLS: import('openai').default.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'generate_course',
      description: 'Generate a new course from a topic, blueprint, or syllabus description',
      parameters: {
        type: 'object',
        properties: {
          topic: { type: 'string', description: 'Course topic or title' },
          program_id: { type: 'string', description: 'Program UUID to attach the course to (optional)' },
          blueprint: { type: 'string', description: 'Blueprint ID if using an existing blueprint (optional)' },
        },
        required: ['topic'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'generate_video',
      description: 'Generate a lesson video using AI (D-ID or HeyGen)',
      parameters: {
        type: 'object',
        properties: {
          script: { type: 'string', description: 'Video script or topic' },
          lesson_id: { type: 'string', description: 'Lesson ID to attach the video to (optional)' },
        },
        required: ['script'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'run_report',
      description: 'Run an operational report',
      parameters: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['daily', 'enrollment', 'financial', 'leads', 'partners', 'users', 'cohort-outcomes', 'reconciliation'],
            description: 'Report type',
          },
        },
        required: ['type'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_analytics',
      description: 'Get platform analytics overview — enrollments, revenue, active users',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_applications',
      description: 'List recent applications with optional status filter',
      parameters: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['pending', 'approved', 'rejected', 'all'], description: 'Filter by status' },
          limit: { type: 'number', description: 'Max results (default 20)' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_students',
      description: 'List students with optional search',
      parameters: {
        type: 'object',
        properties: {
          search: { type: 'string', description: 'Name or email search term' },
          limit: { type: 'number', description: 'Max results (default 20)' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_enrollments',
      description: 'List recent enrollments',
      parameters: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Max results (default 20)' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'check_system_health',
      description: 'Check system and webhook health status',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
  {
    type: 'function',
    function: {
      name: 'send_test_email',
      description: 'Send a test email to verify email configuration',
      parameters: {
        type: 'object',
        properties: {
          to: { type: 'string', description: 'Recipient email address' },
        },
        required: ['to'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'ask_question',
      description: 'Answer a general question about the platform, data, or operations without running an action',
      parameters: {
        type: 'object',
        properties: {
          answer: { type: 'string', description: 'The answer to the question' },
        },
        required: ['answer'],
      },
    },
  },
];

// ── SSE helpers ─────────────────────────────────────────────────────────────

function encode(text: string) {
  return new TextEncoder().encode(`data: ${JSON.stringify({ line: text })}\n\n`);
}

function encodeDone() {
  return new TextEncoder().encode('data: [DONE]\n\n');
}

// ── Action executors ─────────────────────────────────────────────────────────

async function executeAction(
  name: string,
  args: Record<string, unknown>,
  baseUrl: string,
  authHeader: string,
  write: (line: string) => void,
) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Cookie: authHeader,
  };

  switch (name) {
    case 'generate_course': {
      write('\x1b[33m⚙  Generating course...\x1b[0m');
      write(`   Topic: ${args.topic}`);
      if (args.blueprint) write(`   Blueprint: ${args.blueprint}`);
      try {
        const res = await fetch(`${baseUrl}/api/admin/courses/generate`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ topic: args.topic, program_id: args.program_id, blueprint: args.blueprint }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          write('\x1b[32m✓  Course generation started\x1b[0m');
          if (data.courseId) write(`   Course ID: ${data.courseId}`);
          if (data.title) write(`   Title: ${data.title}`);
          write(`   View at: /admin/courses`);
        } else {
          write(`\x1b[31m✗  Failed: ${data.error || res.statusText}\x1b[0m`);
        }
      } catch {
        write('\x1b[31m✗  Network error contacting course generator\x1b[0m');
      }
      break;
    }

    case 'generate_video': {
      write('\x1b[33m⚙  Generating video...\x1b[0m');
      write(`   Script: ${String(args.script).substring(0, 80)}...`);
      try {
        const res = await fetch(`${baseUrl}/api/video/generate`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ script: args.script, lesson_id: args.lesson_id }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          write('\x1b[32m✓  Video generation queued\x1b[0m');
          if (data.jobId) write(`   Job ID: ${data.jobId}`);
          write(`   View at: /admin/video-manager`);
        } else {
          write(`\x1b[31m✗  Failed: ${data.error || res.statusText}\x1b[0m`);
        }
      } catch {
        write('\x1b[31m✗  Network error — check server logs\x1b[0m');
      }
      break;
    }

    case 'run_report': {
      const type = args.type as string;
      write(`\x1b[33m⚙  Running ${type} report...\x1b[0m`);
      try {
        const res = await fetch(`${baseUrl}/api/admin/reports/${type}`, { headers });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          write(`\x1b[32m✓  ${type} report complete\x1b[0m`);
          // Print top-level keys as summary
          for (const [k, v] of Object.entries(data)) {
            if (typeof v === 'number' || typeof v === 'string') {
              write(`   ${k}: ${v}`);
            }
          }
          write(`   Full report: /admin/reports/${type}`);
        } else {
          write(`\x1b[31m✗  Failed: ${data.error || res.statusText}\x1b[0m`);
        }
      } catch {
        write('\x1b[31m✗  Network error — check server logs\x1b[0m');
      }
      break;
    }

    case 'get_analytics': {
      write('\x1b[33m⚙  Fetching analytics...\x1b[0m');
      try {
        const res = await fetch(`${baseUrl}/api/admin/analytics`, { headers });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          write('\x1b[32m✓  Analytics loaded\x1b[0m');
          for (const [k, v] of Object.entries(data)) {
            if (typeof v === 'number' || typeof v === 'string') {
              write(`   ${k}: ${v}`);
            }
          }
        } else {
          write(`\x1b[31m✗  Failed: ${data.error || res.statusText}\x1b[0m`);
        }
      } catch {
        write('\x1b[31m✗  Network error — check server logs\x1b[0m');
      }
      break;
    }

    case 'list_applications': {
      const status = (args.status as string) || 'all';
      const limit = (args.limit as number) || 20;
      write(`\x1b[33m⚙  Loading applications (${status})...\x1b[0m`);
      try {
        const url = new URL(`${baseUrl}/api/admin/applications`);
        if (status !== 'all') url.searchParams.set('status', status);
        url.searchParams.set('limit', String(limit));
        const res = await fetch(url.toString(), { headers });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          const apps = Array.isArray(data) ? data : (data.applications ?? []);
          write(`\x1b[32m✓  ${apps.length} application(s)\x1b[0m`);
          apps.slice(0, 10).forEach((a: Record<string, unknown>) => {
            write(`   ${a.first_name ?? ''} ${a.last_name ?? ''} — ${a.status ?? ''} — ${a.program_interest ?? ''}`);
          });
          if (apps.length > 10) write(`   ... and ${apps.length - 10} more`);
          write(`   Full list: /admin/applications`);
        } else {
          write(`\x1b[31m✗  Failed: ${data.error || res.statusText}\x1b[0m`);
        }
      } catch {
        write('\x1b[31m✗  Network error — check server logs\x1b[0m');
      }
      break;
    }

    case 'list_students': {
      const limit = (args.limit as number) || 20;
      write('\x1b[33m⚙  Loading students...\x1b[0m');
      try {
        const url = new URL(`${baseUrl}/api/admin/students`);
        if (args.search) url.searchParams.set('search', args.search as string);
        url.searchParams.set('limit', String(limit));
        const res = await fetch(url.toString(), { headers });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          const students = Array.isArray(data) ? data : (data.students ?? []);
          write(`\x1b[32m✓  ${students.length} student(s)\x1b[0m`);
          students.slice(0, 10).forEach((s: Record<string, unknown>) => {
            write(`   ${s.first_name ?? ''} ${s.last_name ?? ''} — ${s.email ?? ''}`);
          });
          if (students.length > 10) write(`   ... and ${students.length - 10} more`);
          write(`   Full list: /admin/students`);
        } else {
          write(`\x1b[31m✗  Failed: ${data.error || res.statusText}\x1b[0m`);
        }
      } catch {
        write('\x1b[31m✗  Network error — check server logs\x1b[0m');
      }
      break;
    }

    case 'list_enrollments': {
      const limit = (args.limit as number) || 20;
      write('\x1b[33m⚙  Loading enrollments...\x1b[0m');
      try {
        const url = new URL(`${baseUrl}/api/admin/enrollments`);
        url.searchParams.set('limit', String(limit));
        const res = await fetch(url.toString(), { headers });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          const enrollments = Array.isArray(data) ? data : (data.enrollments ?? []);
          write(`\x1b[32m✓  ${enrollments.length} enrollment(s)\x1b[0m`);
          enrollments.slice(0, 10).forEach((e: Record<string, unknown>) => {
            write(`   ${e.student_name ?? e.user_id ?? ''} — ${e.program_name ?? e.program_id ?? ''} — ${e.status ?? ''}`);
          });
          if (enrollments.length > 10) write(`   ... and ${enrollments.length - 10} more`);
          write(`   Full list: /admin/enrollments`);
        } else {
          write(`\x1b[31m✗  Failed: ${data.error || res.statusText}\x1b[0m`);
        }
      } catch {
        write('\x1b[31m✗  Network error — check server logs\x1b[0m');
      }
      break;
    }

    case 'check_system_health': {
      write('\x1b[33m⚙  Checking system health...\x1b[0m');
      try {
        const res = await fetch(`${baseUrl}/api/admin/webhook-health`, { headers });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          write('\x1b[32m✓  Health check complete\x1b[0m');
          for (const [k, v] of Object.entries(data)) {
            if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
              const icon = v === true || v === 'ok' || v === 'healthy' ? '\x1b[32m✓\x1b[0m' : '\x1b[33m⚠\x1b[0m';
              write(`   ${icon} ${k}: ${v}`);
            }
          }
        } else {
          write(`\x1b[31m✗  Failed: ${data.error || res.statusText}\x1b[0m`);
        }
      } catch {
        write('\x1b[31m✗  Network error — check server logs\x1b[0m');
      }
      break;
    }

    case 'send_test_email': {
      write(`\x1b[33m⚙  Sending test email to ${args.to}...\x1b[0m`);
      try {
        const res = await fetch(`${baseUrl}/api/admin/test-email`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ to: args.to }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          write('\x1b[32m✓  Test email sent\x1b[0m');
        } else {
          write(`\x1b[31m✗  Failed: ${data.error || res.statusText}\x1b[0m`);
        }
      } catch {
        write('\x1b[31m✗  Network error — check server logs\x1b[0m');
      }
      break;
    }

    case 'ask_question': {
      write('\x1b[32m✓  \x1b[0m' + String(args.answer));
      break;
    }

    default:
      write(`\x1b[31m✗  Unknown action: ${name}\x1b[0m`);
  }
}

// ── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const rateLimited = await applyRateLimit(req, 'api');
  if (rateLimited) return rateLimited;

  const auth = await apiRequireAdmin(req);
  if (auth.error) return auth.error;

  const { command, history = [] } = await req.json();
  if (!command?.trim()) {
    return new Response('data: [DONE]\n\n', {
      headers: { 'Content-Type': 'text/event-stream' },
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const cookieHeader = req.headers.get('cookie') || '';

  const stream = new ReadableStream({
    async start(controller) {
      const write = (line: string) => {
        try { controller.enqueue(encode(line)); } catch { /* stream closed */ }
      };

      try {
        write(`\x1b[90m$ ${command}\x1b[0m`);
        write('');

        const messages: import('openai').default.Chat.ChatCompletionMessageParam[] = [
          {
            role: 'system',
            content: `You are the Elevate for Humanity admin command assistant. 
The admin speaks to you in plain English and you execute the right action.
Always use a tool — never respond with plain text unless using ask_question.
Be decisive. If the intent is clear, act. If ambiguous, use ask_question to clarify.`,
          },
          ...history,
          { role: 'user', content: command },
        ];

        const response = await getOpenAI().chat.completions.create({
          model: 'gpt-4o',
          messages,
          tools: TOOLS,
          tool_choice: 'required',
          temperature: 0.2,
        });

        const msg = response.choices[0].message;

        if (msg.tool_calls?.length) {
          for (const call of msg.tool_calls) {
            const args = JSON.parse(call.function.arguments || '{}');
            await executeAction(call.function.name, args, baseUrl, cookieHeader, write);
            write('');
          }
        } else if (msg.content) {
          write(msg.content);
        }

        write('\x1b[90m─────────────────────────────────────\x1b[0m');
      } catch (err) {
        logger.error('[devstudio/execute]', err);
        // Write a safe message to the terminal — never expose raw error details
        write('\x1b[31m✗  An error occurred. Check server logs for details.\x1b[0m');
      } finally {
        try { controller.enqueue(encodeDone()); } catch { /* already closed */ }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
