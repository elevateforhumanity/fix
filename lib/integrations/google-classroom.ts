/**
 * Google Classroom integration.
 *
 * Uses the same Google OAuth client as YouTube (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET).
 * Required scopes:
 *   https://www.googleapis.com/auth/classroom.courses.readonly
 *   https://www.googleapis.com/auth/classroom.rosters.readonly
 *   https://www.googleapis.com/auth/classroom.coursework.students
 *
 * Tokens are stored in `integration_tokens` (user_id, provider, access_token,
 * refresh_token, expires_at). Admins connect via /admin/integrations/google-classroom.
 */

import { logger } from '@/lib/logger';

const CLASSROOM_BASE = 'https://classroom.googleapis.com/v1';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';

export const CLASSROOM_SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses.readonly',
  'https://www.googleapis.com/auth/classroom.rosters.readonly',
  'https://www.googleapis.com/auth/classroom.coursework.students',
].join(' ');

export interface ClassroomCourse {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  description?: string;
  room?: string;
  ownerId: string;
  courseState: 'ACTIVE' | 'ARCHIVED' | 'PROVISIONED' | 'DECLINED' | 'SUSPENDED';
  alternateLink: string;
  enrollmentCode?: string;
  creationTime: string;
  updateTime: string;
}

export interface ClassroomStudent {
  courseId: string;
  userId: string;
  profile: {
    id: string;
    name: { fullName: string; givenName: string; familyName: string };
    emailAddress: string;
  };
}

export interface ClassroomCourseWork {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  state: 'PUBLISHED' | 'DRAFT' | 'DELETED';
  dueDate?: { year: number; month: number; day: number };
  maxPoints?: number;
  workType: 'ASSIGNMENT' | 'SHORT_ANSWER_QUESTION' | 'MULTIPLE_CHOICE_QUESTION';
  alternateLink: string;
  creationTime: string;
  updateTime: string;
}

export function isClassroomConfigured(): boolean {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function getClassroomAuthUrl(redirectUri: string, state?: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: CLASSROOM_SCOPES,
    access_type: 'offline',
    prompt: 'consent',
    ...(state ? { state } : {}),
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function exchangeClassroomCode(
  code: string,
  redirectUri: string,
): Promise<{ access_token: string; refresh_token: string; expires_in: number } | null> {
  try {
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    if (!res.ok) {
      logger.error('[Classroom] token exchange failed', { status: res.status });
      return null;
    }
    return res.json();
  } catch (err) {
    logger.error('[Classroom] token exchange error', err);
    return null;
  }
}

export async function refreshClassroomToken(
  refreshToken: string,
): Promise<{ access_token: string; expires_in: number } | null> {
  try {
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: 'refresh_token',
      }),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function classroomFetch<T>(
  path: string,
  accessToken: string,
  options?: RequestInit,
): Promise<T | null> {
  try {
    const res = await fetch(`${CLASSROOM_BASE}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
    });
    if (!res.ok) {
      logger.error('[Classroom] API error', { path, status: res.status });
      return null;
    }
    return res.json();
  } catch (err) {
    logger.error('[Classroom] fetch error', err);
    return null;
  }
}

export async function listClassroomCourses(
  accessToken: string,
): Promise<ClassroomCourse[]> {
  const data = await classroomFetch<{ courses?: ClassroomCourse[] }>(
    '/courses?courseStates=ACTIVE&pageSize=50',
    accessToken,
  );
  return data?.courses ?? [];
}

export async function listCourseStudents(
  accessToken: string,
  courseId: string,
): Promise<ClassroomStudent[]> {
  const data = await classroomFetch<{ students?: ClassroomStudent[] }>(
    `/courses/${courseId}/students?pageSize=200`,
    accessToken,
  );
  return data?.students ?? [];
}

export async function listCourseWork(
  accessToken: string,
  courseId: string,
): Promise<ClassroomCourseWork[]> {
  const data = await classroomFetch<{ courseWork?: ClassroomCourseWork[] }>(
    `/courses/${courseId}/courseWork?pageSize=50`,
    accessToken,
  );
  return data?.courseWork ?? [];
}

export async function createCourseWork(
  accessToken: string,
  courseId: string,
  work: {
    title: string;
    description?: string;
    maxPoints?: number;
    dueDate?: { year: number; month: number; day: number };
    workType?: 'ASSIGNMENT' | 'SHORT_ANSWER_QUESTION';
  },
): Promise<ClassroomCourseWork | null> {
  return classroomFetch<ClassroomCourseWork>(
    `/courses/${courseId}/courseWork`,
    accessToken,
    {
      method: 'POST',
      body: JSON.stringify({
        title: work.title,
        description: work.description,
        maxPoints: work.maxPoints ?? 100,
        dueDate: work.dueDate,
        workType: work.workType ?? 'ASSIGNMENT',
        state: 'PUBLISHED',
      }),
    },
  );
}
