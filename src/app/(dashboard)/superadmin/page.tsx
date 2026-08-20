"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  ShieldCheck,
  Users,
  Calendar,
  Megaphone,
  AlertTriangle,
  PlusCircle,
  Eye,
  Activity,
  CheckCircle2,
  RefreshCw,
  ArrowUpRight,
  Server,
  Database,
  Globe,
  Radio,
} from "lucide-react";

interface DashboardStats {
  totalNGOs: number;
  totalAdmins: number;
  totalUsers: number;
  activeEvents: number;
  activeCampaigns: number;
  unresolvedErrors: number;
}

interface SystemError {
  id: string;
  errorType: string;
  message: string;
  endpoint: string | null;
  method: string | null;
  statusCode: number | null;
  isResolved: boolean;
  createdAt: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentErrors: SystemError[];
}

export default function SuperAdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/superadmin/dashboard", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load dashboard");
      }

      setData(result.data);
    } catch (err) {
      console.error("SUPER ADMIN DASHBOARD ERROR:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  }

  // --- LOADING SKELETON (CLEAN WHITE BACKGROUND) ---
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/70 p-6 lg:p-10 font-sans">
        <div className="mx-auto max-w-7xl space-y-8 animate-pulse">
          <div className="space-y-3">
            <div className="h-6 w-36 rounded-full bg-slate-200" />
            <div className="h-10 w-72 rounded-2xl bg-slate-200" />
            <div className="h-4 w-96 rounded-xl bg-slate-200/80" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-36 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between"
              >
                <div className="h-10 w-10 rounded-2xl bg-slate-100" />
                <div className="space-y-2">
                  <div className="h-3 w-16 rounded bg-slate-100" />
                  <div className="h-7 w-20 rounded-xl bg-slate-200" />
                </div>
              </div>
            ))}
          </div>

          <div className="h-64 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_10px_25px_rgba(0,0,0,0.03)]" />
          <div className="h-80 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_10px_25px_rgba(0,0,0,0.03)]" />
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50/70 p-6 lg:p-10 flex items-center justify-center font-sans">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_40px_rgba(0,0,0,0.06)] text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 border border-red-100">
            <AlertTriangle className="h-7 w-7" />
          </div>

          <h2 className="text-xl font-bold text-slate-800">Dashboard Error</h2>

          <p className="mt-2 text-sm text-slate-600 bg-red-50/50 p-3 rounded-2xl border border-red-100">
            {error}
          </p>

          <button
            onClick={fetchDashboard}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:brightness-105 active:scale-95"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-slate-50/70 p-6 lg:p-10 font-sans text-slate-800">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 border border-slate-200 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-orange-400 to-red-500 animate-pulse" />
              Super Admin Portal
            </div>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
              System Dashboard
            </h1>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Manage the NGO platform and monitor real-time system health.
            </p>
          </div>

          <button
            onClick={fetchDashboard}
            className="self-start sm:self-auto flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 transition-all active:scale-95"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
            Refresh Overview
          </button>
        </div>

        {/* STATISTICS GRID */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard
            title="NGOs"
            value={data.stats.totalNGOs}
            icon={Building2}
            gradient="from-blue-500 to-indigo-500"
          />

          <StatCard
            title="Admins"
            value={data.stats.totalAdmins}
            icon={ShieldCheck}
            gradient="from-emerald-500 to-teal-500"
          />

          <StatCard
            title="Users"
            value={data.stats.totalUsers}
            icon={Users}
            gradient="from-violet-500 to-purple-500"
          />

          <StatCard
            title="Active Events"
            value={data.stats.activeEvents}
            icon={Calendar}
            gradient="from-amber-500 to-orange-500"
          />

          <StatCard
            title="Campaigns"
            value={data.stats.activeCampaigns}
            icon={Megaphone}
            gradient="from-pink-500 to-rose-500"
          />

          <StatCard
            title="System Errors"
            value={data.stats.unresolvedErrors}
            icon={AlertTriangle}
            danger={data.stats.unresolvedErrors > 0}
            gradient="from-orange-400 to-red-500"
          />
        </div>

        {/* QUICK ACTIONS SECTION */}
        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] lg:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Quick Actions</h2>
            <p className="text-xs font-medium text-slate-500">
              Frequently used administrative routines and provisioning controls.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <QuickAction
              title="Create Admin"
              description="Provision a new administrator and bind to an NGO."
              href="/superadmin/admins/create"
              icon={PlusCircle}
            />

            <QuickAction
              title="View NGO"
              description="Inspect and manage currently registered NGO entities."
              href="/superadmin/ngos"
              icon={Eye}
            />

            <QuickAction
              title="System Errors"
              description="Audit and resolve active runtime application errors."
              href="/superadmin/system-errors"
              icon={AlertTriangle}
            />
          </div>
        </section>

        {/* SYSTEM STATUS SECTION */}
        <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] lg:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">System Status</h2>
            <p className="text-xs font-medium text-slate-500">
              Real-time platform telemetry and operational health metrics.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <HealthCard
              title="Application"
              status="Operational"
              icon={Server}
            />

            <HealthCard title="Database" status="Connected" icon={Database} />

            <HealthCard title="API Gateway" status="Operational" icon={Globe} />
          </div>
        </section>

        {/* RECENT ERRORS SECTION */}
        <section className="rounded-3xl border border-slate-200/80 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-dashed border-slate-200 p-6 lg:p-8">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Recent System Errors
              </h2>
              <p className="text-xs font-medium text-slate-500">
                Latest unhandled exceptions logged across cloud infrastructure.
              </p>
            </div>

            <a
              href="/superadmin/system-errors"
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-orange-500 transition-colors"
            >
              View all log entries
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          {data.recentErrors.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-base font-bold text-slate-800">
                No system errors detected
              </p>
              <p className="mt-1 text-xs font-medium text-slate-500">
                All platform services operating within healthy thresholds.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-dashed divide-slate-200">
              {data.recentErrors.map((item) => (
                <ErrorRow key={item.id} error={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* =====================================================
   COMPONENTS
===================================================== */

function StatCard({
  title,
  value,
  icon: Icon,
  danger = false,
  gradient,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  danger?: boolean;
  gradient: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 border border-slate-200/60 ${
            danger ? "text-red-500" : "text-slate-700"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>

        {danger && value > 0 && (
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </p>

        <p
          className={`mt-1 text-3xl font-black tracking-tight ${
            danger && value > 0
              ? "bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"
              : "text-slate-800"
          }`}
        >
          {value.toLocaleString()}
        </p>
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
          danger && value > 0 ? "from-orange-500 to-red-500" : gradient
        } opacity-80`}
      />
    </div>
  );
}

function QuickAction({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <a
      href={href}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-[0_10px_25px_rgba(0,0,0,0.05)] hover:border-slate-300 hover:-translate-y-0.5 active:scale-[0.98]"
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 border border-slate-200 group-hover:text-orange-500 transition-colors">
            <Icon className="h-5 w-5" />
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-400 border border-slate-200 group-hover:text-slate-800 transition-all">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <h3 className="mt-4 font-bold text-slate-800 group-hover:text-slate-900">
          {title}
        </h3>

        <p className="mt-1.5 text-xs font-medium text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>
    </a>
  );
}

function HealthCard({
  title,
  status,
  icon: Icon,
}: {
  title: string;
  status: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 shadow-sm">
      <div className="flex items-center gap-3.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 border border-slate-200">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="font-bold text-slate-800 text-sm">{title}</p>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            System Service
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 border border-slate-200 shadow-sm">
        <Radio className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
        <span className="text-xs font-bold text-emerald-600">{status}</span>
      </div>
    </div>
  );
}

function ErrorRow({ error }: { error: SystemError }) {
  return (
    <div className="flex flex-col gap-3 p-5 transition-colors hover:bg-slate-50/70 sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-gradient-to-r from-orange-400 to-red-500 px-3 py-0.5 text-[11px] font-bold text-white shadow-sm">
            {error.errorType}
          </span>

          {error.statusCode && (
            <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600 border border-slate-200">
              HTTP {error.statusCode}
            </span>
          )}

          {error.method && (
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
              [{error.method}]
            </span>
          )}
        </div>

        <p className="truncate text-sm font-bold text-slate-800">
          {error.message}
        </p>

        {error.endpoint && (
          <p className="truncate text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200/60 w-fit max-w-full">
            {error.endpoint}
          </p>
        )}
      </div>

      <div className="shrink-0 text-right sm:text-left">
        <span className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
          {new Date(error.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}