"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  ngoId?: string | null;
  createdAt?: string;
}

interface NGOStatistics {
  users: number;
  admins: number;
  programs: number;
  campaigns: number;
  events: number;
  donations: number;
}

interface NGO {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  description: string | null;

  createdAt: string;
  updatedAt: string;

  isDeleted?: boolean;
  deletedAt?: string | null;

  statistics?: NGOStatistics;

  admins?: Admin[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    ngos?: NGO[];
    pagination?: Pagination;
  };
}

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  description: "",
};

export default function NGOManagementPage() {
  const [ngos, setNgos] = useState<NGO[]>([]);

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const limit = 20;

  /* =========================================================
     CREATE MODAL
  ========================================================= */

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [creating, setCreating] = useState(false);

  const [createError, setCreateError] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);

  /* =========================================================
     DETAIL MODAL
  ========================================================= */

  const [selectedNGO, setSelectedNGO] =
    useState<NGO | null>(null);

  /* =========================================================
     DELETE
  ========================================================= */

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  /* =========================================================
     LOAD NGOS
  ========================================================= */

  const loadNGOs = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setErrorMessage("");

        const params = new URLSearchParams();

        params.set("page", String(page));
        params.set("limit", String(limit));

        if (search.trim()) {
          params.set("search", search.trim());
        }

        const response = await fetch(
          `/api/superadmin/ngo?${params.toString()}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const text = await response.text();

        let result: ApiResponse;

        try {
          result = JSON.parse(text);
        } catch {
          throw new Error(
            `API returned ${response.status} with invalid JSON.`
          );
        }

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              `Failed to load NGOs. API status: ${response.status}`
          );
        }

        setNgos(result.data?.ngos || []);

        setPagination(
          result.data?.pagination || {
            page,
            limit,
            total: 0,
            totalPages: 0,
          }
        );
      } catch (error) {
        console.error(
          "NGO MANAGEMENT LOAD ERROR:",
          error
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to load NGOs."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, search]
  );

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadNGOs();
  }, [loadNGOs]);

  /* =========================================================
     SEARCH
  ========================================================= */

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  function updateForm(
    field: keyof typeof EMPTY_FORM,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /* =========================================================
     CREATE NGO
  ========================================================= */

  async function handleCreateNGO(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.name.trim()) {
      setCreateError("NGO name is required.");
      return;
    }

    try {
      setCreating(true);
      setCreateError("");

      const response = await fetch(
        "/api/superadmin/ngo",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim() || null,
            phone: form.phone.trim() || null,
            website: form.website.trim() || null,
            address: form.address.trim() || null,
            city: form.city.trim() || null,
            state: form.state.trim() || null,
            country: form.country.trim() || null,
            postalCode:
              form.postalCode.trim() || null,
            description:
              form.description.trim() || null,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to create NGO."
        );
      }

      setShowCreateModal(false);

      setForm(EMPTY_FORM);

      setPage(1);

      await loadNGOs(true);
    } catch (error) {
      console.error(
        "CREATE NGO ERROR:",
        error
      );

      setCreateError(
        error instanceof Error
          ? error.message
          : "Failed to create NGO."
      );
    } finally {
      setCreating(false);
    }
  }

  /* =========================================================
     DELETE NGO
  ========================================================= */

  async function handleDeleteNGO(
    ngo: NGO
  ) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${ngo.name}"?\n\nThis will soft-delete the NGO.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(ngo.id);

      const response = await fetch(
        "/api/superadmin/ngo",
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: ngo.id,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Failed to delete NGO."
        );
      }

      if (selectedNGO?.id === ngo.id) {
        setSelectedNGO(null);
      }

      await loadNGOs(true);
    } catch (error) {
      console.error(
        "DELETE NGO ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete NGO."
      );
    } finally {
      setDeletingId(null);
    }
  }

  /* =========================================================
     OPEN DETAILS
  ========================================================= */

  function openDetails(ngo: NGO) {
    setSelectedNGO(ngo);
  }

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  function formatDate(
    date?: string | null
  ) {
    if (!date) {
      return "—";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "—";
    }

    return parsed.toLocaleString();
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading && ngos.length === 0) {
    return (
      <div className="min-h-full p-6">
        <div className="mx-auto max-w-7xl">
          <Header
            onCreate={() =>
              setShowCreateModal(true)
            }
          />

          <div className="mt-6 flex min-h-[350px] items-center justify-center rounded-2xl border bg-white shadow-sm">
            <div className="text-center">
              <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-green-600" />

              <p className="text-sm text-slate-500">
                Loading NGOs...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (
    errorMessage &&
    ngos.length === 0
  ) {
    return (
      <div className="min-h-full p-6">
        <div className="mx-auto max-w-7xl">
          <Header
            onCreate={() =>
              setShowCreateModal(true)
            }
          />

          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="text-lg font-semibold text-red-800">
              Failed to load NGOs
            </h2>

            <p className="mt-2 text-sm text-red-700">
              {errorMessage}
            </p>

            <button
              onClick={() =>
                loadNGOs(true)
              }
              className="mt-5 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>

        {showCreateModal && (
          <CreateNGOModal
            form={form}
            creating={creating}
            error={createError}
            onClose={() => {
              setShowCreateModal(false);
              setCreateError("");
            }}
            onChange={updateForm}
            onSubmit={handleCreateNGO}
          />
        )}
      </div>
    );
  }

  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <div className="min-h-full p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}

        <Header
          onCreate={() =>
            setShowCreateModal(true)
          }
        />

        {/* SEARCH */}

        <div className="rounded-2xl border bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

            <div className="w-full md:max-w-xl">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Search NGO
              </label>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  handleSearch(
                    event.target.value
                  )
                }
                placeholder="Search by NGO name, email or phone..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <button
              onClick={() =>
                loadNGOs(true)
              }
              disabled={refreshing}
              className="rounded-xl border bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
            >
              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>

          </div>

        </div>

        {/* ERROR */}

        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* NGO TABLE */}

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

          <div className="border-b px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              NGO Management
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {pagination?.total ?? ngos.length} NGO
              {pagination?.total === 1
                ? ""
                : "s"}{" "}
              found
            </p>
          </div>

          {ngos.length === 0 ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-2xl text-green-600">
                  +
                </div>

                <h3 className="font-semibold text-slate-900">
                  No NGOs found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Create your first NGO to get
                  started.
                </p>

                <button
                  onClick={() =>
                    setShowCreateModal(true)
                  }
                  className="mt-4 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Create NGO
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px]">

                <thead className="bg-slate-50">
                  <tr className="border-b text-left">

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      NGO
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Contact
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Admins
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Users
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Created
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {ngos.map((ngo) => {

                    const statistics =
                      ngo.statistics || {
                        users: 0,
                        admins:
                          ngo.admins?.length || 0,
                        programs: 0,
                        campaigns: 0,
                        events: 0,
                        donations: 0,
                      };

                    const adminCount =
                      statistics.admins ??
                      ngo.admins?.length ??
                      0;

                    return (
                      <tr
                        key={ngo.id}
                        className="border-b last:border-0 hover:bg-slate-50"
                      >

                        {/* NGO */}

                        <td className="px-5 py-4">

                          <div className="font-semibold text-slate-900">
                            {ngo.name}
                          </div>

                          <div className="mt-1 text-xs text-slate-400">
                            ID: {ngo.id}
                          </div>

                        </td>

                        {/* CONTACT */}

                        <td className="px-5 py-4">

                          <div className="text-sm text-slate-700">
                            {ngo.email || "—"}
                          </div>

                          <div className="mt-1 text-xs text-slate-400">
                            {ngo.phone || "—"}
                          </div>

                        </td>

                        {/* ADMINS */}

                        <td className="px-5 py-4">

                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                            {adminCount}{" "}
                            {adminCount === 1
                              ? "admin"
                              : "admins"}
                          </span>

                        </td>

                        {/* USERS */}

                        <td className="px-5 py-4">

                          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                            {statistics.users}{" "}
                            {statistics.users ===
                            1
                              ? "user"
                              : "users"}
                          </span>

                        </td>

                        {/* CREATED */}

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                          {formatDate(
                            ngo.createdAt
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">

                          <div className="flex gap-2">

                            <button
                              onClick={() =>
                                openDetails(
                                  ngo
                                )
                              }
                              className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-700"
                            >
                              Details
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteNGO(
                                  ngo
                                )
                              }
                              disabled={
                                deletingId ===
                                ngo.id
                              }
                              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId ===
                              ngo.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

          {/* PAGINATION */}

          {pagination &&
            pagination.totalPages > 0 && (
              <div className="flex flex-col justify-between gap-3 border-t px-5 py-4 sm:flex-row sm:items-center">

                <p className="text-sm text-slate-500">
                  Page{" "}
                  <span className="font-semibold text-slate-900">
                    {pagination.page}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-900">
                    {pagination.totalPages}
                  </span>
                </p>

                <div className="flex gap-2">

                  <button
                    disabled={
                      pagination.page <= 1
                    }
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.max(
                            current - 1,
                            1
                          )
                      )
                    }
                    className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    disabled={
                      pagination.page >=
                      pagination.totalPages
                    }
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.min(
                            current + 1,
                            pagination.totalPages
                          )
                      )
                    }
                    className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>

                </div>

              </div>
            )}

        </div>
      </div>

      {/* CREATE MODAL */}

      {showCreateModal && (
        <CreateNGOModal
          form={form}
          creating={creating}
          error={createError}
          onClose={() => {
            setShowCreateModal(false);
            setCreateError("");
          }}
          onChange={updateForm}
          onSubmit={handleCreateNGO}
        />
      )}

      {/* DETAIL MODAL */}

      {selectedNGO && (
        <NGODetailsModal
          ngo={selectedNGO}
          onClose={() =>
            setSelectedNGO(null)
          }
          onDelete={() =>
            handleDeleteNGO(selectedNGO)
          }
          deleting={
            deletingId === selectedNGO.id
          }
          formatDate={formatDate}
        />
      )}
    </div>
  );
}

/* =========================================================
   HEADER
========================================================= */

function Header({
  onCreate,
}: {
  onCreate: () => void;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

      <div>
        <p className="text-sm font-medium text-green-600">
          Super Admin
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          NGO Management
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Create, view and manage NGOs and their
          attached administrators.
        </p>
      </div>

      <button
        onClick={onCreate}
        className="rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700"
      >
        + Create NGO
      </button>

    </div>
  );
}

/* =========================================================
   CREATE NGO MODAL
========================================================= */

function CreateNGOModal({
  form,
  creating,
  error,
  onClose,
  onChange,
  onSubmit,
}: {
  form: typeof EMPTY_FORM;
  creating: boolean;
  error: string;
  onClose: () => void;
  onChange: (
    field: keyof typeof EMPTY_FORM,
    value: string
  ) => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b px-6 py-5">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Create NGO
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add a new NGO to the system.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            ✕
          </button>

        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-5 p-6"
        >

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">

            <Input
              label="NGO Name *"
              value={form.name}
              onChange={(value) =>
                onChange("name", value)
              }
              placeholder="NGO name"
            />

            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(value) =>
                onChange("email", value)
              }
              placeholder="ngo@example.com"
            />

            <Input
              label="Phone"
              value={form.phone}
              onChange={(value) =>
                onChange("phone", value)
              }
              placeholder="9876543210"
            />

            <Input
              label="Website"
              value={form.website}
              onChange={(value) =>
                onChange("website", value)
              }
              placeholder="https://example.org"
            />

            <Input
              label="City"
              value={form.city}
              onChange={(value) =>
                onChange("city", value)
              }
              placeholder="City"
            />

            <Input
              label="State"
              value={form.state}
              onChange={(value) =>
                onChange("state", value)
              }
              placeholder="State"
            />

            <Input
              label="Country"
              value={form.country}
              onChange={(value) =>
                onChange("country", value)
              }
              placeholder="Country"
            />

            <Input
              label="Postal Code"
              value={form.postalCode}
              onChange={(value) =>
                onChange("postalCode", value)
              }
              placeholder="Postal code"
            />

          </div>

          <Input
            label="Address"
            value={form.address}
            onChange={(value) =>
              onChange("address", value)
            }
            placeholder="Full NGO address"
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(event) =>
                onChange(
                  "description",
                  event.target.value
                )
              }
              rows={4}
              placeholder="Describe the NGO..."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div className="flex justify-end gap-3 border-t pt-5">

            <button
              type="button"
              onClick={onClose}
              disabled={creating}
              className="rounded-xl border px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={creating}
              className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating
                ? "Creating..."
                : "Create NGO"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />
    </div>
  );
}

/* =========================================================
   NGO DETAILS MODAL
========================================================= */

function NGODetailsModal({
  ngo,
  onClose,
  onDelete,
  deleting,
  formatDate,
}: {
  ngo: NGO;
  onClose: () => void;
  onDelete: () => void;
  deleting: boolean;
  formatDate: (
    date?: string | null
  ) => string;
}) {
  const statistics =
    ngo.statistics || {
      users: 0,
      admins: ngo.admins?.length || 0,
      programs: 0,
      campaigns: 0,
      events: 0,
      donations: 0,
    };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 p-4">

      <div className="mx-auto my-8 w-full max-w-5xl rounded-3xl bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-start justify-between border-b px-6 py-5">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
              NGO Details
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {ngo.name}
            </h2>

            <p className="mt-1 break-all text-xs text-slate-400">
              ID: {ngo.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            ✕
          </button>

        </div>

        <div className="space-y-6 p-6">

          {/* NGO INFORMATION */}

          <section>

            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              NGO Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              <DetailItem
                label="NGO ID"
                value={ngo.id}
              />

              <DetailItem
                label="NGO Name"
                value={ngo.name}
              />

              <DetailItem
                label="Email"
                value={ngo.email}
              />

              <DetailItem
                label="Phone"
                value={ngo.phone}
              />

              <DetailItem
                label="Website"
                value={ngo.website}
              />

              <DetailItem
                label="City"
                value={ngo.city}
              />

              <DetailItem
                label="State"
                value={ngo.state}
              />

              <DetailItem
                label="Country"
                value={ngo.country}
              />

              <DetailItem
                label="Postal Code"
                value={ngo.postalCode}
              />

              <DetailItem
                label="Created At"
                value={formatDate(
                  ngo.createdAt
                )}
              />

              <DetailItem
                label="Updated At"
                value={formatDate(
                  ngo.updatedAt
                )}
              />

              <DetailItem
                label="Deleted"
                value={
                  ngo.isDeleted
                    ? "Yes"
                    : "No"
                }
              />

            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">

              <DetailItem
                label="Address"
                value={ngo.address}
              />

              <DetailItem
                label="Description"
                value={ngo.description}
              />

            </div>

          </section>

          {/* STATISTICS */}

          <section>

            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              NGO Statistics
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

              <StatisticCard
                title="Users"
                value={statistics.users}
              />

              <StatisticCard
                title="Programs"
                value={statistics.programs}
              />

              <StatisticCard
                title="Campaigns"
                value={statistics.campaigns}
              />

              <StatisticCard
                title="Events"
                value={statistics.events}
              />

              <StatisticCard
                title="Donations"
                value={statistics.donations}
              />

            </div>

          </section>

          {/* ADMINS */}

          <section>

            <div className="mb-4">

              <h3 className="text-lg font-semibold text-slate-900">
                Attached Admins
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Administrators connected to this
                NGO through their NGO ID.
              </p>

            </div>

            {!ngo.admins ||
            ngo.admins.length === 0 ? (
              <div className="rounded-2xl border border-dashed bg-slate-50 p-6 text-center">

                <p className="font-medium text-slate-700">
                  No admins attached
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  No ADMIN user currently has this
                  NGO ID.
                </p>

              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">

                {ngo.admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="rounded-2xl border bg-white p-4 shadow-sm"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <p className="font-semibold text-slate-900">
                          {admin.name}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {admin.email}
                        </p>
                      </div>

                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                        {admin.role}
                      </span>

                    </div>

                    <p className="mt-3 break-all text-xs text-slate-400">
                      User ID: {admin.id}
                    </p>

                    <p className="mt-1 break-all text-xs text-slate-400">
                      NGO ID:{" "}
                      {admin.ngoId ||
                        ngo.id}
                    </p>

                  </div>
                ))}

              </div>
            )}

          </section>

        </div>

        {/* FOOTER */}

        <div className="flex flex-col justify-between gap-3 border-t bg-slate-50 px-6 py-4 sm:flex-row sm:items-center">

          <p className="text-xs text-slate-500">
            Deleting an NGO performs a soft delete.
          </p>

          <div className="flex gap-3">

            <button
              onClick={onClose}
              className="rounded-xl border bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>

            <button
              onClick={onDelete}
              disabled={deleting}
              className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting
                ? "Deleting..."
                : "Delete NGO"}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

/* =========================================================
   DETAIL ITEM
========================================================= */

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-slate-800">
        {value || "—"}
      </p>

    </div>
  );
}

/* =========================================================
   STATISTIC CARD
========================================================= */

function StatisticCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border bg-slate-50 p-5">

      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}