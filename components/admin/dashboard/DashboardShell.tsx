// Server component — no "use client", no useState, no useEffect.

import Link from "next/link";
import { AdminGreeting } from "@/components/admin/AdminGreeting";
import {
  FileText, Users, DollarSign, Award, AlertTriangle,
  ArrowRight, BookOpen, ChevronRight, ShieldAlert,
  CheckCircle2, XCircle, Building2, GraduationCap, Bell,
  ClipboardList,
} from "lucide-react";
import type { AdminDashboardData, SystemHealth } from "./types";
import { KpiGrid } from "./KpiGrid";
import { EnrollmentSparkline } from "./EnrollmentSparkline";
import { SystemHealthPanel } from "./SystemHealthPanel";

// ── Formatters ────────────────────────────────────────────────────────────────
function fmtUsd(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD", maximumFractionDigits: 0,
  }).format(cents / 100);
}
function fmtNum(n: number) { return new Intl.NumberFormat("en-US").format(n); }
function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function fmtAge(days: number) {
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

// ── Status pill ───────────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  submitted: "bg-amber-100 text-amber-800",
  pending:   "bg-amber-100 text-amber-800",
  in_review: "bg-blue-100 text-blue-800",
  active:    "bg-emerald-100 text-emerald-800",
  completed: "bg-slate-100 text-slate-600",
  draft:     "bg-slate-100 text-slate-500",
  inactive:  "bg-slate-100 text-slate-500",
};
function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${STATUS_COLORS[status] ?? "bg-slate-100 text-slate-600"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function Empty({ message }: { message: string }) {
  return <p className="text-sm text-slate-400 py-6 text-center">{message}</p>;
}

function isOperationallyEmpty(d: AdminDashboardData): boolean {
  return (
    d.recentApplications.length === 0 &&
    d.recentStudents.length === 0 &&
    d.topPrograms.length === 0
  );
}

function DegradedBanner({ sections }: { sections: string[] }) {
  return (
    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6">
      <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-sm font-semibold text-amber-800">Some sections unavailable</p>
        <p className="text-xs text-amber-700 mt-0.5">{sections.join(", ")} could not load.</p>
      </div>
    </div>
  );
}

function HealthBadge({ health }: { health: SystemHealth }) {
  const ok = health.status === "ok";
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${ok ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
      {ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
      {ok ? "All systems operational" : (health.message ?? "Degraded")}
    </span>
  );
}

function SectionCard({ title, href, hrefLabel = "View all", children }: {
  title: string; href?: string; hrefLabel?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        {href && (
          <Link href={href} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-blue-600 hover:text-brand-blue-700">
            {hrefLabel} <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  );
}

function QuickLink({ href, title, sub, badge }: {
  href: string; title: string; sub: string; badge?: string;
}) {
  return (
    <Link href={href} className="group flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-brand-blue-300 hover:shadow-sm transition-all">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate">{title}</p>
        <p className="text-xs text-slate-400 truncate">{sub}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {badge && <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-blue-500 transition-colors" />
      </div>
    </Link>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
export function DashboardShell({ data }: { data: AdminDashboardData }) {
  const updatedAt = new Date(data.generatedAt).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });

  const {
    pendingApplications, activeEnrollments,
    revenueThisMonthCents, certificatesIssued,
    pendingProgramHolders, pendingDocuments,
  } = data.counts;

  const maxEnrollments = Math.max(...data.topPrograms.map(p => p.learners), 1);

  return (
    <div className="pb-24">

      {/* PAGE HEADER — no image, no hero */}
      <div className="border-b border-slate-100 bg-white px-4 sm:px-6 lg:px-8 py-6 max-w-screen-xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Operations Center</p>
            <AdminGreeting className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight" />
            <p className="text-xs text-slate-400 mt-1">Last updated {updatedAt}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {data.systemHealth && <HealthBadge health={data.systemHealth} />}
            {pendingApplications > 0 && (
              <Link href="/admin/applications" className="inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-bold px-4 py-2 rounded-full transition-colors">
                <Bell className="w-3.5 h-3.5" /> {pendingApplications} pending
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">

        {(data.degradedSections ?? []).length > 0 && (
          <div className="mt-6"><DegradedBanner sections={data.degradedSections ?? []} /></div>
        )}

        {/* URGENT CTAs */}
        {(pendingProgramHolders > 0 || pendingDocuments > 0) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {pendingProgramHolders > 0 && (
              <Link href="/admin/program-holders" className="inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-colors shadow-sm">
                <span className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
                {pendingProgramHolders} program holder{pendingProgramHolders !== 1 ? "s" : ""} pending approval
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {pendingDocuments > 0 && (
              <Link href="/admin/program-holder-documents" className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-colors shadow-sm">
                <span className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
                {pendingDocuments} document{pendingDocuments !== 1 ? "s" : ""} to review
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}

        {/* KPI CARDS */}
        <div className="mt-8"><KpiGrid kpis={data.kpis} /></div>

        {/* SPARKLINE + SYSTEM HEALTH */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnrollmentSparkline data={data.enrollmentTrend} />
          <SystemHealthPanel health={data.systemHealth} />
        </div>

        {/* PENDING SUBMISSIONS */}
        {data.pendingSubmissions.length > 0 && (
          <div className="mt-6">
            <SectionCard
              title="Pending Lab & Assignment Sign-Offs"
              href="/instructor/submissions"
              hrefLabel={`Review all ${data.pendingSubmissions.length}`}
            >
              <div className="divide-y divide-slate-50">
                {data.pendingSubmissions.slice(0, 6).map((s) => {
                  const age = s.submitted_at
                    ? Math.floor((Date.now() - new Date(s.submitted_at).getTime()) / 86_400_000)
                    : 0;
                  return (
                    <div key={s.id} className="flex items-center justify-between py-3 gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <ClipboardList className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate capitalize">
                            {s.step_type ?? "Submission"} — sign-off needed
                          </p>
                          <p className="text-xs text-slate-400">{fmtAge(age)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <StatusPill status={s.status} />
                        <Link
                          href={`/instructor/submissions`}
                          className="text-xs font-semibold text-brand-blue-600 hover:text-brand-blue-700 flex items-center gap-0.5"
                        >
                          Review <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>
        )}

        {/* QUICK NAV */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <QuickLink href="/admin/applications"    title="Applications"    sub={`${pendingApplications} pending`}                                                              badge={pendingApplications > 0 ? String(pendingApplications) : undefined} />
          <QuickLink href="/admin/students"        title="Students"        sub={`${fmtNum(activeEnrollments)} active`} />
          <QuickLink href="/admin/programs"        title="Programs"        sub="Manage curriculum" />
          <QuickLink href="/admin/analytics"       title="Analytics"       sub="Enrollment & revenue" />
          <QuickLink href="/admin/program-holders" title="Program Holders" sub={pendingProgramHolders > 0 ? `${pendingProgramHolders} pending` : "Manage holders"}             badge={pendingProgramHolders > 0 ? String(pendingProgramHolders) : undefined} />
          <QuickLink href="/admin/settings"        title="Settings"        sub="System configuration" />
        </div>

        {/* APPLICATIONS + QUICK STATS */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SectionCard title="Recent Applications" href="/admin/applications" hrefLabel="Review all">
              {data.recentApplications.length === 0 ? <Empty message="No applications yet." /> : (
                <div className="divide-y divide-slate-50">
                  {data.recentApplications.slice(0, 8).map(app => {
                    const name = [app.first_name, app.last_name].filter(Boolean).join(" ") || app.email || "Applicant";
                    const age  = Math.floor((Date.now() - new Date(app.submitted_at ?? app.created_at).getTime()) / 86_400_000);
                    return (
                      <div key={app.id} className="flex items-center justify-between py-3 gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-brand-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-brand-blue-700">{name[0]?.toUpperCase() ?? "?"}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
                            <p className="text-xs text-slate-400 truncate">{app.program_interest ?? "—"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <StatusPill status={app.status} />
                          <span className="text-xs text-slate-400 hidden sm:block">{fmtAge(age)}</span>
                          <Link href={`/admin/applications/review/${app.id}`} className="text-xs font-semibold text-brand-blue-600 hover:text-brand-blue-700 flex items-center gap-0.5">
                            Review <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </SectionCard>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6">
            <SectionCard title="Quick Stats">
              <div className="space-y-3">
                {([
                  { label: "Active enrollments",     value: fmtNum(activeEnrollments),     href: "/admin/students",                 Icon: Users,      urgent: false },
                  { label: "Revenue this month",      value: fmtUsd(revenueThisMonthCents), href: "/admin/analytics/revenue",        Icon: DollarSign, urgent: false },
                  { label: "Certificates issued",     value: fmtNum(certificatesIssued),    href: "/admin/certificates",             Icon: Award,      urgent: false },
                  { label: "Program holders pending", value: fmtNum(pendingProgramHolders), href: "/admin/program-holders",          Icon: Building2,  urgent: pendingProgramHolders > 0 },
                  { label: "Documents to review",     value: fmtNum(pendingDocuments),      href: "/admin/program-holder-documents", Icon: FileText,   urgent: pendingDocuments > 0 },
                ] as const).map(({ label, value, href, Icon, urgent }) => (
                  <Link key={label} href={href} className="flex items-center justify-between group py-1.5">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${urgent ? "text-amber-500" : "text-slate-400"}`} />
                      <span className={`text-sm ${urgent ? "font-semibold text-amber-700" : "text-slate-600"}`}>{label}</span>
                    </div>
                    <span className={`text-sm font-bold ${urgent ? "text-amber-600" : "text-slate-900"}`}>{value}</span>
                  </Link>
                ))}
              </div>
            </SectionCard>

            {data.inactiveLearners.length > 0 && (
              <SectionCard title="At-Risk Learners" href="/admin/retention" hrefLabel={`View all ${data.inactiveLearners.length}`}>
                <div className="space-y-2">
                  {data.inactiveLearners.slice(0, 5).map(l => (
                    <div key={l.userId} className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{l.fullName || l.email}</p>
                        <p className="text-xs text-slate-400">{l.daysInactive}d inactive · {l.programTitle ?? "—"}</p>
                      </div>
                      <Link href={`/admin/students/${l.userId}`} className="text-xs text-brand-blue-600 hover:underline flex-shrink-0 ml-2">View</Link>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
          </div>
        </div>

        {/* TOP PROGRAMS + RECENT STUDENTS */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard title="Top Programs by Enrollment" href="/admin/programs">
            {data.topPrograms.length === 0 ? <Empty message="No program data yet." /> : (
              <div className="space-y-3">
                {data.topPrograms.map(p => (
                  <div key={p.id ?? p.title} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-slate-800 truncate">{p.title}</p>
                        <span className="text-xs font-bold text-slate-600 ml-2 flex-shrink-0">{fmtNum(p.learners)}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-blue-500 rounded-full" style={{ width: `${Math.round((p.learners / maxEnrollments) * 100)}%` }} />
                      </div>
                    </div>
                    {p.id && (
                      <Link href={`/admin/programs/${p.id}`} className="flex-shrink-0 text-slate-400 hover:text-brand-blue-600">
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Recent Students" href="/admin/students">
            {data.recentStudents.length === 0 ? <Empty message="No recent students." /> : (
              <div className="divide-y divide-slate-50">
                {data.recentStudents.slice(0, 8).map(s => (
                  <div key={s.id} className="flex items-center justify-between py-2.5 gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-emerald-700">{(s.full_name || s.email || "?")[0].toUpperCase()}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{s.full_name || s.email}</p>
                        <p className="text-xs text-slate-400">{fmtDate(s.created_at)}</p>
                      </div>
                    </div>
                    <Link href={`/admin/students/${s.id}`} className="text-xs font-semibold text-brand-blue-600 hover:text-brand-blue-700 flex-shrink-0">View</Link>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* BLOCKED PROGRAMS */}
        {data.blockedPrograms.length > 0 && (
          <div className="mt-6">
            <SectionCard title="Blocked Programs" href="/admin/programs" hrefLabel="Manage programs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.blockedPrograms.map(p => (
                  <div key={p.id} className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-100 rounded-xl">
                    <ShieldAlert className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-rose-900 truncate">{p.title}</p>
                      <p className="text-xs text-rose-600 mt-0.5">{p.reason}</p>
                    </div>
                    <Link href={`/admin/programs/${p.id}`} className="text-xs font-semibold text-rose-700 hover:text-rose-800 flex-shrink-0">
                      Fix <ArrowRight className="w-3 h-3 inline" />
                    </Link>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {/* SECONDARY QUICK LINKS */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickLink href="/admin/analytics/learning" title="Learning Analytics" sub="Completion & engagement" />
          <QuickLink href="/admin/analytics/programs" title="Program Analytics"  sub="Enrollment trends" />
          <QuickLink href="/admin/certificates"       title="Certificates"       sub={`${fmtNum(certificatesIssued)} issued`} />
          <QuickLink href="/admin/activity"           title="Activity Log"       sub="Recent system events" />
        </div>

        {/* EMPTY STATE */}
        {isOperationallyEmpty(data) && (
          <div className="mt-16 text-center">
            <GraduationCap className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-3">No operational data yet</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8">Once students enroll and applications come in, this dashboard will populate automatically.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/admin/programs/new" className="inline-flex items-center gap-2 bg-brand-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-blue-700 transition-colors">
                <BookOpen className="w-4 h-4" /> Create a Program
              </Link>
              <Link href="/admin/students/invite" className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                <Users className="w-4 h-4" /> Invite Students
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
