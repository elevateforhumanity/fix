import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { Building2, Users, Clock, CheckCircle, ChevronRight, QrCode, TrendingUp, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Shop Owner Dashboard | Elevate for Humanity',
  robots: { index: false, follow: false },
};

export default async function ShopOwnerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect=/pwa/shop-owner/dashboard');

  const db = await getAdminClient();

  const [
    { data: profile },
    { data: shop },
  ] = await Promise.all([
    db.from('profiles').select('id, full_name, role').eq('id', user.id).maybeSingle(),
    db.from('shops').select('id, name, address1, city, state, active, ein').eq('owner_id', user.id).eq('active', true).maybeSingle(),
  ]);

  // Apprentices at this shop
  const { data: apprentices, count: apprenticeCount } = shop
    ? await db.from('apprentice_hours')
        .select('user_id', { count: 'exact' })
        .eq('shop_id', shop.id)
        .limit(1)
    : { data: [], count: 0 };

  // Recent hours logged at this shop
  const { data: recentHours } = shop
    ? await db.from('apprentice_hours')
        .select('id, date, hours, minutes, status, user_id')
        .eq('shop_id', shop.id)
        .order('date', { ascending: false })
        .limit(10)
    : { data: [] };

  const { count: pendingApprovals } = shop
    ? await db.from('apprentice_hours')
        .select('*', { count: 'exact', head: true })
        .eq('shop_id', shop.id)
        .eq('status', 'pending')
    : { count: 0 };

  const totalHoursLogged = (recentHours ?? []).reduce((sum: number, h: any) => sum + (h.hours ?? 0), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-red-400 mb-0.5">Shop Owner</p>
          <h1 className="text-xl font-bold text-white">{shop?.name ?? profile?.full_name ?? 'Dashboard'}</h1>
          {shop?.city && <p className="text-slate-400 text-xs mt-0.5">{shop.city}, {shop.state}</p>}
          {!shop?.city && shop?.address1 && <p className="text-slate-400 text-xs mt-0.5">{shop.address1}</p>}
        </div>
        <div className="flex items-center gap-3">
          {shop?.active && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 border border-green-500/30 px-3 py-1 text-xs font-semibold text-green-400">
              <CheckCircle className="w-3 h-3" /> Active
            </span>
          )}
          <Link href="/pwa/shop-owner" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800">
            Full App <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {!shop && (
          <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 p-4 mb-6">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">No shop found</p>
              <p className="text-xs text-amber-700 mt-0.5">Your account is not linked to a shop yet. Contact Elevate for Humanity to get set up.</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { label: 'Apprentices', value: apprenticeCount ?? 0, icon: Users, color: 'text-blue-500' },
            { label: 'Pending Approvals', value: pendingApprovals ?? 0, icon: AlertCircle, color: (pendingApprovals ?? 0) > 0 ? 'text-red-500' : 'text-slate-400' },
            { label: 'Hours Logged (recent)', value: totalHoursLogged, icon: Clock, color: 'text-green-500' },
            { label: 'EIN', value: shop?.ein ?? '—', icon: Building2, color: 'text-slate-400' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-5">
                <Icon className={`w-5 h-5 ${s.color} mb-3`} />
                <p className="text-xl font-extrabold text-slate-900">{s.value}</p>
                <p className="text-sm text-slate-500 mt-0.5">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link href="/pwa/shop-owner/approve-hours" className="flex items-center justify-center gap-2 rounded-xl bg-brand-red-600 px-4 py-4 text-white font-bold hover:bg-brand-red-700 transition">
            <CheckCircle className="w-5 h-5" /> Approve Hours
          </Link>
          <Link href="/pwa/shop-owner/qr-checkin" className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-4 text-slate-700 font-bold hover:bg-slate-50 transition">
            <QrCode className="w-5 h-5" /> QR Check-In
          </Link>
        </div>

        {/* Recent hours */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">Recent Hours Logged</h2>
            <Link href="/pwa/shop-owner/hours" className="text-sm text-brand-red-600 hover:underline">View all</Link>
          </div>
          {!recentHours?.length ? (
            <div className="px-5 py-10 text-center text-slate-400 text-sm">No hours logged at this shop yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {(recentHours as any[]).map((h) => (
                <div key={h.id} className="flex items-center justify-between px-5 py-3">
                  <p className="text-xs text-slate-400">{new Date(h.date).toLocaleDateString()}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-900">{h.hours}h</span>
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
