'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, ExternalLink, RefreshCw, Unlink, BookOpen, Users } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  section?: string;
  courseState: string;
  alternateLink: string;
  enrollmentCode?: string;
}

interface Props {
  isConnected: boolean;
  connectedAt: string | null;
  flashConnected: boolean;
  flashError: string | null;
}

const ERROR_MESSAGES: Record<string, string> = {
  oauth_denied: 'Google authorization was denied. Please try again.',
  token_exchange: 'Failed to exchange authorization code. Please try again.',
  invalid_state: 'Invalid OAuth state. Please try again.',
  db_error: 'Failed to save connection. Please try again.',
  db_unavailable: 'Database unavailable. Please try again later.',
};

export default function GoogleClassroomClient({ isConnected: initialConnected, connectedAt, flashConnected, flashError }: Props) {
  const [connected, setConnected] = useState(initialConnected);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState(flashError ? (ERROR_MESSAGES[flashError] ?? flashError) : '');
  const [success, setSuccess] = useState(flashConnected ? 'Google Classroom connected successfully.' : '');

  useEffect(() => {
    if (connected) loadCourses();
  }, [connected]);

  async function loadCourses() {
    setLoadingCourses(true);
    setError('');
    try {
      const res = await fetch('/api/integrations/google-classroom/courses');
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Failed to load courses');
      }
      const data = await res.json();
      setCourses(data.courses ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingCourses(false);
    }
  }

  async function disconnect() {
    if (!confirm('Disconnect Google Classroom? Existing synced data will not be deleted.')) return;
    setDisconnecting(true);
    try {
      await fetch('/api/integrations/google-classroom/disconnect', { method: 'POST' });
      setConnected(false);
      setCourses([]);
      setSuccess('');
    } catch {
      setError('Failed to disconnect. Please try again.');
    } finally {
      setDisconnecting(false);
    }
  }

  return (
    <div className="mt-6 space-y-4">
      {success && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Connection card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-2.5 py-1 rounded-full ${connected ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-500' : 'bg-slate-400'}`} />
                {connected ? 'Connected' : 'Not connected'}
              </span>
            </div>
            {connected && connectedAt && (
              <p className="text-xs text-slate-400 mt-1">
                Last updated {new Date(connectedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {connected ? (
              <>
                <button
                  onClick={loadCourses}
                  disabled={loadingCourses}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingCourses ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={disconnect}
                  disabled={disconnecting}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  Disconnect
                </button>
              </>
            ) : (
              <a
                href="/api/integrations/google-classroom/connect"
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-blue-700 text-white text-sm font-medium rounded-lg hover:bg-brand-blue-800 transition-colors"
              >
                Connect Google Classroom
              </a>
            )}
          </div>
        </div>

        {!connected && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-600 mb-3">What this enables:</p>
            <ul className="space-y-1.5 text-sm text-slate-600">
              {[
                'View active courses and rosters from your Google Classroom account',
                'Sync student enrollment between Elevate and Classroom',
                'Push assignments from Elevate lessons to Classroom',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-400">
              Requires Google Workspace account. Uses read-only access to courses and rosters.
            </p>
          </div>
        )}
      </div>

      {/* Courses list */}
      {connected && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Active Courses</h2>
            <span className="text-sm text-slate-400">{courses.length} course{courses.length !== 1 ? 's' : ''}</span>
          </div>
          {loadingCourses ? (
            <div className="px-6 py-8 text-center text-sm text-slate-400">Loading courses…</div>
          ) : courses.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-slate-400">No active courses found in your Google Classroom account.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {courses.map(course => (
                <li key={course.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{course.name}</p>
                      {course.section && <p className="text-xs text-slate-400">{course.section}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {course.enrollmentCode && (
                      <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {course.enrollmentCode}
                      </span>
                    )}
                    <a
                      href={course.alternateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
