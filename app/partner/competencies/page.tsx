'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, RefreshCcw, Scissors, User } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

type PendingRep = {
  id: string;
  apprenticeId: string;
  apprenticeName: string;
  skillName: string;
  workDate: string;
  serviceCount: number;
  notes: string | null;
  supervisorName: string | null;
  submittedAt: string;
};

export default function PartnerCompetenciesPage() {
  const [entries, setEntries] = useState<PendingRep[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/pwa/shop-owner/pending-reps');
      if (res.status === 401) {
        setError('Please sign in to review competency reps.');
        return;
      }
      if (res.status === 403) {
        setError('You are not authorized to verify competency reps.');
        return;
      }
      if (!res.ok) throw new Error('Failed to load pending reps');
      const data = await res.json();
      setEntries(data.entries ?? []);
    } catch {
      setError('Failed to load pending reps. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleVerify = async (entry: PendingRep) => {
    setProcessing(entry.id);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/supervisor/verify-rep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competencyLogId: entry.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to verify rep');
      setEntries(prev => prev.filter(item => item.id !== entry.id));
      setSuccess(`Verified ${entry.serviceCount} rep${entry.serviceCount !== 1 ? 's' : ''} for ${entry.apprenticeName}.`);
    } catch (err: any) {
      setError(err?.message || 'Failed to verify rep.');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[160px] sm:h-[220px] md:h-[280px] overflow-hidden rounded-xl mb-6 -mx-4 sm:-mx-6 lg:-mx-8">
        <Image src="/images/pages/partner-page-8.jpg" alt="Competency verification" fill sizes="100vw" className="object-cover" priority />
      </section>
      <div className="mb-6">
        <Breadcrumbs items={[
          { label: 'Partner', href: '/partner/attendance' },
          { label: 'Competencies' },
        ]} />
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Competency Verification</h1>
            <p className="text-slate-600 mt-1">Approve barber service reps (cuts, shaves, chemical services, sanitation).</p>
          </div>
          <button
            onClick={fetchPending}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
          Only verify reps you personally witnessed. Your sign-off is a legal attestation for DOL records.
        </div>

        {error && (
          <div className="mb-6 p-4 bg-brand-red-50 border border-brand-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-brand-red-600" />
            <p className="text-brand-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-brand-green-50 border border-brand-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-brand-green-600" />
            <p className="text-brand-green-800">{success}</p>
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl border p-8 text-center">
            <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3 animate-pulse" />
            <p className="text-slate-500">Loading pending reps...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-white rounded-xl border p-10 text-center">
            <CheckCircle2 className="w-12 h-12 text-brand-green-500 mx-auto mb-3" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">All caught up</h2>
            <p className="text-slate-600 mb-4">No competency reps waiting for your review.</p>
            <Link
              href="/partner/hours"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-50"
            >
              Back to Hours
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map(entry => {
              const workDate = new Date(`${entry.workDate}T12:00:00`);
              const submitted = new Date(entry.submittedAt);
              return (
                <div key={entry.id} className="bg-white rounded-xl border p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-brand-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-brand-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{entry.apprenticeName}</h3>
                          <p className="text-sm text-slate-500 flex items-center gap-2">
                            <Scissors className="w-4 h-4 text-slate-400" />
                            {entry.skillName}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-slate-600 mb-3">
                        <div>
                          <span className="block text-xs text-slate-400 uppercase tracking-wide">Date Performed</span>
                          {workDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div>
                          <span className="block text-xs text-slate-400 uppercase tracking-wide">Reps Logged</span>
                          {entry.serviceCount} rep{entry.serviceCount !== 1 ? 's' : ''}
                        </div>
                        <div>
                          <span className="block text-xs text-slate-400 uppercase tracking-wide">Submitted</span>
                          {submitted.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}{' '}
                          {submitted.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </div>
                      </div>

                      {entry.notes && (
                        <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm text-slate-600">
                          {entry.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVerify(entry)}
                        disabled={processing === entry.id}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green-600 text-white rounded-lg hover:bg-brand-green-700 disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {processing === entry.id ? 'Verifying…' : 'Verify'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
