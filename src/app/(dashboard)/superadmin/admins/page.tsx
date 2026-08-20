"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  AlertTriangle,
  UserPlus,
  Eye,
  Power,
  User,
  Building2,
  Users,
  Loader2,
  CalendarDays,
  RefreshCw,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

interface AdminNGO {
  id: string;
  name: string;
  city?: string | null;
  state?: string | null;
}

interface Admin {
  id: string;
  name: string | null;
  email: string;
  phone?: string | null;
  role: string;
  ngoId: string | null;
  status?: string | null;
  isDeleted?: boolean;
  createdAt: string;

  ngo: AdminNGO | null;
}

interface AdminApiResponse {
  success: boolean;
  message?: string;
  data?: {
    admins?: Admin[];
    total?: number;
  };
}

/* =========================================================
   PAGE
========================================================= */

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  /* =======================================================
     LOAD ADMINS
  ======================================================= */

  const loadAdmins = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/superadmin/admins", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      /*
       * Prevent:
       * Unexpected token '<', "<!DOCTYPE "... is not valid JSON
       *
       * We first read the response as text and then safely parse JSON.
       */

      const contentType =
        response.headers.get("content-type") || "";

      const rawResponse = await response.text();

      let result: AdminApiResponse;

      try {
        result = JSON.parse(rawResponse);
      } catch {
        console.error(
          "ADMIN API RETURNED NON-JSON:",
          rawResponse
        );

        throw new Error(
          `Admin API returned ${response.status} instead of JSON.`
        );
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            `Failed to load administrators. API status: ${response.status}`
        );
      }

      /*
       * IMPORTANT:
       * Never directly do:
       *
       * result.data.admins
       *
       * without checking data.
       */

      const fetchedAdmins =
        Array.isArray(result.data?.admins)
          ? result.data.admins
          : [];

      setAdmins(fetchedAdmins);

      console.log(
        "SUPER ADMIN ADMINS:",
        fetchedAdmins
      );

      /*
       * This helps detect an API routing problem.
       */

      if (
        !contentType.toLowerCase().includes("application/json")
      ) {
        console.warn(
          "Admin API did not explicitly return application/json."
        );
      }
    } catch (error) {
      console.error(
        "LOAD ADMINS ERROR:",
        error
      );

      setAdmins([]);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load administrators."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  /* =======================================================
     DEACTIVATE ADMIN
  ======================================================= */

  async function deactivateAdmin(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this administrator? They will immediately lose access to the platform."
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `/api/superadmin/admins/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const rawResponse = await response.text();

      let result: {
        success: boolean;
        message?: string;
      };

      try {
        result = JSON.parse(rawResponse);
      } catch {
        console.error(
          "DEACTIVATE ADMIN NON-JSON RESPONSE:",
          rawResponse
        );

        throw new Error(
          `Deactivate API returned ${response.status} instead of JSON.`
        );
      }

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to deactivate admin."
        );
      }

      await loadAdmins();
    } catch (error) {
      console.error(
        "DEACTIVATE ADMIN ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to deactivate admin."
      );
    }
  }

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredAdmins = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    if (!searchValue) {
      return admins;
    }

    return admins.filter((admin) => {
      const searchableValue = [
        admin.name || "",
        admin.email || "",
        admin.phone || "",
        admin.role || "",
        admin.ngo?.name || "",
        admin.ngo?.id || "",
        admin.ngo?.city || "",
        admin.ngo?.state || "",
        admin.ngoId || "",
      ]
        .join(" ")
        .toLowerCase();

      return searchableValue.includes(
        searchValue
      );
    });
  }, [admins, search]);

  /* =======================================================
     COUNTS
  ======================================================= */

  const totalAdmins = admins.length;

  const assignedAdmins = admins.filter(
    (admin) => Boolean(admin.ngoId)
  ).length;

  const unassignedAdmins =
    admins.filter(
      (admin) => !admin.ngoId
    ).length;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-50/70 p-6 font-sans text-slate-800 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-orange-500" />
              Super Admin Portal
            </div>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
              Admin Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
              Manage platform administrators, view their
              assigned NGOs, monitor status, and control
              administrator access.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={loadAdmins}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading
                    ? "animate-spin"
                    : ""
                }`}
              />
              Refresh
            </button>

            <Link
              href="/superadmin/admins/create"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:brightness-105 active:scale-95"
            >
              <UserPlus className="h-4 w-4" />
              Create Admin
            </Link>

          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/80 p-4 text-sm text-red-600">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />

            <div className="flex-1">
              <p className="font-bold">
                Failed to load administrators
              </p>

              <p className="mt-1 font-medium">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={loadAdmins}
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-red-600 shadow-sm ring-1 ring-red-200 hover:bg-red-50"
            >
              Retry
            </button>
          </div>
        )}

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* TOTAL */}

          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Admins
                </p>

                <p className="mt-2 text-3xl font-extrabold text-slate-900">
                  {totalAdmins}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
                <Users className="h-6 w-6 text-orange-500" />
              </div>

            </div>
          </div>

          {/* ASSIGNED */}

          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  NGO Assigned
                </p>

                <p className="mt-2 text-3xl font-extrabold text-emerald-600">
                  {assignedAdmins}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                <Building2 className="h-6 w-6 text-emerald-500" />
              </div>

            </div>
          </div>

          {/* UNASSIGNED */}

          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Unassigned
                </p>

                <p className="mt-2 text-3xl font-extrabold text-slate-700">
                  {unassignedAdmins}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                <User className="h-6 w-6 text-slate-500" />
              </div>

            </div>
          </div>

        </div>

        {/* =================================================
            MAIN TABLE CARD
        ================================================= */}

        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.03)]">

          {/* SEARCH */}

          <div className="border-b border-slate-100 bg-slate-50/30 p-4 sm:p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="relative w-full max-w-xl">

                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search admin, email, phone, NGO, or NGO ID..."
                  className="w-full rounded-xl border border-slate-200/80 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-800 outline-none shadow-sm transition-all placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                />

              </div>

              <div className="text-sm font-semibold text-slate-500">
                {filteredAdmins.length}{" "}
                {filteredAdmins.length === 1
                  ? "administrator"
                  : "administrators"}
              </div>

            </div>

          </div>

          {/* =================================================
              TABLE
          ================================================= */}

          <div className="overflow-x-auto">

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-500">

                <Loader2 className="mb-4 h-8 w-8 animate-spin text-orange-500" />

                <p className="text-sm font-semibold">
                  Loading administrators...
                </p>

              </div>
            ) : filteredAdmins.length === 0 ? (

              <div className="flex flex-col items-center justify-center px-6 py-24 text-center">

                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-slate-100 bg-slate-50">
                  <Users className="h-8 w-8 text-slate-400" />
                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  No administrators found
                </h3>

                <p className="mt-1 max-w-md text-sm font-medium text-slate-500">
                  {search
                    ? "No administrators match your search criteria."
                    : "There are currently no ADMIN accounts in the system."}
                </p>

                {!search && (
                  <Link
                    href="/superadmin/admins/create"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-orange-500 transition-colors hover:text-orange-600"
                  >
                    Create your first admin
                    <UserPlus className="h-4 w-4" />
                  </Link>
                )}

              </div>

            ) : (

              <table className="w-full min-w-[1050px] text-left">

                <thead className="border-b border-slate-100 bg-slate-50/50">

                  <tr>

                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Administrator
                    </th>

                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Assigned NGO
                    </th>

                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      NGO ID
                    </th>

                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Created
                    </th>

                    <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredAdmins.map(
                    (admin) => {

                      const active =
                        !admin.isDeleted;

                      return (
                        <tr
                          key={admin.id}
                          className="group transition-colors hover:bg-slate-50/70"
                        >

                          {/* ADMIN */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange-100 bg-orange-50 text-orange-500">
                                <User className="h-5 w-5" />
                              </div>

                              <div className="min-w-0">

                                <p className="truncate text-sm font-bold text-slate-900">
                                  {admin.name ||
                                    "Unnamed Admin"}
                                </p>

                                <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                  <Mail className="h-3.5 w-3.5" />
                                  {admin.email}
                                </div>

                                {admin.phone && (
                                  <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                    <Phone className="h-3.5 w-3.5" />
                                    {admin.phone}
                                  </div>
                                )}

                              </div>

                            </div>

                          </td>

                          {/* NGO */}

                          <td className="px-6 py-5">

                            {admin.ngo ? (

                              <div className="flex items-center gap-2.5">

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                                  <Building2 className="h-4 w-4 text-emerald-500" />
                                </div>

                                <div>

                                  <p className="text-sm font-bold text-slate-800">
                                    {admin.ngo.name}
                                  </p>

                                  {(admin.ngo.city ||
                                    admin.ngo.state) && (
                                    <p className="mt-0.5 text-xs font-medium text-slate-400">
                                      {[
                                        admin.ngo.city,
                                        admin.ngo.state,
                                      ]
                                        .filter(Boolean)
                                        .join(", ")}
                                    </p>
                                  )}

                                </div>

                              </div>

                            ) : (

                              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-500">
                                <XCircle className="h-3.5 w-3.5" />
                                Unassigned
                              </span>

                            )}

                          </td>

                          {/* NGO ID */}

                          <td className="px-6 py-5">

                            {admin.ngoId ? (

                              <div>

                                <p className="font-mono text-xs font-bold text-slate-700">
                                  {admin.ngoId}
                                </p>

                                {admin.ngo && (
                                  <p className="mt-1 text-[11px] font-medium text-emerald-500">
                                    Connected
                                  </p>
                                )}

                              </div>

                            ) : (

                              <span className="text-xs font-medium text-slate-400">
                                —
                              </span>

                            )}

                          </td>

                          {/* STATUS */}

                          <td className="px-6 py-5">

                            {active ? (

                              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">

                                <CheckCircle2 className="h-3.5 w-3.5" />

                                Active

                              </div>

                            ) : (

                              <div className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">

                                <XCircle className="h-3.5 w-3.5" />

                                Inactive

                              </div>

                            )}

                          </td>

                          {/* CREATED */}

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">

                              <CalendarDays className="h-4 w-4 text-slate-400" />

                              {new Date(
                                admin.createdAt
                              ).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}

                            </div>

                          </td>

                          {/* ACTIONS */}

                          <td className="px-6 py-5">

                            <div className="flex items-center justify-end gap-2">

                              {active && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    deactivateAdmin(
                                      admin.id
                                    )
                                  }
                                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-red-600 shadow-sm transition-all hover:border-red-200 hover:bg-red-50"
                                >
                                  <Power className="h-3.5 w-3.5" />
                                  Deactivate
                                </button>
                              )}

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            )}

          </div>

        </div>

        {/* =================================================
            INFORMATION
        ================================================= */}

        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">

          <div className="flex items-start gap-3">

            <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />

            <div>

              <p className="text-sm font-bold text-blue-900">
                NGO assignment
              </p>

              <p className="mt-1 text-xs font-medium leading-5 text-blue-700">
                Each administrator is connected to an NGO
                through the administrator's{" "}
                <code className="rounded bg-blue-100 px-1 py-0.5 font-mono">
                  ngoId
                </code>
                . The NGO name and details shown above are
                loaded through the{" "}
                <code className="rounded bg-blue-100 px-1 py-0.5 font-mono">
                  User.ngoId → NGO.id
                </code>{" "}
                relation.
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}