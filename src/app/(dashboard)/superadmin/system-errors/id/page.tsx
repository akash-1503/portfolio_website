"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

/* =========================================================
   TYPES
========================================================= */

interface SystemError {
  id: string;

  message: string;

  errorType?: string | null;

  stack?: string | null;

  endpoint?: string | null;

  method?: string | null;

  statusCode?: number | null;

  severity: "INFO" | "WARNING" | "ERROR" | "CRITICAL";

  resolved: boolean;

  requestId?: string | null;

  metadata?: unknown;

  ngoId?: string | null;

  userId?: string | null;

  resolvedAt?: string | null;

  resolvedById?: string | null;

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
    role: string;
  } | null;
}

/* =========================================================
   PAGE
========================================================= */

export default function SystemErrorDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id =
    typeof params.id === "string"
      ? params.id
      : null;

  const [error, setError] =
    useState<SystemError | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [resolving, setResolving] =
    useState(false);

  /* =======================================================
     LOAD ERROR
  ======================================================= */

  const loadError = useCallback(async () => {
    if (!id) {
      setErrorMessage(
        "System error ID is missing."
      );

      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      console.log(
        "Loading system error:",
        id
      );

      const response = await fetch(
        `/api/superadmin/system-errors/${id}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      /*
       * Prevent JSON parsing errors if API
       * accidentally returns HTML.
       */

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
          "NON JSON API RESPONSE:",
          text
        );

        throw new Error(
          `API returned ${response.status} instead of JSON.`
        );
      }

      const result =
        await response.json();

      console.log(
        "SYSTEM ERROR RESPONSE:",
        result
      );

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to load system error."
        );
      }

      setError(
        result.data?.error ?? null
      );
    } catch (error) {
      console.error(
        "LOAD SYSTEM ERROR:",
        error
      );

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load system error."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  /* =======================================================
     EFFECT
  ======================================================= */

  useEffect(() => {
    loadError();
  }, [loadError]);

  /* =======================================================
     RESOLVE ERROR
  ======================================================= */

  async function resolveError() {
    if (!id || !error) {
      return;
    }

    if (error.resolved) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to mark this system error as resolved?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setResolving(true);

      const response =
        await fetch(
          `/api/superadmin/system-errors/${id}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials: "include",

           body: JSON.stringify({
  status: "RESOLVED",
}),
          }
        );

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
          "NON JSON PATCH RESPONSE:",
          text
        );

        throw new Error(
          `API returned ${response.status} instead of JSON.`
        );
      }

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to resolve system error."
        );
      }

      /*
       * Reload complete record so that
       * resolvedAt and resolvedById
       * are updated on screen.
       */

      await loadError();

    } catch (error) {
      console.error(
        "RESOLVE SYSTEM ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to resolve system error."
      );
    } finally {
      setResolving(false);
    }
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-green-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading system error...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (errorMessage) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-semibold text-red-800">
            Failed to load system error
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {errorMessage}
          </p>

          <div className="mt-5 flex gap-3">
            <button
              onClick={loadError}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Try Again
            </button>

            <button
              onClick={() =>
                router.push(
                  "/superadmin/system-errors"
                )
              }
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     NOT FOUND
  ======================================================= */

  if (!error) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">
            System Error Not Found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            The requested system error could not
            be found.
          </p>

          <button
            onClick={() =>
              router.push(
                "/superadmin/system-errors"
              )
            }
            className="mt-5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Back to System Errors
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">

      {/* ===================================================
          BACK
      =================================================== */}

      <button
        onClick={() =>
          router.push(
            "/superadmin/system-errors"
          )
        }
        className="text-sm font-medium text-green-600 hover:text-green-700"
      >
        ← Back to System Errors
      </button>

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <p className="text-sm font-medium text-green-600">
            Super Admin
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            System Error Details
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Detailed information about this
            system error.
          </p>
        </div>

        {/* STATUS */}

        <StatusBadge
          resolved={error.resolved}
        />

      </div>

      {/* ===================================================
          ERROR INFORMATION
      =================================================== */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Error Information
          </h2>

          <SeverityBadge
            severity={error.severity}
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">

          <Info
            label="Message"
            value={error.message}
          />

          <Info
            label="Error Type"
            value={
              error.errorType ||
              "—"
            }
          />

          <Info
            label="Severity"
            value={error.severity}
          />

          <Info
            label="Status"
            value={
              error.resolved
                ? "RESOLVED"
                : "OPEN"
            }
          />

          <Info
            label="HTTP Status"
            value={
              error.statusCode !== null &&
              error.statusCode !== undefined
                ? String(
                    error.statusCode
                  )
                : "—"
            }
          />

          <Info
            label="Method"
            value={
              error.method ||
              "—"
            }
          />

          <Info
            label="Endpoint"
            value={
              error.endpoint ||
              "—"
            }
          />

          <Info
            label="Request ID"
            value={
              error.requestId ||
              "—"
            }
          />

          <Info
            label="NGO"
            value={
              error.ngo?.name ||
              "System"
            }
          />

          <Info
            label="User"
            value={
              error.user
                ? `${error.user.name || "Unknown"} (${error.user.email})`
                : "Unknown"
            }
          />

          <Info
            label="Created"
            value={
              formatDate(
                error.createdAt
              )
            }
          />

          <Info
            label="Resolved At"
            value={
              error.resolvedAt
                ? formatDate(
                    error.resolvedAt
                  )
                : "Not resolved"
            }
          />

        </div>
      </div>

      {/* ===================================================
          STACK TRACE
      =================================================== */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-slate-900">
          Stack Trace
        </h2>

        <pre className="mt-4 max-h-[600px] overflow-auto rounded-xl bg-slate-950 p-5 text-xs leading-6 text-slate-200">
          {error.stack ||
            "No stack trace available."}
        </pre>

      </div>

      {/* ===================================================
          METADATA
      =================================================== */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-slate-900">
          Metadata
        </h2>

        <pre className="mt-4 max-h-[500px] overflow-auto rounded-xl bg-slate-50 p-5 text-xs leading-6 text-slate-700">
          {error.metadata
            ? JSON.stringify(
                error.metadata,
                null,
                2
              )
            : "No metadata available."}
        </pre>

      </div>

      {/* ===================================================
          RESOLUTION
      =================================================== */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-slate-900">
          Error Management
        </h2>

        {error.resolved ? (
          <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-5">

            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-sm text-white">
                ✓
              </span>

              <p className="font-semibold text-green-800">
                Error Resolved
              </p>
            </div>

            <div className="mt-4 space-y-2 text-sm text-green-700">

              <p>
                This system error has been
                marked as resolved.
              </p>

              {error.resolvedAt && (
                <p>
                  <span className="font-medium">
                    Resolved at:
                  </span>{" "}
                  {formatDate(
                    error.resolvedAt
                  )}
                </p>
              )}

              {error.resolvedById && (
                <p>
                  <span className="font-medium">
                    Resolved by ID:
                  </span>{" "}
                  {error.resolvedById}
                </p>
              )}

            </div>

          </div>
        ) : (
          <div className="mt-5">

            <p className="text-sm text-slate-500">
              This error is currently open and
              requires attention.
            </p>

            <button
              onClick={resolveError}
              disabled={resolving}
              className="mt-4 rounded-xl bg-green-600 px-5 py-3 font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resolving
                ? "Resolving..."
                : "✓ Mark as Resolved"}
            </button>

          </div>
        )}

      </div>

    </div>
  );
}

/* =========================================================
   INFO COMPONENT
========================================================= */

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm text-slate-800">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  resolved,
}: {
  resolved: boolean;
}) {
  return resolved ? (
    <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
      RESOLVED
    </span>
  ) : (
    <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
      OPEN
    </span>
  );
}

/* =========================================================
   SEVERITY BADGE
========================================================= */

function SeverityBadge({
  severity,
}: {
  severity: SystemError["severity"];
}) {
  const styles: Record<
    SystemError["severity"],
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
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[severity]}`}
    >
      {severity}
    </span>
  );
}

/* =========================================================
   DATE FORMATTER
========================================================= */

function formatDate(
  value: string
) {
  try {
    return new Date(
      value
    ).toLocaleString();
  } catch {
    return value;
  }
}