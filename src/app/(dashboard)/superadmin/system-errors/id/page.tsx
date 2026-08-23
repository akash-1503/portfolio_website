"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";

/* =========================================================
   TYPES
========================================================= */

type ErrorSeverity =
  | "INFO"
  | "WARNING"
  | "ERROR"
  | "CRITICAL";

interface SystemError {
  id: string;

  message: string;

  errorType?: string | null;

  stack?: string | null;

  endpoint?: string | null;

  method?: string | null;

  statusCode?: number | null;

  severity: ErrorSeverity;

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

interface SystemErrorResponse {
  success: boolean;

  message?: string;

  data?: {
    error: SystemError;
  };
}

/* =========================================================
   PAGE
========================================================= */

export default function SystemErrorDetailsPage() {
  const params = useParams();
  const router = useRouter();

  /* =======================================================
     ERROR ID
  ======================================================= */

  const rawId = params?.id;

  const id =
    typeof rawId === "string"
      ? rawId
      : Array.isArray(rawId)
        ? rawId[0]
        : null;

  /* =======================================================
     STATE
  ======================================================= */

  const [error, setError] =
    useState<SystemError | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [updating, setUpdating] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [selectedSeverity, setSelectedSeverity] =
    useState<ErrorSeverity | "">("");

  /* =========================================================
     LOAD SYSTEM ERROR
  ========================================================= */

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

      const response = await fetch(
        `/api/superadmin/system-errors/${encodeURIComponent(
          id
        )}`,
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

      /* ===================================================
         CONTENT TYPE
      =================================================== */

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
          "NON JSON SYSTEM ERROR RESPONSE:",
          text
        );

        throw new Error(
          `API returned ${response.status} instead of JSON.`
        );
      }

      /* ===================================================
         RESPONSE
      =================================================== */

      const result =
        (await response.json()) as SystemErrorResponse;

      /* ===================================================
         API ERROR
      =================================================== */

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to load system error."
        );
      }

      /* ===================================================
         ERROR DATA
      =================================================== */

      const systemError =
        result.data?.error ?? null;

      setError(systemError);

      if (systemError) {
        setSelectedSeverity(
          systemError.severity
        );
      }
    } catch (error) {
      console.error(
        "LOAD SYSTEM ERROR:",
        error
      );

      setError(null);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load system error."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadError();
  }, [loadError]);

  /* =========================================================
     UPDATE SYSTEM ERROR
  ========================================================= */

  async function updateError(
    changes: {
      resolved?: boolean;
      severity?: ErrorSeverity;
    }
  ) {
    if (!id || !error) {
      return;
    }

    try {
      setUpdating(true);
      setErrorMessage("");

      const response =
        await fetch(
          `/api/superadmin/system-errors/${encodeURIComponent(
            id
          )}`,
          {
            method: "PATCH",

            credentials: "include",

            headers: {
              "Content-Type":
                "application/json",

              Accept:
                "application/json",
            },

            body: JSON.stringify(
              changes
            ),
          }
        );

      /* ===================================================
         CONTENT TYPE
      =================================================== */

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

      /* ===================================================
         RESPONSE
      =================================================== */

      const result =
        (await response.json()) as SystemErrorResponse;

      /* ===================================================
         API ERROR
      =================================================== */

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to update system error."
        );
      }

      /* ===================================================
         UPDATE LOCAL STATE
      =================================================== */

      if (result.data?.error) {
        setError(
          result.data.error
        );

        setSelectedSeverity(
          result.data.error.severity
        );
      } else {
        await loadError();
      }
    } catch (error) {
      console.error(
        "UPDATE SYSTEM ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update system error."
      );
    } finally {
      setUpdating(false);
    }
  }

  /* =========================================================
     RESOLVE ERROR
  ========================================================= */

  async function resolveError() {
    if (!error || error.resolved) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to mark this system error as resolved?"
      );

    if (!confirmed) {
      return;
    }

    await updateError({
      resolved: true,
    });
  }

  /* =========================================================
     REOPEN ERROR
  ========================================================= */

  async function reopenError() {
    if (!error || !error.resolved) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to reopen this system error?"
      );

    if (!confirmed) {
      return;
    }

    await updateError({
      resolved: false,
    });
  }

  /* =========================================================
     CHANGE SEVERITY
  ========================================================= */

  async function changeSeverity() {
    if (
      !error ||
      !selectedSeverity ||
      selectedSeverity ===
        error.severity
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Change severity from ${error.severity} to ${selectedSeverity}?`
      );

    if (!confirmed) {
      setSelectedSeverity(
        error.severity
      );

      return;
    }

    await updateError({
      severity:
        selectedSeverity,
    });
  }

  /* =========================================================
     DELETE ERROR
  ========================================================= */

  async function deleteError() {
    if (!id || !error) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to permanently delete this system error? This action cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setErrorMessage("");

      const response =
        await fetch(
          `/api/superadmin/system-errors/${encodeURIComponent(
            id
          )}`,
          {
            method: "DELETE",

            credentials: "include",

            headers: {
              Accept:
                "application/json",
            },
          }
        );

      /* ===================================================
         CONTENT TYPE
      =================================================== */

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
          "NON JSON DELETE RESPONSE:",
          text
        );

        throw new Error(
          `API returned ${response.status} instead of JSON.`
        );
      }

      const result =
        (await response.json()) as {
          success: boolean;
          message?: string;
        };

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Failed to delete system error."
        );
      }

      router.push(
        "/superadmin/system-errors"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "DELETE SYSTEM ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete system error."
      );
    } finally {
      setDeleting(false);
    }
  }

  /* =========================================================
     LOADING
  ========================================================= */

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

  /* =========================================================
     ERROR STATE
  ========================================================= */

  if (errorMessage) {
    return (
      <div className="p-6">

        <div className="mx-auto max-w-6xl rounded-2xl border border-red-200 bg-red-50 p-6">

          <h2 className="text-lg font-semibold text-red-800">
            Failed to load system error
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {errorMessage}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">

            <button
              onClick={loadError}
              disabled={loading}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Try Again
            </button>

            <button
              onClick={() =>
                router.push(
                  "/superadmin/system-errors"
                )
              }
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Back
            </button>

          </div>

        </div>

      </div>
    );
  }

  /* =========================================================
     NOT FOUND
  ========================================================= */

  if (!error) {
    return (
      <div className="p-6">

        <div className="mx-auto max-w-6xl rounded-2xl border bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
            ?
          </div>

          <h2 className="mt-4 text-xl font-semibold text-slate-800">
            System Error Not Found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            The requested system error could not
            be found or may have been deleted.
          </p>

          <button
            onClick={() =>
              router.push(
                "/superadmin/system-errors"
              )
            }
            className="mt-5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
          >
            Back to System Errors
          </button>

        </div>

      </div>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

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
        className="text-sm font-medium text-green-600 transition hover:text-green-700"
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

        <StatusBadge
          resolved={
            error.resolved
          }
        />

      </div>

      {/* ===================================================
          ERROR INFORMATION
      =================================================== */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Error Information
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              ID: {error.id}
            </p>
          </div>

          <SeverityBadge
            severity={
              error.severity
            }
          />

        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">

          <Info
            label="Message"
            value={
              error.message
            }
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
            value={
              error.severity
            }
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
              error.statusCode !==
                null &&
              error.statusCode !==
                undefined
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
            value={formatDate(
              error.createdAt
            )}
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

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Stack Trace
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Technical debugging information
            </p>
          </div>

        </div>

        <pre className="mt-4 max-h-[600px] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-5 text-xs leading-6 text-slate-200">
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

        <p className="mt-1 text-xs text-slate-400">
          Additional information captured with
          the error.
        </p>

        <pre className="mt-4 max-h-[500px] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-5 text-xs leading-6 text-slate-700">
          {formatMetadata(
            error.metadata
          )}
        </pre>

      </div>

      {/* ===================================================
          RESOLUTION INFORMATION
      =================================================== */}

      {error.resolved && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6">

          <div className="flex items-center gap-3">

            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
              ✓
            </span>

            <div>
              <h2 className="font-semibold text-green-800">
                Error Resolved
              </h2>

              <p className="text-sm text-green-700">
                This system error has been
                marked as resolved.
              </p>
            </div>

          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">

            <Info
              label="Resolved At"
              value={
                error.resolvedAt
                  ? formatDate(
                      error.resolvedAt
                    )
                  : "—"
              }
            />

            <Info
              label="Resolved By"
              value={
                error.resolvedBy
                  ? `${error.resolvedBy.name} (${error.resolvedBy.email})`
                  : error.resolvedById ||
                    "Unknown"
              }
            />

          </div>

        </div>
      )}

      {/* ===================================================
          ERROR MANAGEMENT
      =================================================== */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <h2 className="text-lg font-semibold text-slate-900">
          Error Management
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Manage the status and severity of this
          system error.
        </p>

        {/* =================================================
            STATUS
        ================================================= */}

        <div className="mt-6 rounded-xl border bg-slate-50 p-5">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div>

              <p className="text-sm font-semibold text-slate-800">
                Error Status
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Current status:{" "}
                <span className="font-semibold">
                  {error.resolved
                    ? "RESOLVED"
                    : "OPEN"}
                </span>
              </p>

            </div>

            {error.resolved ? (
              <button
                onClick={
                  reopenError
                }
                disabled={updating}
                className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-medium text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updating
                  ? "Updating..."
                  : "Reopen Error"}
              </button>
            ) : (
              <button
                onClick={
                  resolveError
                }
                disabled={updating}
                className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updating
                  ? "Resolving..."
                  : "✓ Mark as Resolved"}
              </button>
            )}

          </div>

        </div>

        {/* =================================================
            SEVERITY
        ================================================= */}

        <div className="mt-4 rounded-xl border bg-slate-50 p-5">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div className="flex-1">

              <label
                htmlFor="severity"
                className="block text-sm font-semibold text-slate-800"
              >
                Change Severity
              </label>

              <p className="mt-1 text-xs text-slate-500">
                Update the priority level of this
                system error.
              </p>

              <select
                id="severity"
                value={
                  selectedSeverity
                }
                onChange={(event) =>
                  setSelectedSeverity(
                    event.target
                      .value as ErrorSeverity
                  )
                }
                disabled={updating}
                className="mt-3 w-full max-w-xs rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <option value="INFO">
                  INFO
                </option>

                <option value="WARNING">
                  WARNING
                </option>

                <option value="ERROR">
                  ERROR
                </option>

                <option value="CRITICAL">
                  CRITICAL
                </option>

              </select>

            </div>

            <button
              onClick={
                changeSeverity
              }
              disabled={
                updating ||
                !selectedSeverity ||
                selectedSeverity ===
                  error.severity
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {updating
                ? "Updating..."
                : "Update Severity"}
            </button>

          </div>

        </div>

      </div>

      {/* ===================================================
          DANGER ZONE
      =================================================== */}

      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

        <h2 className="text-lg font-semibold text-red-800">
          Danger Zone
        </h2>

        <p className="mt-1 text-sm text-red-700">
          Permanently delete this system error
          from the database.
        </p>

        <button
          onClick={
            deleteError
          }
          disabled={deleting}
          className="mt-4 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleting
            ? "Deleting..."
            : "Delete System Error"}
        </button>

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
    <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
      RESOLVED
    </span>
  ) : (
    <span className="inline-flex rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
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
  severity: ErrorSeverity;
}) {
  const styles: Record<
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
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[severity]}`}
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
): string {
  try {
    const date = new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleString();
  } catch {
    return value;
  }
}

/* =========================================================
   METADATA FORMATTER
========================================================= */

function formatMetadata(
  metadata: unknown
): string {
  if (
    metadata === null ||
    metadata === undefined
  ) {
    return "No metadata available.";
  }

  if (typeof metadata === "string") {
    return metadata;
  }

  try {
    return JSON.stringify(
      metadata,
      null,
      2
    );
  } catch {
    return "Unable to display metadata.";
  }
}