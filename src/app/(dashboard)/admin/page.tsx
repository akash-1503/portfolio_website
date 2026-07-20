"use client";

import { motion } from "framer-motion";
import { 
  Heart, Users, Calendar, TrendingUp, Plus, 
  Download, Activity, MapPin, MoreHorizontal,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// --- TYPESCRIPT INTERFACES ---
interface DashboardStats {
  totalDonations: number;
  totalUsers: number;
  totalVolunteers: number;
  totalPrograms: number;
}

interface Donation {
  name: string;
  campaign: string;
  amount: string;
  date: string;
}

interface Activity {
  id: string;
  type: "EVENT" | "CAMPAIGN";
  title: string;
  date: string;
  time: string;
  location: string;
  status: string;
  color?: string;
}

interface DashboardResponse {
  success?: boolean;
  stats: DashboardStats;
  monthlyDonations: number[];
  recentDonations: Donation[];
  activities: Activity[];
}

export default function AdminDashboard() {
  const router = useRouter();
  
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Extracted to a reusable function so it can be called after updates
  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/admin/dashboard", {
        cache: "no-store", // Prevents browser caching
      });

      // Handle Authentication explicitly
      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load dashboard");
      }

      const result = await response.json();
      setDashboard(result);
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // --- ERROR UI ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="p-10 text-center bg-red-50 rounded-3xl border border-red-100">
          <p className="text-red-600 font-extrabold text-lg">{error}</p>
          <button 
            onClick={loadDashboard}
            className="mt-4 px-6 py-2 bg-white border border-red-200 text-red-500 rounded-full font-bold text-[13px] hover:bg-red-100 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-extrabold text-gray-900 tracking-tight"
          >
            Dashboard Overview
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 font-medium mt-3"
          >
            Here's what's happening at Nishkam Samarpan Foundation today.
          </motion.p>
        </div>
        
        {/* --- TOP RIGHT ACTIONS --- */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <Link 
            href="features/messages" 
            className="relative flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-full font-bold text-[13px] text-gray-600 shadow-sm hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all"
          >
            <MessageSquare className="w-4 h-4 text-gray-400" />
            Messages
            
            {/* Pulsing Notification Badge */}
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f97316] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#f97316] border-2 border-white"></span>
            </span>
          </Link>
        </motion.div>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Card 1: Donations */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1.5 transition-transform duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-green-50 text-[#16a34a] rounded-[1rem] group-hover:scale-110 group-hover:bg-[#16a34a] group-hover:text-white transition-all duration-300">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <span className="flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-1.5 rounded-full uppercase tracking-wider">
              <TrendingUp className="w-3 h-3" /> +12.5%
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-gray-900">
              {loading
                ? "Loading..."
                : `₹${Number(dashboard?.stats?.totalDonations ?? 0).toLocaleString()}`}
            </h3>
            <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wide">Total Donations</p>
          </div>
        </motion.div>

        {/* Card 2: Volunteers */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1.5 transition-transform duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-orange-50 text-[#f97316] rounded-[1rem] group-hover:scale-110 group-hover:bg-[#f97316] group-hover:text-white transition-all duration-300">
              <Users className="w-6 h-6 fill-current" />
            </div>
            <span className="flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-1.5 rounded-full uppercase tracking-wider">
              <TrendingUp className="w-3 h-3" /> +4.2%
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-gray-900">
              {loading
                ? "Loading..."
                : dashboard?.stats?.totalVolunteers ?? 0}
            </h3>
            <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wide">Active Volunteers</p>
          </div>
        </motion.div>

        {/* Card 3: Programs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1.5 transition-transform duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-green-50 text-[#16a34a] rounded-[1rem] group-hover:scale-110 group-hover:bg-[#16a34a] group-hover:text-white transition-all duration-300">
              <Activity className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-[11px] font-bold text-[#ea580c] bg-orange-50 px-2.5 py-1.5 rounded-full uppercase tracking-wider">
              <TrendingUp className="w-3 h-3 rotate-180" /> -1.5%
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-gray-900">
              {loading
                ? "Loading..."
                : dashboard?.stats?.totalPrograms ?? 0}
            </h3>
            <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wide">Active Programs</p>
          </div>
        </motion.div>

        {/* Card 4: Total Users */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1.5 transition-transform duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-orange-50 text-[#f97316] rounded-[1rem] group-hover:scale-110 group-hover:bg-[#f97316] group-hover:text-white transition-all duration-300">
              <Users className="w-6 h-6 fill-current" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-gray-900">
              {loading
                ? "Loading..."
                : dashboard?.stats?.totalUsers ?? 0}
            </h3>
            <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wide">Total Members</p>
          </div>
        </motion.div>
      </div>

      {/* --- MAIN DASHBOARD GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Analytics & Tables) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Chart Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">Donation Analytics</h3>
                <p className="text-[13px] font-bold text-gray-400 mt-1">Monthly breakdown of contributions.</p>
              </div>
              <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 transition-all cursor-pointer hover:bg-gray-100">
                <option>This Year</option>
                <option>Last Year</option>
              </select>
            </div>
            
            {/* Themed CSS Bar Chart */}
            <div className="h-64 flex items-end justify-between gap-2 md:gap-4 mt-6">
              {(dashboard?.monthlyDonations?.length === 12 ? dashboard.monthlyDonations : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]).map((height: number, i: number) => (
                <div key={i} className="flex flex-col items-center gap-3 flex-1 group cursor-pointer">
                  <div className="w-full relative bg-gray-50 rounded-t-[1rem] h-full flex items-end overflow-hidden">
                    <div 
                      className={`w-full rounded-t-[1rem] transition-all duration-700 ${i === 6 ? 'bg-[#f97316]' : 'bg-[#16a34a] group-hover:bg-[#15803d]'}`}
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-900 transition-colors">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Donations Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold text-gray-900">Recent Donations</h3>
              <button className="text-[13px] font-bold text-[#16A34A] hover:text-[#15803d] px-4 py-2 rounded-full hover:bg-green-50 transition-colors">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-50">
                    <th className="py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Donor</th>
                    <th className="py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Campaign</th>
                    <th className="py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(!dashboard?.recentDonations || dashboard.recentDonations.length === 0) ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-sm font-bold text-gray-400">No recent donations</td>
                    </tr>
                  ) : (
                    dashboard.recentDonations.map((row: Donation, i: number) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center font-extrabold text-sm text-[#16a34a] group-hover:bg-[#16a34a] group-hover:text-white transition-colors">
                              {row.name ? row.name.charAt(0) : "U"}
                            </div>
                            <span className="font-extrabold text-gray-800 text-[14px]">{row.name || "Unknown"}</span>
                          </div>
                        </td>
                        <td className="py-4 text-[13px] font-bold text-gray-500">{row.campaign || "General"}</td>
                        <td className="py-4 text-[13px] font-bold text-gray-400">{row.date}</td>
                        <td className="py-4 text-[14px] font-extrabold text-gray-900 text-right">{row.amount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Right Column (Side Panels) */}
        <div className="flex flex-col gap-8">
          
          {/* Upcoming Activities */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-extrabold text-gray-900">Upcoming Activities</h3>
              <button className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col gap-6">
              {(!dashboard?.activities || dashboard.activities.length === 0) ? (
                 <div className="py-4 text-center text-sm font-bold text-gray-400">No activities scheduled</div>
              ) : (
                dashboard.activities.map((item: Activity, i: number) => {
                  const dateParts = item.date ? item.date.split(" ") : ["", ""];
                  const defaultColor = i % 2 === 0 ? "bg-orange-50 text-[#f97316]" : "bg-green-50 text-[#16a34a]";
                  const colorClass = item.color || defaultColor;

                  return (
                    <div key={item.id || i} className="flex gap-4 group cursor-pointer bg-white border border-transparent hover:border-gray-100 hover:shadow-lg p-3 -mx-3 rounded-[1.5rem] transition-all">
                      <div className={`w-14 h-14 rounded-[1rem] flex flex-col items-center justify-center font-extrabold shrink-0 group-hover:scale-105 transition-transform ${colorClass}`}>
                        <span className="text-[10px] uppercase tracking-wider">{dateParts[0]}</span>
                        <span className="text-[18px] leading-tight">{dateParts[1]}</span>
                      </div>
                      <div className="flex flex-col justify-center">
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full w-fit mb-1 ${
                            item.type === "EVENT"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {item.type}
                        </span>
                        
                        <h4 className="font-extrabold text-gray-900 group-hover:text-[#16A34A] transition-colors text-[14px]">{item.title}</h4>
                        
                        <div className="flex items-center gap-3 mt-1.5">
                          {item.time && (
                            <p className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-gray-300" /> {item.time}
                            </p>
                          )}
                          {item.location && (
                            <p className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-gray-300" /> {item.location}
                            </p>
                          )}
                        </div>

                        <span
                          className={`text-xs px-2 py-1 rounded-full font-bold w-fit mt-2 ${
                            item.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : item.status === "UPCOMING"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <button className="w-full mt-6 py-3.5 rounded-full border-2 border-gray-50 font-bold text-[13px] text-gray-500 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-800 transition-colors">
              View Full Calendar
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}