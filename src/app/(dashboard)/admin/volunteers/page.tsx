"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Plus, Users, UserCheck, Calendar, BookOpen,
  Hourglass, Trophy, Eye, Mail, Trash2, X, FileBadge, CheckCircle,
  Clock, MapPin, ChevronDown, MoreVertical, Award, Phone,
  Star, Download, Target, Edit3, AlertCircle, CheckCircle2
} from "lucide-react";

interface Program {
  id: string;
  name: string;
}

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  bio?: string;
  skills: string[];
  availability?: string;
  emergencyContact?: string;
  attendancePercentage: number;
  rating?: number;
  status?: string;
  programs: Program[];
}

export default function VolunteersPage() {
  // STEP 1 — Add States & Fix TypeScript Error
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Modal States
  const [modalType, setModalType] = useState<"PROGRAM" | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [volunteerToModify, setVolunteerToModify] = useState<Volunteer | null>(null);

  // STEP 4/5/6 — Form & Selection States
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    bio: "",
    skills: "",
    availability: "",
    emergencyContact: ""
  });
  const [selectedProgram, setSelectedProgram] = useState("");

  const openDrawer = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setActiveDropdown(null);
  };

  const closeDrawer = () => setSelectedVolunteer(null);

  const filteredVolunteers = volunteers.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.email && v.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (v.phone && v.phone.includes(searchQuery))
  );

  // --- API HANDLERS ---

  async function fetchVolunteers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/volunteers");
      const data = await res.json();
      if (!res.ok) {
        throw new Error("Unable to fetch volunteers");
      }
      if (data.success) {
        setVolunteers(data.volunteers);
        setPrograms(data.programs);
        return data.volunteers;
      }
      return [];
    } catch (err) {
      alert("Unable to load volunteers");
      return [];
    } finally {
      setLoading(false);
    }
    return [];
  }

  useEffect(() => {
    fetchVolunteers();
  }, []);

  // STEP 5 — Edit Volunteer
  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerToModify) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/volunteers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_PROFILE",
          volunteerId: volunteerToModify.id,
          name: editForm.name,
          phone: editForm.phone,
          bio: editForm.bio,
          skills: editForm.skills ? editForm.skills.split(",").map(s => s.trim()) : [],
          availability: editForm.availability,
          emergencyContact: editForm.emergencyContact
        })
      });

      setSaving(false);

      const data = await res.json();
      console.log("PATCH Response", data);
      if (data.success) {
        setIsEditModalOpen(false);
        setVolunteerToModify(null);
        const updatedVolunteers = await fetchVolunteers();

        const updatedVolunteer = updatedVolunteers.find(
          (v: Volunteer) => v.id === volunteerToModify.id
        );

        if (updatedVolunteer) {
          setSelectedVolunteer(updatedVolunteer);
        }

      } else {
        alert(data.message || "Failed to update");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // STEP 6 — Assign Program
  const handleAssignSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!volunteerToModify || !selectedProgram) return;

    try {
      const res = await fetch("/api/admin/volunteers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ASSIGN_PROGRAM",
          volunteerId: volunteerToModify.id,
          programId: selectedProgram
        })
      });

      const data = await res.json();
      if (data.success) {
        setModalType(null);
        setVolunteerToModify(null);
        fetchVolunteers(); // Refresh Data
      } else {
        alert(data.message || "Failed to assign program");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // STEP 7 — Remove Program
  const handleDeleteConfirm = async () => {
    if (!volunteerToModify || !selectedProgram) return;

    try {
      const res = await fetch("/api/admin/volunteers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REMOVE_PROGRAM",
          volunteerId: volunteerToModify.id,
          programId: selectedProgram
        })
      });

      const data = await res.json();
      if (data.success) {
        setIsDeleteModalOpen(false);
        setVolunteerToModify(null);
        closeDrawer();
        fetchVolunteers(); // Refresh Data
      } else {
        alert(data.message || "Failed to remove program");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // STEP 9 — Delete Volunteer
  const handleDeleteVolunteer = async (id: string) => {
    if (!confirm("Are you sure you want to completely delete this volunteer?")) return;

    try {
      const res = await fetch(`/api/admin/volunteers?id=${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        fetchVolunteers(); // Refresh Data
      } else {
        alert(data.message || "Failed to delete volunteer");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // STEP 2 — Show Loading
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#fafafa]">
        <div className="w-16 h-16 border-4 border-[#16a34a] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold tracking-widest uppercase">Loading Volunteers...</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-8 overflow-x-hidden min-h-screen">

      {/* --- UNIQUE BACKGROUND MOTIFS --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 right-10 w-72 h-72 opacity-60 mix-blend-multiply">
          <svg className="absolute w-full h-full overflow-visible" viewBox="0 0 200 200" fill="none">
            <path d="M -50 250 C 50 150, 250 250, 150 50 C 100 -50, -50 50, 50 150" stroke="#f97316" strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round" opacity="0.4" />
          </svg>
          <motion.div animate={{ y: [-5, 5, -5], rotate: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] right-[20%]">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-12 drop-shadow-md">
              <path d="M21.5 2.5L2 10.5L9.5 13.5L21.5 2.5Z" fill="#fb923c" opacity="0.8" />
              <path d="M21.5 2.5L14.5 22L9.5 13.5L21.5 2.5Z" fill="#f97316" />
            </svg>
          </motion.div>
        </div>
        <div className="absolute top-[40%] -left-10 w-96 h-48 opacity-50 mix-blend-multiply">
          <svg className="absolute w-full h-full overflow-visible" viewBox="0 0 300 100" fill="none">
            <path d="M 0 50 Q 75 100, 150 50 T 300 50" stroke="#16a34a" strokeWidth="2" strokeDasharray="5 7" strokeLinecap="round" opacity="0.4" />
          </svg>
          <motion.div animate={{ x: [-10, 10, -10], y: [-3, 3, -3] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[30%] left-[60%]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -rotate-[15deg] drop-shadow-md">
              <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="#22c55e" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>
      </div>

      {/* --- PAGE HEADER --- */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mt-4">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            🙋 Volunteer Management
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-[13px] font-bold text-gray-400 mt-1">
            Recruit, assign, and track your volunteer workforce.
          </motion.p>
        </div>
      </div>

      {/* --- VOLUNTEER MAIN TABLE --- */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="relative z-10 bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] mt-4">
        {/* ADDED w-full AND rounded TO THE SCROLL CONTAINER */}
        <div className="overflow-x-auto custom-scrollbar w-full rounded-[2.5rem]">
          {/* ADDED mb-48 HERE: This adds enough blank space at the bottom so the dropdown never gets cut off */}
          <table className="w-full text-left border-collapse whitespace-nowrap mb-48">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Volunteer Details</th>
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Program</th>
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Attendance</th>
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="py-5 px-6 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {filteredVolunteers.map((vol) => (
                  // Ensures the row containing the dropdown sits on top
                  <motion.tr key={vol.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`hover:bg-white/60 transition-colors group relative ${activeDropdown === vol.id ? 'z-[99]' : 'z-0'}`}>

                    {/* Column 1: Details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center font-extrabold text-lg text-[#16a34a] border border-green-200 shrink-0 shadow-sm overflow-hidden">
                          {vol.image ? (
                            <img src={vol.image} alt={vol.name} className="w-full h-full object-cover" />
                          ) : (
                            vol.name?.charAt(0) ?? "?"
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-extrabold text-gray-900 text-[15px] cursor-pointer hover:text-[#16a34a] transition-colors" onClick={() => openDrawer(vol)}>
                            {vol.name}
                          </span>
                          <span className="font-bold text-gray-400 text-[11px] flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" /> {vol.email}</span>
                          {vol.phone && <span className="font-bold text-gray-400 text-[11px] flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" /> {vol.phone}</span>}
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Assigned Program */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-2">
                        <span className="text-[13px] font-bold text-gray-700 flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-[#16a34a]" />
                          {vol.programs && vol.programs.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {vol.programs.map((program) => (
                                <span
                                  key={program.id}
                                  className="inline-flex w-fit px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold"
                                >
                                  {program.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            "Not Assigned"
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Column 3: Attendance */}
                    <td className="py-4 px-6">
                      <span className="text-[14px] font-extrabold text-gray-900">{vol.attendancePercentage}</span>
                    </td>

                    {/* Column 4: Status */}
                    <td className="py-4 px-6">
                      <span className="bg-green-50 text-[#16a34a] px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-green-100">
                        {vol.status || "ACTIVE"}
                      </span>
                    </td>

                    {/* Column 5: Actions */}
                    <td className={`py-4 px-6 text-right relative ${activeDropdown === vol.id ? 'z-[99]' : 'z-0'}`}>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === vol.id ? null : vol.id)}
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === vol.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            // REVERTED TO DROP DOWNWARD (top-12) to utilize the mb-48 blank space we added
                            className="absolute right-10 top-12 w-48 bg-white rounded-[1.2rem] shadow-[0_10px_40px_rgb(0,0,0,0.15)] border border-gray-100 py-2 z-[999] text-left overflow-hidden origin-top-right"
                          >
                            <button onClick={() => openDrawer(vol)} className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                              <Eye className="w-3.5 h-3.5" /> View Profile
                            </button>
                            <button
                              onClick={() => {
                                setVolunteerToModify(vol);
                                setEditForm({
                                  name: vol.name || "",
                                  phone: vol.phone || "",
                                  bio: vol.bio || "",
                                  skills: vol.skills ? vol.skills.join(", ") : "",
                                  availability: vol.availability || "",
                                  emergencyContact: vol.emergencyContact || ""
                                });
                                setIsEditModalOpen(true);
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                            </button>
                            <button onClick={() => {
                              setVolunteerToModify(vol);
                              if (programs.length > 0) setSelectedProgram(programs[0].id);
                              setModalType("PROGRAM");
                              setActiveDropdown(null);
                            }}
                              className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-[#16a34a] hover:bg-green-50 flex items-center gap-2"
                            >
                              <BookOpen className="w-3.5 h-3.5" /> Assign Program
                            </button>

                            {vol.programs && vol.programs.length > 0 && vol.programs.map((p: any) => (
                              <button key={p.id} onClick={() => { setSelectedProgram(p.id); setVolunteerToModify(vol); setIsDeleteModalOpen(true); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-orange-500 hover:bg-orange-50 flex items-center gap-2">
                                <Trash2 className="w-3.5 h-3.5" /> Remove from {p.name}
                              </button>
                            ))}

                            <div className="h-px bg-gray-100 my-1"></div>

                            <button onClick={() => { handleDeleteVolunteer(vol.id); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-[12px] font-bold text-red-500 hover:bg-red-50 flex items-center gap-2">
                              <Trash2 className="w-3.5 h-3.5" /> Delete Volunteer
                            </button>

                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {filteredVolunteers.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center justify-center text-gray-400">
              <Users className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-[13px] font-bold">No volunteers found.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* --- SLIDE-OVER DRAWER (VIEW VOLUNTEER PROFILE) --- */}
      <AnimatePresence>
        {selectedVolunteer && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDrawer} className="fixed top-[73px] inset-x-0 bottom-0 bg-gray-900/30 backdrop-blur-sm z-[100]" />
            <motion.div
              initial={{ x: "100%", opacity: 0.5 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0.5 }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-[73px] right-0 bottom-0 w-full max-w-[500px] bg-white shadow-2xl z-[101] flex flex-col border-l border-gray-100 overflow-hidden"
            >
              <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
                <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">Volunteer Profile</h2>
                <button onClick={closeDrawer} className="p-2 text-gray-400 hover:text-gray-900 bg-white border border-gray-200 rounded-full shadow-sm transition-all hover:bg-gray-50"><X className="w-4 h-4" /></button>
              </div>

              {/* STEP 8 — Backend aligned drawer */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#fafafa]">

                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-center gap-5 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center font-extrabold text-green-700 shadow-inner text-3xl shrink-0 overflow-hidden">
                    {selectedVolunteer.image ? (
                      <img src={selectedVolunteer.image} alt={selectedVolunteer.name} className="w-full h-full object-cover" />
                    ) : (
                      selectedVolunteer.name.charAt(0)
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-xl font-extrabold text-gray-900 leading-tight">{selectedVolunteer.name}</h3>
                    <p className="text-[12px] font-bold text-[#16a34a] mb-2">{selectedVolunteer.id}</p>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 mb-1"><Mail className="w-3 h-3" /> {selectedVolunteer.email}</div>
                    {selectedVolunteer.phone && <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 mb-1"><Phone className="w-3 h-3" /> {selectedVolunteer.phone}</div>}
                    {selectedVolunteer.bio && <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 mt-1"><MapPin className="w-3 h-3" /> {selectedVolunteer.bio}</div>}
                    {selectedVolunteer.availability && <p className="text-[10px] font-extrabold text-gray-400 mt-2 uppercase tracking-widest">Availability: {selectedVolunteer.availability}</p>}
                  </div>
                </div>

                {selectedVolunteer.skills && selectedVolunteer.skills.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedVolunteer.skills.map((skill: string, i: number) => (
                        <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-[11px] font-extrabold tracking-wide">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Assignments</h4>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[12px] font-extrabold text-gray-900 flex items-center gap-2"><BookOpen className="w-4 h-4 text-[#16a34a]" /> Assigned Programs</span>
                      </div>
                      <ul className="flex flex-col gap-2">
                        {selectedVolunteer.programs && selectedVolunteer.programs.length > 0 ? selectedVolunteer.programs.map((p: any) => (
                          <li key={p.id} className="text-[12px] font-bold text-gray-600 flex items-center gap-2"><Target className="w-3 h-3 text-gray-400" /> {p.name}</li>
                        )) : <li className="text-[11px] text-gray-400 italic">No programs assigned</li>}
                      </ul>
                    </div>
                  </div>
                </div>

              </div>

              <div className="p-4 border-t border-gray-100 bg-white shrink-0">
                <button
                  onClick={() => {
                    setVolunteerToModify(selectedVolunteer);
                    setEditForm({
                      name: selectedVolunteer.name || "",
                      phone: selectedVolunteer.phone || "",
                      bio: selectedVolunteer.bio || "",
                      skills: selectedVolunteer.skills ? selectedVolunteer.skills.join(", ") : "",
                      availability: selectedVolunteer.availability || "",
                      emergencyContact: selectedVolunteer.emergencyContact || ""
                    });
                    setIsEditModalOpen(true);
                  }}
                  className="w-full py-3.5 bg-gray-50 border border-gray-200 rounded-full text-[12px] font-extrabold text-gray-600 hover:bg-gray-100 flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* --- MODAL (EDIT PROFILE) --- */}
      {/* ==================================================== */}
      <AnimatePresence>
        {isEditModalOpen && volunteerToModify && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col z-[121] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Edit Profile</h2>
                  <p className="text-[13px] font-bold text-gray-400 mt-1">{volunteerToModify.name}</p>
                </div>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-full transition-colors border border-gray-200 shadow-sm"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 max-h-[65vh]">
                <form onSubmit={handleEditSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Full Name</label>
                    <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Phone Number</label>
                    <input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Emergency Contact</label>
                    <input type="text" value={editForm.emergencyContact} onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Bio / Address</label>
                    <input type="text" value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Skills (Comma Separated)</label>
                    <input type="text" value={editForm.skills} onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })} placeholder="Teaching, Event Management" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Availability</label>
                    <input type="text" value={editForm.availability} onChange={(e) => setEditForm({ ...editForm, availability: e.target.value })} placeholder="e.g. Weekends, Evenings" className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none" />
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50/50 shrink-0 flex justify-end gap-3">
                <button onClick={() => setIsEditModalOpen(false)} className="px-8 py-3.5 rounded-full font-bold text-[13px] text-gray-600 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">Cancel</button>
                <button
                  onClick={handleEditSave}
                  disabled={saving}
                  className="px-10 py-3.5 rounded-full font-bold text-[13px] text-white bg-[#16A34A] hover:bg-[#15803d]"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* --- MODAL (ASSIGN PROGRAM ONLY) --- */}
      {/* ==================================================== */}
      <AnimatePresence>
        {modalType === "PROGRAM" && volunteerToModify && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalType(null)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col z-[121] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                    Assign Program
                  </h2>
                  <p className="text-[13px] font-bold text-gray-400 mt-1">To {volunteerToModify.name}</p>
                </div>
                <button onClick={() => setModalType(null)} className="p-2 text-gray-400 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-full transition-colors border border-gray-200 shadow-sm"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-8">
                <form onSubmit={handleAssignSave} className="flex flex-col gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Select Program</label>
                    <select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-[1.2rem] py-3.5 px-4 text-sm font-bold focus:ring-2 focus:ring-[#16a34a]/20 outline-none cursor-pointer appearance-none">
                      {programs.map(program => (
                        <option key={program.id} value={program.id}>
                          {program.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50/50 shrink-0 flex justify-end gap-3">
                <button onClick={() => setModalType(null)} className="px-8 py-3.5 rounded-full font-bold text-[13px] text-gray-600 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" onClick={handleAssignSave} className="px-10 py-3.5 rounded-full font-bold text-[13px] text-white bg-[#16A34A] hover:bg-[#15803d] shadow-[0_8px_20px_rgba(22,163,74,0.25)] transition-all flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Assign
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================== */}
      {/* --- CONFIRMATION MODAL (REMOVE FROM PROGRAM) --- */}
      {/* ==================================================== */}
      <AnimatePresence>
        {isDeleteModalOpen && volunteerToModify && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col items-center text-center z-[121]"
            >
              <button onClick={() => setIsDeleteModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-red-50 text-red-500">
                <AlertCircle className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-extrabold text-gray-900 mb-2">Remove from Program?</h3>
              <p className="text-[13px] font-bold text-gray-500 mb-8 leading-relaxed">
                Are you sure you want to remove <strong className="text-gray-800">{volunteerToModify.name}</strong> from their assigned program?
              </p>

              <div className="w-full flex gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3.5 rounded-full font-bold text-[13px] text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button onClick={handleDeleteConfirm} className="flex-1 py-3.5 rounded-full font-bold text-[13px] text-white bg-red-500 hover:bg-red-600 shadow-[0_8px_20px_rgba(239,68,68,0.3)] transition-all">
                  Yes, Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}