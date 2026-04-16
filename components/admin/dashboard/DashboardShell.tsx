// Server component — no "use client", no useState, no useEffect.
// All date formatting uses fixed locale + UTC timezone to prevent hydration mismatches.

import Link from "next/link";
import {
  Users, FileText, TrendingUp, Award, AlertTriangle,
  CheckCircle, Clock, ArrowRight, Activity, BookOpen,
  DollarSign, Shield, Bell, ChevronRight, Zap,
} from "lucide-react";
import type { AdminDashboardData, KPICard, RecentApplication, RecentStudent, InactiveLearner, PendingSubmission } from "./types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number) { return n.toLocaleString("en-US"); }
function dollars(cents: number) { return "$" + (cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }
function statusColor(s: string) {
  if (s === "approved" || s === "enrolled") return "bg-emerald-100 text-emerald-800";
  if (s === "rejected") return "bg-red-100 text-red-800";
  if (s === "in_review" || s === "under_review") return "bg-blue-100 text-blue-800";
  if (s === "waitlisted") return "bg-amber-100 text-amber-800";
  return "bg-slate-100 text-slate-700";
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function HeroHeader({ data }: { data: AdminDashboardData }) {
  const name = data.profile?.full_name?.split(" ")[0] ?? "Admin";
  const date = new Date(data.generatedAt).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });
  const health = data.systemHealth;
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-blue-900 to-slate-900 text-white">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #e63946 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1d3557 0%, transparent 50%)" }} />
      <div className="relative max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-1">{date}</p>
            <h1 className="text-3xl font-bold">Welcome back, {name}</h1>
            <p className="text-slate-300 mt-1 text-sm">Elevate for Humanity — Operations Center</p>
          </div>
          <div className="flex items-center gap-3">
            {health.degraded ? (
              <span className="flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-2 rounded-full text-sm font-medium">
                <AlertTriangle className="w-4 h-4" /> System Degraded
              </span>
            ) : (
              <span className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4" /> All Systems Operational
              </span>
            )}
            <Link href="/admin/applications" className="flex items-center gap-2 bg-brand-red-600 hover:bg-brand-red-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">
              <Bell className="w-4 h-4" />
              {data.counts.pendingApplications > 0 && <span>{data.counts.pendingApplications} Pending</span>}
              {data.counts.pendingApplications === 0 && <span>Applications</span>}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPIGrid({ kpis, counts }: { kpis: KPICard[]; counts: AdminDashboardData["counts"] }) {
  const cards = [
    { label: "Pending Applications", value: fmt(counts.pendingApplications), icon: FileText, color: "from-amber-500 to-orange-600", href: "/admin/applications", urgent: counts.pendingApplications > 10 },
    { label: "Active Enrollments", value: fmt(counts.activeEnrollments), icon: Users, color: "from-brand-blue-500 to-brand-blue-700", href: "/admin/students" },
    { label: "Revenue This Month", value: dollars(counts.revenueThisMonthCents), icon: DollarSign, color: "from-emerald-500 to-teal-600", href: "/admin/students?payment_status=paid" },
    { label: "Certificates Issued", value: fmt(counts.certificatesIssued), icon: Award, color: "from-purple-500 to-violet-600", href: "/admin/certifications" },
    { label: "Pending Docs", value: fmt(counts.pendingDocuments), icon: Clock, color: "from-rose-500 to-brand-red-600", href: "/admin/documents", urgent: counts.pendingDocuments > 0 },
    { label: "Program Holders", value: fmt(counts.pendingProgramHolders), icon: Shield, color: "from-slate-500 to-slate-700", href: "/admin/program-holders" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((c) => (
        <Link key={c.label} href={c.href} className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
          <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${c.color}`} />
          <div className="p-5">
            <div className={`inline-flex p-2 rounded-xl bg-gradient-to-br ${c.color} mb-3`}>
              <c.icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{c.value}</div>
            <div className="text-xs text-slate-500 mt-0.5 leading-tight">{c.label}</div>
            {c.urgent && <div className="mt-2 w-2 h-2 rounded-full bg-brand-red-500 animate-pulse" />}
          </div>
        </Link>
      ))}
    </div>
  );
}

function ApplicationsPanel({ apps }: { apps: RecentApplication[] }) {
  if (!apps.length) return null;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50"><FileText className="w-4 h-4 text-amber-600" /></div>
          <h2 className="font-semibold text-slate-900">Recent Applications</h2>
        </div>
        <Link href="/admin/applications" className="text-sm text-brand-blue-600 hover:text-brand-blue-700 font-medium flex items-center gap-1">
          View all <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="divide-y divide-slate-50">
        {apps.slice(0, 8).map((a) => (
          <Link key={a.id} href={a.href} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors group">
            <div className="min-w-0">
              <p className="font-medium text-slate-900 text-sm truncate">{a.full_name ?? (`${a.first_name ?? ""} ${a.last_name ?? ""}`.trim() || "—")}</p>
              <p className="text-xs text-slate-500 truncate">{a.program_interest ?? "No program"}</p>
            </div>
            <div className="flex items-center gap-3 ml-4 shrink-0">
              {a.urgent && <span className="text-xs text-brand-red-600 font-medium">{a.age_days}d old</span>}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(a.status)}`}>{a.status.replace(/_/g, " ")}</span>
              <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StudentsPanel({ students }: { students: RecentStudent[] }) {
  if (!students.length) return null;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50"><Users className="w-4 h-4 text-brand-blue-600" /></div>
          <h2 className="font-semibold text-slate-900">Recent Students</h2>
        </div>
        <Link href="/admin/students" className="text-sm text-brand-blue-600 hover:text-brand-blue-700 font-medium flex items-center gap-1">
          View all <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="divide-y divide-slate-50">
        {students.slice(0, 6).map((s) => (
          <Link key={s.id} href={s.href} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue-400 to-brand-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {(s.full_name ?? s.email ?? "?")[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate">{s.full_name ?? s.email ?? "—"}</p>
                <p className="text-xs text-slate-500 truncate">{s.program_name ?? "No program"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 shrink-0">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(s.enrollment_status ?? "")}`}>{s.enrollment_status ?? "—"}</span>
              <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SubmissionsPanel({ submissions }: { submissions: PendingSubmission[] }) {
  if (!submissions.length) return null;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-50"><BookOpen className="w-4 h-4 text-purple-600" /></div>
          <h2 className="font-semibold text-slate-900">Pending Sign-Offs</h2>
        </div>
        <Link href="/instructor/submissions" className="text-sm text-brand-blue-600 hover:text-brand-blue-700 font-medium flex items-center gap-1">
          Review all <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="divide-y divide-slate-50">
        {submissions.slice(0, 6).map((s) => (
          <Link key={s.id} href={`/instructor/submissions/${s.id}`} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors group">
            <div className="min-w-0">
              <p className="font-medium text-slate-900 text-sm capitalize">{s.step_type ?? "submission"}</p>
              <p className="text-xs text-slate-500">{s.submitted_at ? new Date(s.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }) : "—"}</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-800 shrink-0">{s.status}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function InactivePanel({ learners }: { learners: InactiveLearner[] }) {
  if (!learners.length) return null;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-50"><Activity className="w-4 h-4 text-rose-600" /></div>
          <h2 className="font-semibold text-slate-900">At-Risk Learners</h2>
        </div>
        <Link href="/admin/students?filter=at_risk" className="text-sm text-brand-blue-600 hover:text-brand-blue-700 font-medium flex items-center gap-1">
          View all <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="divide-y divide-slate-50">
        {learners.slice(0, 5).map((l) => (
          <Link key={l.enrollmentId} href={l.href} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors group">
            <div className="min-w-0">
              <p className="font-medium text-slate-900 text-sm truncate">{l.fullName ?? l.email ?? "—"}</p>
              <p className="text-xs text-slate-500 truncate">{l.programTitle ?? "No program"}</p>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-rose-100 text-rose-800 shrink-0">{l.daysInactive}d inactive</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    { label: "Review Applications", href: "/admin/applications", icon: FileText, color: "bg-amber-500" },
    { label: "Manage Students", href: "/admin/students", icon: Users, color: "bg-brand-blue-600" },
    { label: "Programs", href: "/admin/programs", icon: BookOpen, color: "bg-purple-600" },
    { label: "Payments", href: "/admin/payments", icon: DollarSign, color: "bg-emerald-600" },
    { label: "Certifications", href: "/admin/certifications", icon: Award, color: "bg-violet-600" },
    { label: "Monitoring", href: "/admin/monitoring", icon: Activity, color: "bg-slate-700" },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: Shield, color: "bg-rose-600" },
    { label: "Settings", href: "/admin/settings", icon: Zap, color: "bg-teal-600" },
  ];
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-900">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-100">
        {actions.map((a) => (
          <Link key={a.label} href={a.href} className="flex flex-col items-center gap-2 p-5 bg-white hover:bg-slate-50 transition-colors group">
            <div className={`p-2.5 rounded-xl ${a.color}`}>
              <a.icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium text-slate-700 text-center leading-tight">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SystemHealthPanel({ health }: { health: AdminDashboardData["systemHealth"] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${health.degraded ? "bg-red-50" : "bg-emerald-50"}`}>
            <Activity className={`w-4 h-4 ${health.degraded ? "text-red-600" : "text-emerald-600"}`} />
          </div>
          <h2 className="font-semibold text-slate-900">System Health</h2>
        </div>
      </div>
      <div className="p-6 space-y-3">
        {[
          { label: "Stripe Webhooks", ok: health.stripeWebhookOk },
          { label: "Build Environment", ok: health.buildEnvOk },
          { label: "Stale Jobs", ok: health.staleJobs === 0, note: health.staleJobs > 0 ? `${health.staleJobs} stale` : undefined },
          { label: "Missing Documents", ok: health.missingDocuments === 0, note: health.missingDocuments > 0 ? `${health.missingDocuments} missing` : undefined },
          { label: "Unresolved Flags", ok: health.unresolvedFlags === 0, note: health.unresolvedFlags > 0 ? `${health.unresolvedFlags} open` : undefined },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-sm text-slate-600">{row.label}</span>
            <div className="flex items-center gap-2">
              {row.note && <span className="text-xs text-amber-600 font-medium">{row.note}</span>}
              {row.ok
                ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                : <AlertTriangle className="w-4 h-4 text-amber-500" />}
            </div>
          </div>
        ))}
        {health.alerts.filter(a => a.severity === "critical").map((a) => (
          <div key={a.code} className="mt-2 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700">{a.message}</div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Shell ──────────────────────────────────────────────────────────────

export function DashboardShell({ data }: { data: AdminDashboardData }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <HeroHeader data={data} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {data.degradedSections.length > 0 && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800 font-medium">Some sections unavailable: {data.degradedSections.join(", ")}</p>
          </div>
        )}
        <KPIGrid kpis={data.kpis} counts={data.counts} />
        <QuickActions />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ApplicationsPanel apps={data.recentApplications} />
          <StudentsPanel students={data.recentStudents} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SubmissionsPanel submissions={data.pendingSubmissions} />
          <InactivePanel learners={data.inactiveLearners} />
        </div>
        <SystemHealthPanel health={data.systemHealth} />
      </div>
    </div>
  );
}
