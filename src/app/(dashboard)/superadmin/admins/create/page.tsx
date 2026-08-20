"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  User,
  Mail,
  Lock,
  Building2,
  Loader2,
  UserPlus,
  RefreshCw,
} from "lucide-react";

interface NGO {
  id: string;
  name: string;
  email?: string | null;
  city?: string | null;
  state?: string | null;
}

interface AdminForm {
  name: string;
  email: string;
  password: string;
  ngoId: string;
}

export default function CreateAdminPage() {
  const router = useRouter();

  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loadingNGOs, setLoadingNGOs] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<AdminForm>({
    name: "",
    email: "",
    password: "",
    ngoId: "",
  });

  /* =========================================================
     LOAD NGOs
     
     IMPORTANT:
     This uses ONLY:
       /api/superadmin/admins

     It does NOT use:
       /api/superadmin/ngo
  ========================================================= */

  useEffect(() => {
    loadNGOs();
  }, []);

  async function loadNGOs() {
    try {
      setLoadingNGOs(true);
      setError("");

      const response = await fetch("/api/superadmin/admins", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      /* -------------------------------------------------------
         Prevent JSON parsing error if Next.js returns HTML
      ------------------------------------------------------- */

      const contentType =
        response.headers.get("content-type") || "";

      const rawText = await response.text();

      if (!contentType.includes("application/json")) {
        console.error(
          "Admin API returned non-JSON:",
          rawText
        );

        throw new Error(
          `API returned ${response.status} instead of JSON.`
        );
      }

      let result: any;

      try {
        result = JSON.parse(rawText);
      } catch {
        throw new Error(
          "The server returned invalid JSON."
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load NGOs."
        );
      }

      /*
       * The admin API should return:
       *
       * result.data.ngos
       *
       * We also support:
       *
       * result.data.admins
       *
       * as a fallback because an existing admin may already
       * contain the NGO information.
       */

      let availableNGOs: NGO[] = [];

      if (
        result.data &&
        Array.isArray(result.data.ngos)
      ) {
        availableNGOs = result.data.ngos;
      }

      /*
       * Fallback:
       * If the API returns admins containing NGO information,
       * extract NGOs from those admins.
       */

      if (
        availableNGOs.length === 0 &&
        result.data &&
        Array.isArray(result.data.admins)
      ) {
        const ngoMap = new Map<string, NGO>();

        for (const admin of result.data.admins) {
          if (admin.ngoId && admin.ngo) {
            ngoMap.set(admin.ngoId, {
              id: admin.ngo.id,
              name: admin.ngo.name,
              email: admin.ngo.email ?? null,
              city: admin.ngo.city ?? null,
              state: admin.ngo.state ?? null,
            });
          }
        }

        availableNGOs = Array.from(
          ngoMap.values()
        );
      }

      /*
       * VERY IMPORTANT:
       * Never allow ngos to become undefined.
       */

      setNgos(
        Array.isArray(availableNGOs)
          ? availableNGOs
          : []
      );

      /*
       * If only one NGO exists, automatically select it.
       *
       * This handles your current situation where you already
       * have one NGO with an existing NGO ID.
       */

      if (availableNGOs.length === 1) {
        setForm((previous) => ({
          ...previous,
          ngoId: availableNGOs[0].id,
        }));
      }
    } catch (error) {
      console.error(
        "LOAD NGO ERROR:",
        error
      );

      setNgos([]);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load NGOs."
      );
    } finally {
      setLoadingNGOs(false);
    }
  }

  /* =========================================================
     FORM FIELD UPDATE
  ========================================================= */

  function updateField(
    field: keyof AdminForm,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  /* =========================================================
     SUBMIT
  ========================================================= */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    /* -------------------------------------------------------
       VALIDATION
    ------------------------------------------------------- */

    const cleanName = form.name.trim();
    const cleanEmail = form.email
      .trim()
      .toLowerCase();
    const cleanPassword = form.password;
    const cleanNgoId = form.ngoId.trim();

    if (!cleanName) {
      setError("Full name is required.");
      return;
    }

    if (!cleanEmail) {
      setError("Email address is required.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    if (cleanPassword.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (!cleanNgoId) {
      setError("Please select an NGO.");
      return;
    }

    /*
     * Make sure selected NGO actually exists in the
     * loaded NGO list.
     */

    const selectedNGO = ngos.find(
      (ngo) => ngo.id === cleanNgoId
    );

    if (!selectedNGO) {
      setError(
        "The selected NGO is not available. Please refresh the NGO list."
      );
      return;
    }

    /* -------------------------------------------------------
       CREATE ADMIN
       
       ONLY:
         POST /api/superadmin/admins
    ------------------------------------------------------- */

    try {
      setSaving(true);

      const response = await fetch(
        "/api/superadmin/admins",
        {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            password: cleanPassword,
            ngoId: cleanNgoId,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      const rawText = await response.text();

      /*
       * Prevent:
       *
       * Unexpected token '<',
       * "<!DOCTYPE "... is not valid JSON
       */

      if (!contentType.includes("application/json")) {
        console.error(
          "CREATE ADMIN API RETURNED:",
          rawText
        );

        throw new Error(
          `API returned ${response.status} instead of JSON.`
        );
      }

      let result: any;

      try {
        result = JSON.parse(rawText);
      } catch {
        throw new Error(
          "The server returned invalid JSON."
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to create administrator."
        );
      }

      /* -------------------------------------------------------
         SUCCESS
      ------------------------------------------------------- */

      setSuccess(
        "Administrator created successfully and assigned to the selected NGO."
      );

      /*
       * Keep the NGO selected because it is useful if the
       * user returns to this form.
       */

      setForm({
        name: "",
        email: "",
        password: "",
        ngoId: cleanNgoId,
      });

      /*
       * Redirect after a short delay.
       */

      setTimeout(() => {
        router.push("/superadmin/admins");
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error(
        "CREATE ADMIN ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create administrator."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="min-h-screen bg-slate-50/70 p-6 lg:p-10 font-sans text-slate-800">
      <div className="mx-auto max-w-3xl space-y-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div>
          <button
            type="button"
            onClick={() =>
              router.push("/superadmin/admins")
            }
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Administrators
          </button>

          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-orange-500" />
            Super Admin Portal
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
            Create Administrator
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Create an administrator account and attach it
            to an existing NGO using its NGO ID.
          </p>
        </div>

        {/* =====================================================
            FORM
        ===================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] lg:p-8"
        >

          {/* ===================================================
              ERROR
          =================================================== */}

          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/80 p-4 text-sm text-red-600">
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />

              <p className="pt-0.5 font-medium">
                {error}
              </p>
            </div>
          )}

          {/* ===================================================
              SUCCESS
          =================================================== */}

          {success && (
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 text-sm text-emerald-600">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />

              <p className="pt-0.5 font-medium">
                {success}
              </p>
            </div>
          )}

          {/* ===================================================
              FORM GRID
          =================================================== */}

          <div className="grid gap-6 sm:grid-cols-2">

            {/* =================================================
                NAME
            ================================================= */}

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Full Name
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <User className="h-5 w-5 text-slate-400" />
                </div>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    updateField(
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Admin User"
                  autoComplete="name"
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* =================================================
                EMAIL
            ================================================= */}

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Email Address
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    updateField(
                      "email",
                      e.target.value
                    )
                  }
                  placeholder="admin@example.com"
                  autoComplete="email"
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* =================================================
                PASSWORD
            ================================================= */}

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Temporary Password
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>

                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    updateField(
                      "password",
                      e.target.value
                    )
                  }
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* =================================================
                NGO
            ================================================= */}

            <div className="sm:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Assign to NGO
                </label>

                <button
                  type="button"
                  onClick={loadNGOs}
                  disabled={loadingNGOs || saving}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-orange-500 disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${
                      loadingNGOs
                        ? "animate-spin"
                        : ""
                    }`}
                  />
                  Refresh
                </button>
              </div>

              <div className="relative">

                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4">
                  <Building2 className="h-5 w-5 text-slate-400" />
                </div>

                {loadingNGOs ? (
                  <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200/80 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                    Loading available NGOs...
                  </div>
                ) : ngos.length === 0 ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 pl-11">
                    <p className="text-sm font-bold text-red-700">
                      No NGOs available
                    </p>

                    <p className="mt-1 text-xs font-medium text-red-600">
                      Create an NGO first or refresh the list.
                    </p>
                  </div>
                ) : (
                  <>
                    <select
                      value={form.ngoId}
                      onChange={(e) =>
                        updateField(
                          "ngoId",
                          e.target.value
                        )
                      }
                      disabled={saving}
                      className="w-full appearance-none rounded-xl border border-slate-200/80 bg-slate-50/50 py-3 pl-11 pr-10 text-sm text-slate-800 outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="">
                        Select an organization
                      </option>

                      {ngos.map((ngo) => (
                        <option
                          key={ngo.id}
                          value={ngo.id}
                        >
                          {ngo.name} — NGO ID:{" "}
                          {ngo.id}
                        </option>
                      ))}
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                      <svg
                        className="h-4 w-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </>
                )}
              </div>

              {/* =================================================
                  SELECTED NGO INFORMATION
              ================================================= */}

              {form.ngoId && (
                <div className="mt-3 rounded-xl border border-orange-100 bg-orange-50/50 p-4">
                  {(() => {
                    const selectedNGO =
                      ngos.find(
                        (ngo) =>
                          ngo.id ===
                          form.ngoId
                      );

                    if (!selectedNGO) {
                      return null;
                    }

                    return (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                          Selected NGO
                        </p>

                        <p className="mt-1 text-sm font-bold text-slate-800">
                          {selectedNGO.name}
                        </p>

                        <p className="mt-1 break-all text-xs font-medium text-slate-500">
                          NGO ID:{" "}
                          {selectedNGO.id}
                        </p>

                        {(selectedNGO.city ||
                          selectedNGO.state) && (
                          <p className="mt-1 text-xs text-slate-500">
                            {[
                              selectedNGO.city,
                              selectedNGO.state,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* ===================================================
              ACTIONS
          =================================================== */}

          <div className="mt-8 flex flex-col-reverse items-stretch justify-end gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/superadmin/admins"
                )
              }
              disabled={saving}
              className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                loadingNGOs ||
                ngos.length === 0
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-400 to-red-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:brightness-105 active:scale-95 disabled:pointer-events-none disabled:opacity-70"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create Admin
                </>
              )}
            </button>
          </div>
        </form>

        {/* =====================================================
            INFORMATION CARD
        ===================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />

            <div>
              <h3 className="text-sm font-bold text-slate-800">
                NGO Assignment
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                The administrator will be connected to
                the selected NGO through the{" "}
                <span className="font-bold text-slate-700">
                  User.ngoId
                </span>{" "}
                field. The existing NGO is not recreated.
              </p>

              {form.ngoId && (
                <p className="mt-2 break-all text-xs font-semibold text-orange-600">
                  Selected NGO ID: {form.ngoId}
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}