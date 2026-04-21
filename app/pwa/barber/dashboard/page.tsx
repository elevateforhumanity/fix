import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { Scissors, Clock, Award, TrendingUp, ChevronRight, Plus, CheckCircle, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Barber Dashboard | Elevate for Humanity',
  robots: { index: false, follow: false },
};

const BARBER_LICENSE_HOURS = 1500;

export default async function BarberDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect=/pwa/barber/dashboard');

  const db = await getAdminClient();

  const [
    { data: profile },
    { data: hours },
    { data: recentHours },
  ] = await Promise.all([
    db.from('profiles').select('id, full_name, role').eq('id', user.id).maybeSingle(),
    db.from('apprentice_hours')
      .select('id, date, hours, minutes, category, status, discipline')
      .eq('user_id', user.id)
      .eq('discipline', 'barber')
      .order('date', { ascending: false }),
    db.from('apprentice_hours')
      .select('id, date, hours, minutes, category, status')
      .eq('user_id', user.id)
      .eq('discipline', 'barber')
      .order('date', { ascending: false })
      .limit(10),
  ]);

  const approvedHours = (hours ?? [])
    .filter((h: any) => h.status === 'approved')
    .reduce((sum: number, h: any) => sum + (h.hours ?? 0) + (h.minutes ?? 0) / 60, 0);

  const pendingHours = (hours ?? [])
    .filter((h: any) => h.status === 'pending')
    .reduce((sum: number, h: any) => sum + (h.hours ?? 0) + (h.minutes ?? 0) / 60, 0);

  const progressPct = Math.min(Math.round((approvedHours / BARBER_LICENSE_HOURS) * 100), 100);
  const remaining = Math.max(BARBER_LICENSE_HOURS - approvedHours, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-red-400 mb-0.5">Barber Apprentice</p>
          <h1 className="text-xl font-bold text-white">{profile?.full_name ?? 'Dashboard'}</h1>
        </div>
        <Link href="/pwa/barber" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800">
          Full App <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress toward license */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-900">License Progress</h2>
            <span className="text-sm font-bold text-brand-red-600">{progressPct}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 mb-3">
            <div className="bg-brand-red-600 h-3 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>{Math.round(approvedHours)} hrs approved</span>
            <span>{Math.round(remaining)} hrs remaining of {BARBER_LICENSE_HOURS}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Approved Hrs', value: Math.round(approvedHours), icon: CheckCircle, color: 'text-green-500' },
            { label: 'Pending Hrs', value: Math.round(pendingHours), icon: Clock, color: 'text-amber-500' },
            { label: 'Log Entries', value: hours?.length ?? 0, icon: TrendingUp, color: 'text-blue-500' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 text-center">
                <Icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
                <p className="text-xl font-extrabold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Log hours CTA */}
        <Link href="/pwa/barber/log-hours" className="flex items-center justify-center gap-2 w-full rounded-xl bg-brand-red-600 px-6 py-4 text-white font-bold text-lg hover:bg-brand-red-700 transition mb-6">
          <Plus className="w-5 h-5" /> Log Today's Hours
        </Link>

        {/* Recent entries */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">Recent Hours</h2>
            <Link href="/pwa/barber/hours" className="text-sm text-brand-red-600 hover:underline">View all</Link>
          </div>
          {!recentHours?.length ? (
            <div className="px-5 py-10 text-center text-slate-400 text-sm">No hours logged yet. Start tracking today.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentHours.map((h: any) => (
                <div key={h.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{h.category ?? 'General'}</p>
                    <p className="text-xs text-slate-400">{new Date(h.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-900">{h.hours}h {h.minutes > 0 ? `${h.minutes}m` : ''}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      h.status === 'approved' ? 'bg-green-50 text-green-700' :
                      h.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                      'bg-red-50 text-red-700'
                    }`}>{h.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
