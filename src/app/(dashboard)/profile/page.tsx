"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  User, Mail, Building, Calendar, Shield, Activity, 
  Award, Clock, Heart, BookOpen
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/profile");
        if (res.status === 401) {
          router.replace("/login");
          return;
        }
        if (!res.ok) throw new Error("Failed to load profile");
        
        const data = await res.json();
        setProfile(data.data);
      } catch (err) {
        setError("Unable to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="p-8 bg-red-50 text-red-600 rounded-3xl border border-red-100 font-bold">
          {error || "Profile not found"}
        </div>
      </div>
    );
  }

  const roleConfigs: Record<string, any> = {
    SUPER_ADMIN: {
      color: "bg-green-700",
      textColor: "text-green-700",
      lightBg: "bg-green-50",
      borderColor: "border-green-200",
      icon: Shield,
    },
    ADMIN: {
      color: "bg-[#16A34A]",
      textColor: "text-[#16A34A]",
      lightBg: "bg-green-50",
      borderColor: "border-green-200",
      icon: Shield,
    },
    VOLUNTEER: {
      color: "bg-[#F97316]",
      textColor: "text-[#F97316]",
      lightBg: "bg-orange-50",
      borderColor: "border-orange-200",
      icon: Activity,
    },
    USER: {
      color: "bg-blue-500",
      textColor: "text-blue-500",
      lightBg: "bg-blue-50",
      borderColor: "border-blue-200",
      icon: User,
    }
  };

  const config = roleConfigs[profile.role] || roleConfigs.USER;
  const RoleIcon = config.icon;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-6">
      
      {/* Profile Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden"
      >
        <div className={`absolute top-0 left-0 w-full h-32 ${config.lightBg}`}></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 mt-12">
          <div className={`w-32 h-32 rounded-[2rem] flex items-center justify-center text-4xl font-extrabold text-white shadow-xl ${config.color} border-4 border-white`}>
            {profile.name?.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{profile.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest ${config.lightBg} ${config.textColor}`}>
                <RoleIcon className="w-3.5 h-3.5" />
                {profile.role.replace("_", " ")}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-bold text-gray-500">
                <Mail className="w-4 h-4" />
                {profile.email}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 items-center md:items-end">
            <span className={`px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase`}>
              Status: {profile.status}
            </span>
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Joined {new Date(profile.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column - General Info */}
        <div className="flex flex-col gap-8 md:col-span-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest mb-4">Organization</h3>
            {profile.ngo ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                    <Building className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{profile.ngo.name}</p>
                    <p className="text-xs font-bold text-gray-500">{profile.ngo.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs font-bold text-gray-400">Not assigned to an NGO.</p>
            )}
          </motion.div>
        </div>

        {/* Right Column - Role Specific Info */}
        <div className="flex flex-col gap-8 md:col-span-2">
          
          {/* VOLUNTEER SPECIFIC VIEW */}
          {profile.role === "VOLUNTEER" && profile.volunteer && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-6"
            >
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest mb-2 border-b border-gray-50 pb-4">Volunteer Impact</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex flex-col p-4 bg-orange-50 rounded-2xl items-center text-center">
                  <Clock className="w-6 h-6 text-orange-500 mb-2" />
                  <span className="text-2xl font-extrabold text-orange-600">{profile.volunteer.hoursCompleted || 0}</span>
                  <span className="text-[10px] font-extrabold text-gray-500 uppercase">Hours</span>
                </div>
                <div className="flex flex-col p-4 bg-green-50 rounded-2xl items-center text-center">
                  <BookOpen className="w-6 h-6 text-green-500 mb-2" />
                  <span className="text-2xl font-extrabold text-green-600">{profile.volunteer.assignedPrograms?.length || 0}</span>
                  <span className="text-[10px] font-extrabold text-gray-500 uppercase">Programs</span>
                </div>
                <div className="flex flex-col p-4 bg-blue-50 rounded-2xl items-center text-center">
                  <Calendar className="w-6 h-6 text-blue-500 mb-2" />
                  <span className="text-2xl font-extrabold text-blue-600">{profile.volunteer.assignedEvents?.length || 0}</span>
                  <span className="text-[10px] font-extrabold text-gray-500 uppercase">Events</span>
                </div>
                <div className="flex flex-col p-4 bg-purple-50 rounded-2xl items-center text-center">
                  <Award className="w-6 h-6 text-purple-500 mb-2" />
                  <span className="text-2xl font-extrabold text-purple-600">{profile.volunteer.certificatesCount || 0}</span>
                  <span className="text-[10px] font-extrabold text-gray-500 uppercase">Certificates</span>
                </div>
              </div>

              {/* Skills */}
              {profile.volunteer.skills && profile.volunteer.skills.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">Skills & Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.volunteer.skills.map((skill: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-bold rounded-full border border-gray-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* USER SPECIFIC VIEW */}
          {profile.role === "USER" && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-50 pb-4">Donation History</h3>
              
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl mb-6">
                <Heart className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Total Contributions</p>
                  <p className="text-2xl font-extrabold text-blue-600">
                    {profile.donations?.length || 0} Donations
                  </p>
                </div>
              </div>

              {profile.donations && profile.donations.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {profile.donations.map((d: any) => (
                    <div key={d.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors">
                      <div>
                        <p className="text-sm font-bold text-gray-900">₹{d.amount}</p>
                        <p className="text-xs text-gray-500 font-medium">{new Date(d.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase">
                        {d.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm font-bold text-gray-400 text-center py-4">No donations yet.</p>
              )}
            </motion.div>
          )}

          {/* ADMIN / SUPER_ADMIN SPECIFIC VIEW */}
          {(profile.role === "ADMIN" || profile.role === "SUPER_ADMIN") && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest mb-4 border-b border-gray-50 pb-4">Administrative Details</h3>
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl">
                <Shield className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-[11px] font-extrabold text-gray-500 uppercase tracking-widest">Access Level</p>
                  <p className="text-xl font-extrabold text-green-700">
                    Full System Access
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
