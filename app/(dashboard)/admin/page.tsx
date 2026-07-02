"use client";

import { motion } from "framer-motion";
import { 
  Heart, Users, Calendar, TrendingUp, Plus, 
  Download, Activity, MapPin, MoreHorizontal 
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
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
            className="text-gray-500 font-medium mt-1"
          >
            Here's what's happening at Nishkam Samarpan Foundation today.
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full font-bold text-[13px] text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all">
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#16A34A] rounded-full font-bold text-[13px] text-white shadow-[0_8px_20px_rgba(22,163,74,0.25)] hover:bg-[#15803d] hover:shadow-[0_8px_20px_rgba(22,163,74,0.4)] transition-all transform hover:-translate-y-0.5">
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </motion.div>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
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
            <h3 className="text-3xl font-extrabold text-gray-900">₹15,28,450</h3>
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
            <h3 className="text-3xl font-extrabold text-gray-900">520</h3>
            <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wide">Active Volunteers</p>
          </div>
        </motion.div>

        {/* Card 3: Campaigns */}
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
            <h3 className="text-3xl font-extrabold text-gray-900">18</h3>
            <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wide">Active Campaigns</p>
          </div>
        </motion.div>

        {/* Card 4: Events */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-4 relative overflow-hidden group hover:-translate-y-1.5 transition-transform duration-300 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-orange-50 text-[#f97316] rounded-[1rem] group-hover:scale-110 group-hover:bg-[#f97316] group-hover:text-white transition-all duration-300">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-gray-900">42</h3>
            <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wide">Upcoming Events</p>
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
              {[40, 70, 45, 90, 65, 85, 100, 60, 50, 80, 55, 75].map((height, i) => (
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
                  {[
                    { name: "Michael Scott", campaign: "Education Fund", date: "Today, 10:23 AM", amount: "₹50,000" },
                    { name: "Pam Beesly", campaign: "Health Camp", date: "Today, 09:12 AM", amount: "₹15,000" },
                    { name: "Jim Halpert", campaign: "Food Distribution", date: "Yesterday", amount: "₹25,000" },
                    { name: "Dwight Schrute", campaign: "Tree Plantation", date: "Yesterday", amount: "₹1,00,000" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center font-extrabold text-sm text-[#16a34a] group-hover:bg-[#16a34a] group-hover:text-white transition-colors">
                            {row.name.charAt(0)}
                          </div>
                          <span className="font-extrabold text-gray-800 text-[14px]">{row.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-[13px] font-bold text-gray-500">{row.campaign}</td>
                      <td className="py-4 text-[13px] font-bold text-gray-400">{row.date}</td>
                      <td className="py-4 text-[14px] font-extrabold text-gray-900 text-right">{row.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Right Column (Side Panels) */}
        <div className="flex flex-col gap-8">
          
          {/* Upcoming Events */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-extrabold text-gray-900">Upcoming Events</h3>
              <button className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col gap-6">
              {[
                { title: "Annual Charity Gala", date: "Oct 24", time: "6:00 PM", location: "Grand Hall", color: "bg-orange-50 text-[#f97316]" },
                { title: "Tree Plantation Drive", date: "Oct 28", time: "8:00 AM", location: "Central Park", color: "bg-green-50 text-[#16a34a]" },
                { title: "Blood Donation Camp", date: "Nov 02", time: "10:00 AM", location: "City Hospital", color: "bg-orange-50 text-[#f97316]" },
              ].map((event, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer bg-white border border-transparent hover:border-gray-100 hover:shadow-lg p-3 -mx-3 rounded-[1.5rem] transition-all">
                  <div className={`w-14 h-14 rounded-[1rem] flex flex-col items-center justify-center font-extrabold shrink-0 group-hover:scale-105 transition-transform ${event.color}`}>
                    <span className="text-[10px] uppercase tracking-wider">{event.date.split(" ")[0]}</span>
                    <span className="text-[18px] leading-tight">{event.date.split(" ")[1]}</span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="font-extrabold text-gray-900 group-hover:text-[#16A34A] transition-colors text-[14px]">{event.title}</h4>
                    <div className="flex items-center gap-3 mt-1.5">
                      <p className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-300" /> {event.time}
                      </p>
                      <p className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-300" /> {event.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3.5 rounded-full border-2 border-gray-50 font-bold text-[13px] text-gray-500 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-800 transition-colors">
              View Full Calendar
            </button>
          </motion.div>

          {/* Recent Activity Timeline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
            <h3 className="text-xl font-extrabold text-gray-900 mb-8">Recent Activity</h3>
            
            <div className="relative border-l-2 border-gray-100 ml-3 flex flex-col gap-8 pb-2">
              
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-[#16A34A] border-4 border-white shadow-sm"></div>
                <p className="text-[13px] font-extrabold text-gray-800">New volunteer application</p>
                <p className="text-[12px] font-bold text-gray-400 mt-1 leading-snug">Jane Doe applied for Teaching Assistant role.</p>
                <span className="text-[10px] font-extrabold text-gray-300 mt-2 block uppercase tracking-wider">10 mins ago</span>
              </div>
              
              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-[#F97316] border-4 border-white shadow-sm"></div>
                <p className="text-[13px] font-extrabold text-gray-800">Campaign milestone reached</p>
                <p className="text-[12px] font-bold text-gray-400 mt-1 leading-snug">"Education for All" reached 50% of its goal.</p>
                <span className="text-[10px] font-extrabold text-gray-300 mt-2 block uppercase tracking-wider">2 hours ago</span>
              </div>

              <div className="relative pl-6">
                <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-gray-300 border-4 border-white shadow-sm"></div>
                <p className="text-[13px] font-extrabold text-gray-800">System update</p>
                <p className="text-[12px] font-bold text-gray-400 mt-1 leading-snug">Monthly maintenance completed successfully.</p>
                <span className="text-[10px] font-extrabold text-gray-300 mt-2 block uppercase tracking-wider">Yesterday</span>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}