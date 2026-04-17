// app/api/admin/programs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { withAuth } from '@/lib/with-auth';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export const GET = withAuth(
  async (req, context) => {
    const db = await getAdminClient();
    const { data, error } = await db
      .from('programs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error loading programs:', error);
      return NextResponse.json({ error: 'Failed to load programs' }, { status: 500 });
    }

    return NextResponse.json({ programs: data ?? [] });
  },
  { roles: ['admin', 'super_admin'] }
);

export const POST = withAuth(
  async (req: NextRequest, user) => {
    try {
      const body = await req.json();
      const { id, ...payload } = body;

      if (!payload.title) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      }

      // auto-generate slug if missing
      if (!payload.slug && payload.title) {
        payload.slug = payload.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      const db = await getAdminClient();
      const result = id
        ? await db.from('programs').update(payload).eq('id', id).select('*').maybeSingle()
        : await db.from('programs').insert(payload).select('*').maybeSingle();

      const { data, error } = result;

      if (error || !data) {
        logger.error('Program save error:', error);
        return NextResponse.json({ error: 'Failed to save program' }, { status: 500 });
      }

      return NextResponse.json({ program: data });
    } catch (err) {
      logger.error('Program save error:', err);
      return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
    }
  },
  { roles: ['admin', 'super_admin'] }
);
