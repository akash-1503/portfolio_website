"use client";

/**
 * Shared Profile page, rendered identically for every role:
 *
 *   src/app/admin/profile/page.tsx      -> <ProfilePage />
 *   src/app/volunteer/profile/page.tsx  -> <ProfilePage />
 *   src/app/user/profile/page.tsx       -> <ProfilePage />
 *
 * The API decides what's editable (see PROFILE_SELECT / UPDATABLE_FIELDS
 * on the backend) — this component doesn't branch on role except to show
 * the one ADMIN-only callout pointing at NGO Settings, which intentionally
 * lives outside this page (personal profile vs. org settings are kept
 * separate, per the architecture notes).
 *
 * Design direction: a personal record rendered like a printed civic
 * document, translated natively to a modern web UI — one continuous
 * dashed-border "sheet" instead of stacked SaaS cards, corner marks like
 * a certificate, form fields drawn as dotted blanks waiting to be filled
 * in, and a simple dashed seal standing in for an official stamp. Smooth
 * off-white paper (#F9F8F3), plain sans-serif throughout, no gilding.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import MediaUploader from "../cloudinary/MediaUploader";
// NOTE: adjust this import path to wherever your centralized Cloudinary
// folder constants actually live (per Step 18 of the migration notes).
import { CLOUDINARY_FOLDERS } from "../../lib/cloudinary-folders";

// ============================================================================
// TYPES
// ============================================================================

type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "VOLUNTEER"
  | "USER";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  imagePublicId: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  role: UserRole;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface PersonalFormState {
  name: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  image: string;
  imagePublicId: string;
}

interface AddressFormState {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ToastState {
  type: "success" | "error";
  message: string;
}

const emptyPersonalForm: PersonalFormState = {
  name: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  image: "",
  imagePublicId: "",
};

const emptyAddressForm: AddressFormState = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
};

const emptyPasswordForm: PasswordFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const GENDER_OPTIONS = [
  { value: "", label: "Prefer not to say" },
  { value: "FEMALE", label: "Female" },
  { value: "MALE", label: "Male" },
  { value: "NON_BINARY", label: "Non-binary" },
  { value: "OTHER", label: "Other" },
];

const PHONE_REGEX = /^[6-9]\d{9}$/;

// ============================================================================
// SMALL DECORATIVE PRIMITIVES (the dashed / corner / seal motif)
// ============================================================================

function CornerMark({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const rotation = { tl: 0, tr: 90, br: 180, bl: 270 }[position];
  const placement = {
    tl: "top-3 left-3",
    tr: "top-3 right-3",
    br: "bottom-3 right-3",
    bl: "bottom-3 left-3",
  }[position];

  return (
    <svg
      viewBox="0 0 28 28"
      className={`pointer-events-none absolute ${placement} h-5 w-5 text-gray-300`}
      style={{ transform: `rotate(${rotation}deg)` }}
      fill="none"
    >
      <path
        d="M1.5 1.5 L1.5 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2.5 3"
        strokeLinecap="round"
      />
      <path
        d="M1.5 1.5 L12 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="2.5 3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RecordSeal({ label }: { label: string }) {
  return (
    <div className="relative mx-auto h-28 w-28 shrink-0 sm:mx-0">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke="#111827"
          strokeOpacity="0.28"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="#111827"
          strokeOpacity="0.16"
          strokeWidth="1"
          strokeDasharray="2 3"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-3 text-center">
        <span className="text-[8.5px] font-extrabold uppercase tracking-widest text-gray-400">
          Verified
        </span>
        <span className="mt-1 text-[12px] font-extrabold leading-tight text-gray-900">
          {label}
        </span>
        <span className="mt-1 text-[8px] font-bold uppercase tracking-widest text-gray-400">
          Record
        </span>
      </div>
    </div>
  );
}

function SectionDivider() {
  return <div className="my-10 border-t-2 border-dashed border-gray-200" />;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="inline-block border-b-2 border-dashed border-gray-300 pb-1.5 text-lg font-extrabold text-gray-900 sm:text-xl">
      {children}
    </h2>
  );
}

// ============================================================================
// FORM FIELD PRIMITIVES (the "printed blank waiting to be filled in" look)
// ============================================================================

interface RecordFieldProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: "text" | "tel" | "date" | "email";
  placeholder?: string;
  disabled?: boolean;
}

function RecordField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
}: RecordFieldProps) {
  const isDisabled = disabled || !onChange;

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-extrabold uppercase tracking-widest text-gray-500">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={isDisabled}
        className={`w-full border-0 border-b-2 border-dashed bg-transparent px-0.5 py-2 text-[14px] font-bold outline-none transition-colors ${
          isDisabled
            ? "cursor-not-allowed border-gray-200 text-gray-400"
            : "border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-900"
        }`}
      />
    </div>
  );
}

function RecordSelectField({
  label,
  value,
  onChange,
  options,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-extrabold uppercase tracking-widest text-gray-500">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full cursor-pointer border-0 border-b-2 border-dashed border-gray-300 bg-transparent px-0.5 py-2 text-[14px] font-bold text-gray-900 outline-none transition-colors focus:border-gray-900 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-extrabold uppercase tracking-widest text-gray-500">
        {label}
      </label>
      <div className="flex items-center gap-2 border-b-2 border-dashed border-gray-300 focus-within:border-gray-900">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-0.5 py-2 text-[14px] font-bold text-gray-900 outline-none"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="shrink-0 p-1 text-gray-400 hover:text-gray-700 transition-colors"
          tabIndex={-1}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// HELPERS
// ============================================================================

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [personalForm, setPersonalForm] = useState<PersonalFormState>(emptyPersonalForm);
  const [addressForm, setAddressForm] = useState<AddressFormState>(emptyAddressForm);
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>(emptyPasswordForm);

  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (type: ToastState["type"], message: string) => {
    setToast({ type, message });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // --- Load profile ---
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setLoadError(null);

      const response = await fetch("/api/profile", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Failed to load profile.");
      }

      const user: ProfileData = result.data;

      setProfile(user);

      setPersonalForm({
        name: user.name || "",
        phone: user.phone || "",
        // <input type="date"> expects YYYY-MM-DD, not a full ISO timestamp.
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
        gender: user.gender || "",
        image: user.image || "",
        imagePublicId: user.imagePublicId || "",
      });

      setAddressForm({
        addressLine1: user.addressLine1 || "",
        addressLine2: user.addressLine2 || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        postalCode: user.postalCode || "",
      });
    } catch (err) {
      console.error("Fetch profile error:", err);
      setLoadError(
        err instanceof Error ? err.message : "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // --- Save personal information ---
  const handleSavePersonal = async () => {
    if (!personalForm.name.trim()) {
      showToast("error", "Full name is required.");
      return;
    }

    if (personalForm.phone && !PHONE_REGEX.test(personalForm.phone.trim())) {
      showToast("error", "Please enter a valid 10-digit mobile number.");
      return;
    }

    if (personalForm.dateOfBirth) {
      const dob = new Date(personalForm.dateOfBirth);

      if (Number.isNaN(dob.getTime())) {
        showToast("error", "Please enter a valid date of birth.");
        return;
      }
    }

    try {
      setSavingPersonal(true);

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: personalForm.name.trim(),
          phone: personalForm.phone.trim() || null,
          image: personalForm.image || null,
          imagePublicId: personalForm.imagePublicId || null,
          dateOfBirth: personalForm.dateOfBirth || null,
          gender: personalForm.gender || null,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Failed to update profile.");
      }

      setProfile((prev) => (prev ? { ...prev, ...result.data } : result.data));
      showToast("success", "Profile updated successfully");
    } catch (err) {
      console.error("Save personal info error:", err);
      showToast(
        "error",
        err instanceof Error ? err.message : "Failed to update profile."
      );
    } finally {
      setSavingPersonal(false);
    }
  };

  // --- Save address ---
  const handleSaveAddress = async () => {
    try {
      setSavingAddress(true);

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          addressLine1: addressForm.addressLine1.trim() || null,
          addressLine2: addressForm.addressLine2.trim() || null,
          city: addressForm.city.trim() || null,
          state: addressForm.state.trim() || null,
          country: addressForm.country.trim() || null,
          postalCode: addressForm.postalCode.trim() || null,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Failed to update address.");
      }

      setProfile((prev) => (prev ? { ...prev, ...result.data } : result.data));
      showToast("success", "Address updated successfully");
    } catch (err) {
      console.error("Save address error:", err);
      showToast(
        "error",
        err instanceof Error ? err.message : "Failed to update address."
      );
    } finally {
      setSavingAddress(false);
    }
  };

  // --- Change password ---
  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword) {
      showToast("error", "Current password is required.");
      return;
    }

    if (!passwordForm.newPassword) {
      showToast("error", "New password is required.");
      return;
    }

    if (!passwordForm.confirmPassword) {
      showToast("error", "Please confirm your new password.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      showToast("error", "New password must be at least 8 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("error", "New password and confirm password do not match.");
      return;
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      showToast(
        "error",
        "New password must be different from your current password."
      );
      return;
    }

    try {
      setChangingPassword(true);

      const response = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(passwordForm),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Failed to change password.");
      }

      setPasswordForm(emptyPasswordForm);
      showToast("success", "Password changed successfully");
    } catch (err) {
      console.error("Change password error:", err);
      showToast(
        "error",
        err instanceof Error ? err.message : "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // ============================================================================
  // LOADING STATE — skeleton, not empty inputs
  // ============================================================================
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#F9F8F3] px-4 py-10 md:py-16">
        <div className="mx-auto w-full max-w-3xl">
          <div className="space-y-10 rounded-[1.75rem] border border-dashed border-gray-300 bg-white px-6 py-10 sm:px-10 sm:py-12">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 shrink-0 animate-pulse rounded-full bg-gray-100" />
              <div className="space-y-2.5">
                <div className="h-5 w-40 animate-pulse rounded-full bg-gray-100" />
                <div className="h-3.5 w-52 animate-pulse rounded-full bg-gray-100" />
                <div className="h-3.5 w-24 animate-pulse rounded-full bg-gray-100" />
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4 border-t-2 border-dashed border-gray-200 pt-8">
                <div className="h-4 w-40 animate-pulse rounded-full bg-gray-100" />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="h-9 animate-pulse rounded bg-gray-50" />
                  <div className="h-9 animate-pulse rounded bg-gray-50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // ERROR STATE
  // ============================================================================
  if (loadError && !profile) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F9F8F3] px-4 py-16">
        <div className="w-full max-w-sm rounded-[1.75rem] border border-dashed border-gray-300 bg-white px-8 py-12 text-center">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-red-400" />
          <h2 className="mb-2 text-lg font-extrabold text-gray-900">
            Couldn&apos;t load your profile
          </h2>
          <p className="mb-6 text-[13px] font-medium text-gray-500">{loadError}</p>
          <button
            onClick={fetchProfile}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-2.5 text-[13px] font-extrabold text-gray-900 transition-colors hover:bg-gray-50"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  return (
    <div className="min-h-screen w-full bg-[#F9F8F3] px-4 py-10 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto w-full max-w-3xl"
      >
        <div className="relative rounded-[1.75rem] border border-dashed border-gray-300 bg-white px-6 py-10 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:px-10 sm:py-12">
          <CornerMark position="tl" />
          <CornerMark position="tr" />
          <CornerMark position="bl" />
          <CornerMark position="br" />

          {/* ==================== PAGE TITLE ==================== */}
          <div>
            <h1 className="inline-block border-b-2 border-dashed border-gray-300 pb-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
              Profile
            </h1>
            <p className="mt-3 text-[13px] font-bold text-gray-500 sm:text-[14px]">
              Manage your personal information and account settings.
            </p>
          </div>

          {/* ==================== PROFILE HEADER ==================== */}
          <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="flex flex-col items-center gap-3 sm:items-start">
              <div className="rounded-full border-2 border-dashed border-gray-300 p-1.5">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                  {personalForm.image ? (
                    <img
                      src={personalForm.image}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-extrabold text-gray-400">
                      {getInitials(profile.name)}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-36">
                <MediaUploader
                  accept="image"
                  multiple={false}
                  folder={CLOUDINARY_FOLDERS.profile.avatar}
                  buttonText="Change Photo"
                  variant="pill"
                  onUpload={(media) => {
                    setPersonalForm((prev) => ({
                      ...prev,
                      image: media.url,
                      imagePublicId: media.publicId,
                    }));
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
              <h2 className="text-xl font-extrabold text-gray-900">{profile.name}</h2>
              <p className="text-[13px] font-bold text-gray-500">{profile.email}</p>
              <span className="mt-1 inline-flex items-center rounded-full border border-dashed border-gray-400 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-gray-600">
                {profile.role}
              </span>
            </div>
          </div>

          <SectionDivider />

          {/* ==================== A. PERSONAL INFORMATION ==================== */}
          <section>
            <SectionHeading>Personal Information</SectionHeading>

            <div className="mt-7 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <RecordField
                label="Full Name"
                value={personalForm.name}
                onChange={(v) => setPersonalForm((p) => ({ ...p, name: v }))}
                placeholder="Your full name"
              />
              <RecordField label="Email" value={profile.email} disabled />
              <RecordField
                label="Phone"
                value={personalForm.phone}
                onChange={(v) => setPersonalForm((p) => ({ ...p, phone: v }))}
                type="tel"
                placeholder="10-digit mobile number"
              />
              <RecordField label="Role" value={profile.role} disabled />
              <RecordField
                label="Date of Birth"
                value={personalForm.dateOfBirth}
                onChange={(v) => setPersonalForm((p) => ({ ...p, dateOfBirth: v }))}
                type="date"
              />
              <RecordSelectField
                label="Gender"
                value={personalForm.gender}
                onChange={(v) => setPersonalForm((p) => ({ ...p, gender: v }))}
                options={GENDER_OPTIONS}
              />
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSavePersonal}
                disabled={savingPersonal}
                className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-7 py-3 text-[13px] font-extrabold text-white shadow-sm transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingPersonal && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {savingPersonal ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </section>

          <SectionDivider />

          {/* ==================== B. ADDRESS ==================== */}
          <section>
            <SectionHeading>Address</SectionHeading>

            <div className="mt-7 space-y-6">
              <RecordField
                label="Address Line 1"
                value={addressForm.addressLine1}
                onChange={(v) => setAddressForm((p) => ({ ...p, addressLine1: v }))}
                placeholder="House / street / area"
              />
              <RecordField
                label="Address Line 2"
                value={addressForm.addressLine2}
                onChange={(v) => setAddressForm((p) => ({ ...p, addressLine2: v }))}
                placeholder="Landmark (optional)"
              />
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3">
                <RecordField
                  label="City"
                  value={addressForm.city}
                  onChange={(v) => setAddressForm((p) => ({ ...p, city: v }))}
                />
                <RecordField
                  label="State"
                  value={addressForm.state}
                  onChange={(v) => setAddressForm((p) => ({ ...p, state: v }))}
                />
                <RecordField
                  label="Postal Code"
                  value={addressForm.postalCode}
                  onChange={(v) => setAddressForm((p) => ({ ...p, postalCode: v }))}
                />
              </div>
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3">
                <RecordField
                  label="Country"
                  value={addressForm.country}
                  onChange={(v) => setAddressForm((p) => ({ ...p, country: v }))}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSaveAddress}
                disabled={savingAddress}
                className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-7 py-3 text-[13px] font-extrabold text-white shadow-sm transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingAddress && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {savingAddress ? "Saving..." : "Save Address"}
              </button>
            </div>
          </section>

          <SectionDivider />

          {/* ==================== C. SECURITY ==================== */}
          <section>
            <SectionHeading>Security</SectionHeading>

            <div className="mt-7 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <PasswordField
                  label="Current Password"
                  value={passwordForm.currentPassword}
                  onChange={(v) =>
                    setPasswordForm((p) => ({ ...p, currentPassword: v }))
                  }
                />
              </div>
              <PasswordField
                label="New Password"
                value={passwordForm.newPassword}
                onChange={(v) => setPasswordForm((p) => ({ ...p, newPassword: v }))}
              />
              <PasswordField
                label="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={(v) =>
                  setPasswordForm((p) => ({ ...p, confirmPassword: v }))
                }
              />
            </div>

            <p className="mt-4 flex items-center gap-1.5 text-[12px] font-medium text-gray-400">
              <Lock className="h-3.5 w-3.5" /> Use at least 8 characters.
            </p>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-7 py-3 text-[13px] font-extrabold text-white shadow-sm transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {changingPassword && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {changingPassword ? "Updating..." : "Change Password"}
              </button>
            </div>
          </section>

          <SectionDivider />

          {/* ==================== D. ACCOUNT INFORMATION ==================== */}
          <section>
            <SectionHeading>Account Information</SectionHeading>

            <div className="mt-7 flex flex-col-reverse items-center gap-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="grid w-full grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <RecordField label="Role" value={profile.role} disabled />
                <div className="space-y-1.5">
                  <label className="text-[11px] font-extrabold uppercase tracking-widest text-gray-500">
                    Account Status
                  </label>
                  <div className="flex items-center gap-2 border-b-2 border-dashed border-gray-200 px-0.5 py-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        profile.status === "ACTIVE" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    <span className="text-[14px] font-bold text-gray-400">
                      {profile.status}
                    </span>
                  </div>
                </div>
                <RecordField label="Joined" value={formatDate(profile.createdAt)} disabled />
                <RecordField
                  label="Last Updated"
                  value={formatDate(profile.updatedAt)}
                  disabled
                />
              </div>

              <RecordSeal label={profile.role} />
            </div>

            {profile.role === "ADMIN" && (
              <a
                href="/admin/ngo-settings"
                className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-dashed border-gray-300 px-5 py-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-[13px] font-extrabold text-gray-900">
                      NGO Settings
                    </p>
                    <p className="text-[12px] font-medium text-gray-500">
                      Organization name, logo, contact details and more live here — not on your personal profile.
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-gray-400" />
              </a>
            )}
          </section>
        </div>
      </motion.div>

      {/* ==================== TOAST ==================== */}
      {createPortalToast(toast)}
    </div>
  );
}

// Small inline "portal" helper kept local to this file: renders the
// toast fixed to the viewport without needing a separate portal target.
function createPortalToast(toast: ToastState | null) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[9999] flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto flex items-center gap-2.5 rounded-xl border-l-4 border-dashed bg-white px-5 py-3.5 shadow-lg ${
              toast.type === "success" ? "border-green-500" : "border-red-500"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            )}
            <span className="text-[13px] font-bold text-gray-900">
              {toast.message}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}