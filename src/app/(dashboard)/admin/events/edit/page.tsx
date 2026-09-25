"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, Calendar, MapPin, Clock,
  Users, CheckCircle2, Type, Tag, AlignLeft, UploadCloud, Target, DollarSign
} from "lucide-react";
import { CLOUDINARY_FOLDERS } from "../../../../../lib/cloudinary-folders";
import MediaUploader from "../../../../../components/cloudinary/MediaUploader";
import type { UploadedMedia } from "../../../../../types/cloudinary";

function EditEventForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  // --- STEP 3: Loading & Status States ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- STEP 6: Dropdown Data State ---
  const [dropdownData, setDropdownData] = useState({
    programs: [] as any[],
    categories: [] as string[],
    eventTypes: [] as string[],
    eventStatuses: [] as string[],
    campaignStatuses: [] as string[],
    timezones: [] as string[],
  });

  // --- STEP 1: Empty Form State ---
  const [formData, setFormData] = useState({
    type: "Event",
    title: "",
    category: "",
    status: "",
    date: "",
    endDate: "",
    timeStart: "",
    timeEnd: "",
    venue: "",
    volunteersRequired: "",
    goalAmount: "",
    description: "",
    programId: "",
    coverImage: "",
    coverImagePublicId: "",
  });

  // --- STEP 4 & 5: Fetch Event Details & Dropdowns ---
  useEffect(() => {
    if (!id) {
      setError("No record ID provided.");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch Dropdown Options
        const ddRes = await fetch("/api/admin/events?action=CREATE_DATA");
        const ddJson = await ddRes.json();
        if (ddJson.success) {
          setDropdownData(ddJson.data);
        }

        // Fetch Record Data (Assuming backend returns merged array in records)
        const evRes = await fetch("/api/admin/events");
        const evJson = await evRes.json();
        if (evJson.success) {
          const record = evJson.records.find((r: any) => r.id === id);
          if (record) {

            // Format dates locally
            const start = new Date(record.startDate);
            const end = record.endDate ? new Date(record.endDate) : null;

            const pad = (n: number) => n.toString().padStart(2, "0");

            const formattedDate =
              `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`;

            const formattedEndDate = end
              ? `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`
              : "";

            const formattedTimeStart =
              `${pad(start.getHours())}:${pad(start.getMinutes())}`;

            const formattedTimeEnd = end
              ? `${pad(end.getHours())}:${pad(end.getMinutes())}`
              : "";

            setFormData({
              type: record.type || "Event",
              title: record.title || "",
              category: record.category || "",
              status: record.status || "DRAFT",

              date: formattedDate,
              endDate: formattedEndDate,

              timeStart: formattedTimeStart,
              timeEnd: formattedTimeEnd,

              venue: record.venue || "",
              volunteersRequired: record.maxVolunteers?.toString() || "",
              goalAmount: record.goalAmount?.toString() || "",
              description: record.description || "",
              programId: record.programId || "",

              coverImage: record.coverImage || "",
              coverImagePublicId: record.coverImagePublicId || "",
            });
          } else {
            setError("Record not found.");
          }
        } else {
          setError("Failed to fetch records.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while loading data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- STEP 8 & 9 & 10: Save Changes (PATCH) ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // ================================
    // COMMON VALIDATION
    // ================================

    if (!formData.title.trim()) {
      alert("Title is required.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Description is required.");
      return;
    }

    if (!formData.date) {
      alert("Start date is required.");
      return;
    }

    if (!formData.status) {
      alert("Status is required.");
      return;
    }

    // ================================
    // EVENT VALIDATION
    // ================================

    if (formData.type === "Event") {
      if (!formData.category) {
        alert("Category is required for events.");
        return;
      }

      if (!formData.venue.trim()) {
        alert("Venue is required for events.");
        return;
      }

      if (!formData.timeStart || !formData.timeEnd) {
        alert("Start time and end time are required for events.");
        return;
      }
    }

    // ================================
    // CAMPAIGN VALIDATION
    // ================================

    if (formData.type === "Campaign") {
      if (
        formData.goalAmount === "" ||
        Number(formData.goalAmount) <= 0
      ) {
        alert("A valid goal amount is required for campaigns.");
        return;
      }
    }

    setIsSaving(true);

    try {
      // Re-construct proper Start/End dates
      let startDateObj = new Date();
      let endDateObj = new Date();

      if (formData.type === "Event") {
        startDateObj = new Date(
          `${formData.date}T${formData.timeStart}`
        );

        endDateObj = new Date(
          `${formData.date}T${formData.timeEnd}`
        );
      } else {
        startDateObj = new Date(
          `${formData.date}T00:00`
        );

        if (formData.endDate) {
          endDateObj = new Date(
            `${formData.endDate}T23:59`
          );
        } else {
          endDateObj = new Date(
            `${formData.date}T23:59`
          );
        }
      }

      if (startDateObj >= endDateObj) {
        alert(
          formData.type === "Event"
            ? "Start time must be before end time."
            : "Campaign start date must be before end date."
        );

        setIsSaving(false);
        return;
      }

      const payload = {
  action: "UPDATE",
  recordType: formData.type,
  id: id,

  title: formData.title,
  description: formData.description,
  status: formData.status,

  programId: formData.programId || null,

  coverImage: formData.coverImage || null,
  coverImagePublicId: formData.coverImagePublicId || null,

  startDate: startDateObj.toISOString(),
  endDate: endDateObj.toISOString(),

  ...(formData.type === "Event" && {
    category: formData.category,
    venue: formData.venue,

    maxVolunteers: formData.volunteersRequired
      ? parseInt(formData.volunteersRequired, 10)
      : null,
  }),

  ...(formData.type === "Campaign" && {
    goalAmount: formData.goalAmount
      ? parseFloat(formData.goalAmount)
      : null,
  }),
};

      const res = await fetch("/api/admin/events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      // --- STEP 13: Success/Error Messages ---
      if (data.success) {
        alert("✓ Event Updated Successfully");
        router.push("/admin/events");
      } else {
        alert(data.message || "Unable to update record.");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#fafafa]">
        <div className="w-16 h-16 border-4 border-[#16a34a] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold tracking-widest uppercase">Loading Record Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#fafafa]">
        <p className="text-red-500 font-bold tracking-widest uppercase mb-4">{error}</p>
        <Link href="/admin/events">
          <button className="px-6 py-2 bg-gray-200 rounded-full font-bold text-gray-700">Back to Events</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-8 min-h-screen pb-10">

      {/* --- BACKGROUND MOTIFS --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-green-400/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-orange-400/10 rounded-full blur-[120px]" />
      </div>

      {/* --- PAGE HEADER --- */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4">
        <div>
          <Link href="/admin/events" className="inline-flex items-center gap-2 text-[12px] font-extrabold text-gray-400 hover:text-[#16a34a] transition-colors mb-2 uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-extrabold text-gray-900 tracking-tight"
          >
            Edit {formData.type}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[13px] font-bold text-gray-400 mt-1"
          >
            Modify the details of your existing event or campaign.
          </motion.p>
        </div>
      </div>

      {/* --- EDIT FORM --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden max-w-4xl"
      >
        {/* STEP 12: Disable While Saving */}
        <fieldset disabled={isSaving} className="flex flex-col w-full h-full">
          <form onSubmit={handleSave} className="flex flex-col w-full h-full">

            <div className="p-8 sm:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Image Upload Area */}
                <div className={`col-span-1 md:col-span-2 border-2 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center text-center transition-colors relative group overflow-hidden ${formData.coverImage ? 'border-[#16a34a] bg-green-50' : 'border-gray-200 bg-gray-50 hover:bg-green-50/50'}`}>
                  {formData.coverImage && (
                    <div className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
                      <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="relative z-10 w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud className={`w-6 h-6 ${formData.coverImage ? 'text-[#16a34a]' : 'text-gray-400'}`} />
                  </div>
                  <h4 className="relative z-10 text-[13px] font-extrabold text-gray-900">Change Cover Image</h4>
                  <p className="relative z-10 text-[11px] font-bold text-gray-500 mb-2">Recommended size: 1200x600px</p>
                  <MediaUploader
                    accept="image"
                    multiple={false}
                    folder={
                      formData.type === "Event"
                        ? CLOUDINARY_FOLDERS.events.covers
                        : CLOUDINARY_FOLDERS.campaigns.covers
                    }
                    buttonText={
                      formData.coverImage
                        ? `Replace ${formData.type} Cover`
                        : `Upload ${formData.type} Cover`
                    }
                    onUpload={(media: UploadedMedia) => {
                      setFormData((prev) => ({
                        ...prev,
                        coverImage: media.url,
                        coverImagePublicId: media.publicId,
                      }));
                    }}
                  />
                </div>

                {/* Type Selection (Read-Only Usually, but kept as disabled input to show context) */}
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Type className="w-3.5 h-3.5 text-[#16a34a]" /> Type (Immutable)
                  </label>
                  <input type="text" value={formData.type} disabled className="w-full bg-gray-100 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold text-gray-500 cursor-not-allowed" />
                </div>

                {/* Category Selection */}
                {formData.type === "Event" && (
  <div className="space-y-2">
    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-2">
      <Tag className="w-3.5 h-3.5 text-[#f97316]" />
      Category *
    </label>

    <select
      name="category"
      value={formData.category}
      onChange={handleChange}
      className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#f97316]/20 outline-none appearance-none"
      required
    >
      {dropdownData.categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  </div>
)}
                {/* Title */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <AlignLeft className="w-3.5 h-3.5 text-blue-500" /> {formData.type} Title *
                  </label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none" required />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#16a34a]" /> Date *
                  </label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none text-gray-700" required />
                </div>
                {formData.type === "Campaign" && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#f97316]" />
                      End Date
                    </label>

                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      min={formData.date || undefined}
                      className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#f97316]/20 outline-none text-gray-700"
                    />
                  </div>
                )}

                {/* Program Link */}
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-[#16a34a]" /> Link to Program
                  </label>
                  <select name="programId" value={formData.programId} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none appearance-none">
                    <option value="">None / Standalone</option>
                    {dropdownData.programs.map((prog: any) => (
                      <option key={prog.id} value={prog.id}>{prog.name}</option>
                    ))}
                  </select>
                </div>
                {formData.coverImage && (
                  <div className="relative overflow-hidden rounded-[1.5rem] border border-gray-200">
                    <img
                      src={formData.coverImage}
                      alt={`${formData.type} cover`}
                      className="w-full h-56 object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          coverImage: "",
                          coverImagePublicId: "",
                        }))
                      }
                      className="absolute top-3 right-3 px-4 py-2 rounded-full bg-red-500 text-white text-[11px] font-extrabold shadow-lg hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>

                    <div className="absolute bottom-4 left-4">
                      <span className="text-white text-[11px] font-extrabold uppercase tracking-widest">
                        Cover Preview
                      </span>
                    </div>
                  </div>
                )}
                {/* --- STEP 11: Event Specific Fields --- */}
                {formData.type === "Event" && (
                  <>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#f97316]" /> Venue / Location *
                      </label>
                      <input type="text" name="venue" value={formData.venue} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#f97316]/20 outline-none" required />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-purple-500" /> Start Time *
                      </label>
                      <input type="time" name="timeStart" value={formData.timeStart} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-purple-500/20 outline-none text-gray-700" required />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-purple-500" /> End Time *
                      </label>
                      <input type="time" name="timeEnd" value={formData.timeEnd} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-purple-500/20 outline-none text-gray-700" required />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-[#16a34a]" /> Volunteers Required
                      </label>
                      <input type="number" name="volunteersRequired" value={formData.volunteersRequired} onChange={handleChange} min="0" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" />
                    </div>
                  </>
                )}

                {/* --- STEP 11: Campaign Specific Fields --- */}
                {formData.type === "Campaign" && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                      <DollarSign className="w-3.5 h-3.5 text-yellow-500" /> Goal Amount (₹) *
                    </label>
                    <input type="number" name="goalAmount" value={formData.goalAmount} onChange={handleChange} min="1" className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-yellow-500/20 outline-none" required />
                  </div>
                )}

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    Status
                  </label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-gray-400/20 outline-none appearance-none uppercase tracking-widest">
                    {(formData.type === "Event" ? dropdownData.eventStatuses : dropdownData.campaignStatuses).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">
                    Description & Details *
                  </label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none resize-none custom-scrollbar" required />
                </div>

              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <Link href="/admin/events">
                <button type="button" className="px-8 py-3.5 rounded-full font-bold text-[13px] text-gray-600 bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
              </Link>
              <button type="submit" className="px-10 py-3.5 rounded-full font-bold text-[13px] text-white bg-[#16A34A] hover:bg-[#15803d] shadow-[0_8px_20px_rgba(22,163,74,0.25)] transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {isSaving ? "Saving..." : <><CheckCircle2 className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          </form>
        </fieldset>
      </motion.div>
    </div>
  );
}

export default function EditEventPageWrapper() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-[#fafafa]">
        <div className="w-16 h-16 border-4 border-[#16a34a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <EditEventForm />
    </Suspense>
  );
}