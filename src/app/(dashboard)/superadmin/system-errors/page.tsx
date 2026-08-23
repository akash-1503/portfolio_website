"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

/* =========================================================
   TYPES
========================================================= */

type ErrorSeverity =
  | "INFO"
  | "WARNING"
  | "ERROR"
  | "CRITICAL";

type ErrorStatus =
  | "ALL"
  | "OPEN"
  | "RESOLVED";

interface SystemError {
  id: string;

  message: string;

  errorType?: string | null;

  endpoint?: string | null;

  method?: string | null;

  statusCode?: number | null;

  severity: ErrorSeverity;

  resolved: boolean;

  resolvedAt?: string | null;

  resolvedById?: string | null;

  requestId?: string | null;

  metadata?: unknown;

  ngoId?: string | null;

  userId?: string | null;

  stack?: string | null;

  createdAt: string;

  ngo?: {
    id: string;
    name: string;
  } | null;

  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;

  resolvedBy?: {
    id: string;
    name: string;
    email: string;
    role?: string;
  } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Statistics {
  open: number;
  critical: number;
  error: number;
  resolved: number;
}

interface SystemErrorsResponse {
  success: boolean;

  message?: string;

  data?: {
    errors: SystemError[];

    pagination: Pagination;

    statistics: Statistics;
  };
}

/* =========================================================
   DEFAULT STATISTICS
========================================================= */

const DEFAULT_STATISTICS: Statistics = {
  open: 0,
  critical: 0,
  error: 0,
  resolved: 0,
};

/* =========================================================
   PAGE
========================================================= */

export default function SystemErrorsPage() {
  const router = useRouter();

  /* =======================================================
     STATE
  ======================================================= */

  const [errors, setErrors] =
    useState<SystemError[]>([]);

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [statistics, setStatistics] =
    useState<Statistics>(
      DEFAULT_STATISTICS
    );

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<ErrorStatus>("ALL");

  const [severity, setSeverity] =
    useState<
      ErrorSeverity | "ALL"
    >("ALL");

  const [page, setPage] =
    useState(1);

  const limit = 20;

  /* =========================================================
     LOAD SYSTEM ERRORS
  ========================================================= */

  const loadErrors = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setErrorMessage("");

        /* ---------------------------------------------------
           QUERY PARAMETERS
        --------------------------------------------------- */

        const params =
          new URLSearchParams();

        params.set(
          "page",
          String(page)
        );

        params.set(
          "limit",
          String(limit)
        );

        if (search.trim()) {
          params.set(
            "search",
            search.trim()
          );
        }

        if (status !== "ALL") {
          params.set(
            "status",
            status
          );
        }

        if (severity !== "ALL") {
          params.set(
            "severity",
            severity
          );
        }

        /* ---------------------------------------------------
           API REQUEST
        --------------------------------------------------- */

        const response =
          await fetch(
            `/api/superadmin/system-errors?${params.toString()}`,
            {
              method: "GET",

              credentials: "include",

              cache: "no-store",

              headers: {
                Accept:
                  "application/json",
              },
            }
          );

        /* ---------------------------------------------------
           CONTENT TYPE
        --------------------------------------------------- */

        const contentType =
          response.headers.get(
            "content-type"
          );

        if (
          !contentType?.includes(
            "application/json"
          )
        ) {
          const text =
            await response.text();

          console.error(
            "NON-JSON SYSTEM ERRORS RESPONSE:",
            text
          );

          throw new Error(
            "Invalid server response."
          );
        }

        /* ---------------------------------------------------
           PARSE RESPONSE
        --------------------------------------------------- */

        const result =
          (await response.json()) as SystemErrorsResponse;

        console.log(
          "SYSTEM ERRORS RESPONSE:",
          result
        );

        /* ---------------------------------------------------
           API ERROR
        --------------------------------------------------- */

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Failed to load system errors."
          );
        }

        /* ---------------------------------------------------
           DATA
        --------------------------------------------------- */

        const data =
          result.data;

        setErrors(
          data?.errors ?? []
        );

        setPagination(
          data?.pagination ?? null
        );

        setStatistics(
          data?.statistics ??
            DEFAULT_STATISTICS
        );
      } catch (error) {
        console.error(
          "SYSTEM ERRORS PAGE ERROR:",
          error
        );

        /*
         * Do not expose raw server/database
         * errors to the end user.
         */

        setErrorMessage(
          "Unable to load system errors. Please try again."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [
      page,
      search,
      status,
      severity,
    ]
  );

  /* =========================================================
     INITIAL / FILTER LOAD
  ========================================================= */

  useEffect(() => {
    loadErrors();
  }, [loadErrors]);

  /* =========================================================
     SEARCH
  ========================================================= */

  function handleSearchChange(
    value: string
  ) {
    setSearch(value);
    setPage(1);
  }

  /* =========================================================
     STATUS FILTER
  ========================================================= */

  function handleStatusChange(
    value: string
  ) {
    if (
      value === "ALL" ||
      value === "OPEN" ||
      value === "RESOLVED"
    ) {
      setStatus(
        value as ErrorStatus
      );

      setPage(1);
    }
  }

  /* =========================================================
     SEVERITY FILTER
  ========================================================= */

  function handleSeverityChange(
    value: string
  ) {
    if (
      value === "ALL" ||
      value === "INFO" ||
      value === "WARNING" ||
      value === "ERROR" ||
      value === "CRITICAL"
    ) {
      setSeverity(
        value as
          | ErrorSeverity
          | "ALL"
      );

      setPage(1);
    }
  }

  /* =========================================================
     VIEW ERROR
  ========================================================= */

  function viewError(
    errorId: string
  ) {
    if (!errorId) {
      console.error(
        "Cannot open system error: ID missing."
      );

      return;
    }

    router.push(
      `/superadmin/system-errors/${encodeURIComponent(
        errorId
      )}`
    );
  }

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  function clearFilters() {
    setSearch("");
    setStatus("ALL");
    setSeverity("ALL");
    setPage(1);
  }

  /* =========================================================
     PREVIOUS PAGE
  ========================================================= */

  function goToPreviousPage() {
    setPage((current) =>
      Math.max(
        current - 1,
        1
      )
    );
  }

  /* =========================================================
     NEXT PAGE
  ========================================================= */

  function goToNextPage() {
    if (!pagination) {
      return;
    }

    setPage((current) =>
      Math.min(
        current + 1,
        pagination.totalPages
      )
    );
  }

  /* =========================================================
     LOADING STATE
  ========================================================= */

  if (
    loading &&
    errors.length === 0
  ) {
    return (
      <div className="min-h-full p-6">
        <div className="mx-auto max-w-7xl">

          <PageHeader />

          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border bg-white">
            <div className="text-center">

              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-green-600" />

              <p className="text-sm text-slate-500">
                Loading system errors...
              </p>

            </div>
          </div>

        </div>
      </div>
    );
  }

  /* =========================================================
     INITIAL ERROR STATE
  ========================================================= */

  if (
    errorMessage &&
    errors.length === 0
  ) {
    return (
      <div className="min-h-full p-6">
        <div className="mx-auto max-w-7xl">

          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

            <h2 className="text-lg font-semibold text-red-800">
              Failed to load system errors
            </h2>

            <p className="mt-2 text-sm text-red-700">
              {errorMessage}
            </p>

            <div className="mt-5 flex gap-3">

              <button
                type="button"
                onClick={() =>
                  loadErrors(true)
                }
                disabled={refreshing}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {refreshing
                  ? "Trying..."
                  : "Try Again"}
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/superadmin"
                  )
                }
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Back
              </button>

            </div>

          </div>

        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <div className="min-h-full p-6">

      <div className="mx-auto max-w-7xl space-y-6">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

          <PageHeader />

          <button
            type="button"
            onClick={() =>
              loadErrors(true)
            }
            disabled={refreshing}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Open Errors"
            value={statistics.open}
            description="Currently unresolved"
          />

          <StatCard
            title="Critical"
            value={
              statistics.critical
            }
            description="Requires immediate attention"
          />

          <StatCard
            title="Errors"
            value={
              statistics.error
            }
            description="Unresolved ERROR severity"
          />

          <StatCard
            title="Resolved"
            value={
              statistics.resolved
            }
            description="Successfully resolved"
          />

        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="grid gap-4 md:grid-cols-3">

            {/* SEARCH */}

            <div>

              <label
                htmlFor="system-error-search"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
              >
                Search
              </label>

              <input
                id="system-error-search"
                type="text"
                value={search}
                onChange={(e) =>
                  handleSearchChange(
                    e.target.value
                  )
                }
                placeholder="Search message, endpoint or error type..."
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />

            </div>

            {/* STATUS */}

            <div>

              <label
                htmlFor="system-error-status"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
              >
                Status
              </label>

              <select
                id="system-error-status"
                value={status}
                onChange={(e) =>
                  handleStatusChange(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >

                <option value="ALL">
                  All Status
                </option>

                <option value="OPEN">
                  Open
                </option>

                <option value="RESOLVED">
                  Resolved
                </option>

              </select>

            </div>

            {/* SEVERITY */}

            <div>

              <label
                htmlFor="system-error-severity"
                className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
              >
                Severity
              </label>

              <select
                id="system-error-severity"
                value={severity}
                onChange={(e) =>
                  handleSeverityChange(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              >

                <option value="ALL">
                  All Severity
                </option>

                <option value="INFO">
                  Info
                </option>

                <option value="WARNING">
                  Warning
                </option>

                <option value="ERROR">
                  Error
                </option>

                <option value="CRITICAL">
                  Critical
                </option>

              </select>

            </div>

          </div>

          <div className="mt-4 flex justify-end">

            <button
              type="button"
              onClick={
                clearFilters
              }
              className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              Clear Filters
            </button>

          </div>

        </div>

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* =================================================
            ERROR TABLE
        ================================================= */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-5 py-4">

            <h2 className="font-semibold text-slate-900">
              Error Logs
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {pagination?.total ?? 0}{" "}
              total errors
            </p>

          </div>

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {errors.length === 0 ? (

            <div className="flex min-h-[250px] items-center justify-center">

              <div className="text-center">

                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-xl font-semibold text-green-600">
                  ✓
                </div>

                <h3 className="font-semibold text-slate-900">
                  No system errors found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  No errors match your current
                  filters.
                </p>

              </div>

            </div>

          ) : (

            /* =================================================
               TABLE
            ================================================= */

            <div className="overflow-x-auto">

              <table className="w-full min-w-[950px]">

                <thead className="bg-slate-50">

                  <tr className="border-b border-slate-200 text-left">

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Error
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Severity
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Endpoint
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      NGO
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Created
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {errors.map(
                    (error) => (
                      <tr
                        key={
                          error.id
                        }
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                      >

                        {/* ERROR */}

                        <td className="max-w-[300px] px-5 py-4">

                          <div
                            title={
                              error.message
                            }
                            className="truncate font-medium text-slate-900"
                          >
                            {error.message}
                          </div>

                          {error.errorType && (
                            <div className="mt-1 truncate text-xs text-slate-400">
                              {error.errorType}
                            </div>
                          )}

                          {error.requestId && (
                            <div className="mt-1 truncate text-xs text-slate-400">
                              Request:{" "}
                              {error.requestId}
                            </div>
                          )}

                        </td>

                        {/* SEVERITY */}

                        <td className="px-5 py-4">

                          <SeverityBadge
                            severity={
                              error.severity
                            }
                          />

                        </td>

                        {/* ENDPOINT */}

                        <td className="max-w-[280px] px-5 py-4">

                          <div className="text-xs">

                            {error.method && (
                              <span className="mr-2 font-semibold text-slate-600">
                                {
                                  error.method
                                }
                              </span>
                            )}

                            <span className="break-all text-slate-500">
                              {error.endpoint ||
                                "—"}
                            </span>

                          </div>

                          {error.statusCode !==
                            null &&
                            error.statusCode !==
                              undefined && (
                              <div className="mt-1 text-xs text-slate-400">
                                HTTP{" "}
                                {
                                  error.statusCode
                                }
                              </div>
                            )}

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <StatusBadge
                            status={
                              error.resolved
                                ? "RESOLVED"
                                : "OPEN"
                            }
                          />

                        </td>

                        {/* NGO */}

                        <td className="max-w-[180px] px-5 py-4">

                          <span
                            title={
                              error.ngo
                                ?.name ||
                              "System"
                            }
                            className="block truncate text-sm text-slate-600"
                          >
                            {error.ngo
                              ?.name ||
                              "System"}
                          </span>

                        </td>

                        {/* CREATED */}

                        <td className="whitespace-nowrap px-5 py-4">

                          <span className="text-sm text-slate-500">
                            {formatDate(
                              error.createdAt
                            )}
                          </span>

                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4">

                          <button
                            type="button"
                            onClick={() =>
                              viewError(
                                error.id
                              )
                            }
                            className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-700"
                          >
                            View
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

          {/* =================================================
              PAGINATION
          ================================================= */}

          {pagination &&
            pagination.totalPages > 0 && (
              <div className="flex flex-col justify-between gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center">

                <p className="text-sm text-slate-500">

                  Page{" "}

                  <span className="font-medium text-slate-900">
                    {
                      pagination.page
                    }
                  </span>

                  {" "}of{" "}

                  <span className="font-medium text-slate-900">
                    {
                      pagination.totalPages
                    }
                  </span>

                </p>

                <div className="flex gap-2">

                  <button
                    type="button"
                    disabled={
                      pagination.page <=
                      1
                    }
                    onClick={
                      goToPreviousPage
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={
                      pagination.page >=
                      pagination.totalPages
                    }
                    onClick={
                      goToNextPage
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>

                </div>

              </div>
            )}

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   PAGE HEADER
========================================================= */

function PageHeader() {
  return (
    <div>
      <p className="text-sm font-medium text-green-600">
        Super Admin
      </p>

      <h1 className="mt-1 text-3xl font-bold text-slate-900">
        System Errors
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Monitor, investigate and resolve
        application errors.
      </p>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>

    </div>
  );
}

/* =========================================================
   SEVERITY BADGE
========================================================= */

function SeverityBadge({
  severity,
}: {
  severity: ErrorSeverity;
}) {
  const classes: Record<
    ErrorSeverity,
    string
  > = {
    INFO:
      "bg-blue-100 text-blue-700",

    WARNING:
      "bg-yellow-100 text-yellow-700",

    ERROR:
      "bg-orange-100 text-orange-700",

    CRITICAL:
      "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes[severity]}`}
    >
      {severity}
    </span>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}: {
  status:
    | "OPEN"
    | "RESOLVED";
}) {
  const isResolved =
    status === "RESOLVED";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        isResolved
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {status}
    </span>
  );
}

/* =========================================================
   DATE FORMATTER
========================================================= */

function formatDate(
  value: string
): string {
  try {
    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleString(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  } catch { 
    return value;
  }
}