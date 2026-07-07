"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Phone, Video, MoreVertical, Info, ArrowLeft, 
  Smile, Paperclip, Image as ImageIcon, Mic, Send, 
  Check, CheckCheck, Clock, MapPin, BookOpen, Calendar, Mail, X
} from "lucide-react";
import Navbar from "@/src/components/Navbar/Navbar";

// --- DUMMY DATA ---
const currentUser = { id: "admin-1", role: "Admin" };

const initialConversations = [
  {
    id: "CHAT-001",
    user: { 
      name: "Rahul Sharma", role: "Volunteer", avatar: "R", online: true,
      email: "rahul.s@example.com", phone: "+91 98765 43210",
      program: "Blood Donation Program", event: "City Blood Camp"
    },
    lastMessage: "Yes Sir, I'll reach by 8 AM.",
    time: "2 min ago",
    unread: 2,
    messages: [
      { id: 1, text: "Hello Rahul, can you help with tomorrow's health camp?", time: "09:15 AM", senderId: "admin-1", status: "read" },
      { id: 2, text: "Yes Sir.", time: "09:20 AM", senderId: "CHAT-001", status: "read" },
      { id: 3, text: "I'll be there before 8 AM.", time: "09:21 AM", senderId: "CHAT-001", status: "read" },
      { id: 4, text: "Great! Please carry your ID card.", time: "09:25 AM", senderId: "admin-1", status: "read" },
      { id: 5, text: "Will do. Should I bring the extra banners?", time: "10:01 AM", senderId: "CHAT-001", status: "delivered" },
      { id: 6, text: "Yes Sir, I'll reach by 8 AM.", time: "10:05 AM", senderId: "CHAT-001", status: "delivered" },
    ]
  },
  {
    id: "CHAT-002",
    user: { 
      name: "Priya Verma", role: "User", avatar: "P", online: false,
      email: "priya.v@example.com", phone: "+91 98765 43211",
      program: null, event: null
    },
    lastMessage: "Donation completed successfully.",
    time: "15 min ago",
    unread: 0,
    messages: [
      { id: 1, text: "Hi, I just wanted to confirm if my recent donation went through?", time: "Yesterday", senderId: "CHAT-002", status: "read" },
      { id: 2, text: "Let me check that for you right away.", time: "Yesterday", senderId: "admin-1", status: "read" },
      { id: 3, text: "Donation completed successfully.", time: "15 min ago", senderId: "CHAT-002", status: "read" }
    ]
  },
  {
    id: "CHAT-003",
    user: { 
      name: "Amit Patel", role: "Admin", avatar: "A", online: true,
      email: "amit.admin@ngo.org", phone: "+91 98765 43212",
      program: "System Admin", event: null
    },
    lastMessage: "Attendance updated for the weekend batch.",
    time: "Yesterday",
    unread: 0,
    messages: [
      { id: 1, text: "Hey, did you get a chance to update the logs?", time: "Yesterday", senderId: "admin-1", status: "read" },
      { id: 2, text: "Attendance updated for the weekend batch.", time: "Yesterday", senderId: "CHAT-003", status: "read" }
    ]
  },
  {
    id: "CHAT-004",
    user: { 
      name: "Sneha Gupta", role: "Volunteer", avatar: "S", online: false,
      email: "sneha.g@example.com", phone: "+91 98765 43213",
      program: "Education Drive", event: "School Kit Dist."
    },
    lastMessage: "I need some help with the supplies.",
    time: "Yesterday",
    unread: 1,
    messages: [
      { id: 1, text: "I need some help with the supplies.", time: "Yesterday", senderId: "CHAT-004", status: "delivered" }
    ]
  }
];

// Role styling helpers
const getRoleColors = (role: string) => {
  switch(role) {
    case 'Admin': return 'bg-green-50 text-[#16a34a] border-green-100';
    case 'Volunteer': return 'bg-orange-50 text-[#f97316] border-orange-100';
    case 'User': return 'bg-blue-50 text-[#3b82f6] border-blue-100';
    default: return 'bg-gray-50 text-gray-600 border-gray-200';
  }
};

const getRoleGradient = (role: string) => {
  switch(role) {
    case 'Admin': return 'from-green-100 to-green-200 text-green-700';
    case 'Volunteer': return 'from-orange-100 to-orange-200 text-orange-700';
    case 'User': return 'from-blue-100 to-blue-200 text-blue-700';
    default: return 'from-gray-100 to-gray-200 text-gray-700';
  }
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedChat = conversations.find(c => c.id === selectedChatId);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat?.messages]);

  // Filters
  const filters = ["All", "Unread", "Users", "Volunteers", "Admins"];
  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (activeFilter === "Unread") matchesFilter = c.unread > 0;
    if (activeFilter === "Users") matchesFilter = c.user.role === "User";
    if (activeFilter === "Volunteers") matchesFilter = c.user.role === "Volunteer";
    if (activeFilter === "Admins") matchesFilter = c.user.role === "Admin";

    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const updatedConversations = conversations.map(chat => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          lastMessage: newMessage,
          time: "Just now",
          messages: [
            ...chat.messages, 
            { id: Date.now(), text: newMessage, time: "Just now", senderId: currentUser.id, status: "sent" }
          ]
        };
      }
      return chat;
    });

    setConversations(updatedConversations);
    setNewMessage("");
  };

  return (
    // Full screen container blocking standard scroll
    <div className="flex flex-col h-screen bg-[#fafafa] overflow-hidden">
      
      {/* Navbar placed at the top */}
      <div className="shrink-0">
        <Navbar />
      </div>

      {/* Main chat UI taking up exactly the remaining height */}
      <div className="relative flex-1 flex gap-4 md:gap-6 overflow-hidden p-4 md:px-6 md:pb-6">
        
        {/* ========================================================= */}
        {/* --- BACKGROUND MOTIFS (Craft & Dotted Lines) --- */}
        {/* ========================================================= */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[2.5rem]">
          {/* Dotted Arch Left to Right */}
          <svg className="absolute w-full h-full opacity-40" viewBox="0 0 1000 500" preserveAspectRatio="none">
            <path d="M -100 400 Q 400 100 1100 400" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round" />
          </svg>
          {/* Dotted Arch Right to Left */}
          <svg className="absolute w-full h-full opacity-30" viewBox="0 0 1000 500" preserveAspectRatio="none">
            <path d="M 1100 200 Q 500 500 -100 200" fill="none" stroke="#16a34a" strokeWidth="2" strokeDasharray="4 6" strokeLinecap="round" />
          </svg>

          {/* Orange Airplane */}
          <motion.div animate={{ y: [-5, 5, -5], x: [-5, 5, -5], rotate: [-2, 2, -2] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[10%] right-[20%]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-12 drop-shadow-md opacity-60">
              <path d="M21.5 2.5L2 10.5L9.5 13.5L21.5 2.5Z" fill="#fb923c" />
              <path d="M21.5 2.5L14.5 22L9.5 13.5L21.5 2.5Z" fill="#f97316" />
            </svg>
          </motion.div>

          {/* Green Airplane */}
          <motion.div animate={{ y: [-8, 8, -8], rotate: [-10, -5, -10] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-[20%] left-[10%]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -rotate-[30deg] drop-shadow-md opacity-50">
              <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="#22c55e" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>

        {/* ========================================================= */}
        {/* --- LEFT SIDEBAR (Conversations List) --- */}
        {/* ========================================================= */}
        <motion.div 
          className={`w-full md:w-[350px] lg:w-[380px] h-full flex-shrink-0 flex flex-col bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[2.5rem] z-10 overflow-hidden transition-all ${selectedChat ? 'hidden md:flex' : 'flex'}`}
        >
          <div className="p-6 pb-4 border-b border-gray-100 bg-gray-50/30 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Messages</h2>
                <p className="text-[12px] font-bold text-gray-400 mt-0.5">Stay connected with your NGO team</p>
              </div>
            </div>
            
            <div className="relative w-full group mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#16A34A] transition-colors" />
              <input 
                type="text" placeholder="Search by name or message..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-[1.2rem] py-3 pl-11 pr-4 text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 transition-all shadow-sm"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
              {filters.map(filter => (
                <button 
                  key={filter} onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-extrabold tracking-wide whitespace-nowrap transition-all ${
                    activeFilter === filter 
                    ? 'bg-gray-800 text-white shadow-md' 
                    : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
            <AnimatePresence>
              {filteredConversations.map(chat => (
                <motion.div 
                  key={chat.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => {setSelectedChatId(chat.id); setShowRightPanel(false);}}
                  className={`p-4 rounded-[1.5rem] mb-2 cursor-pointer transition-all border ${
                    selectedChatId === chat.id 
                    ? 'bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] border-gray-100 scale-[1.02] z-10 relative' 
                    : 'bg-transparent border-transparent hover:bg-white/60 hover:shadow-sm'
                  }`}
                >
                  <div className="flex gap-4 items-center">
                    <div className="relative shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg bg-gradient-to-br ${getRoleGradient(chat.user.role)} shadow-sm border-2 border-white`}>
                        {chat.user.avatar}
                      </div>
                      {chat.user.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#16a34a] border-2 border-white rounded-full"></div>}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <h4 className="text-[14px] font-extrabold text-gray-900 truncate pr-2">{chat.user.name}</h4>
                        <span className={`text-[10px] font-bold whitespace-nowrap ${chat.unread > 0 ? 'text-[#16a34a]' : 'text-gray-400'}`}>{chat.time}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-widest border ${getRoleColors(chat.user.role)}`}>
                          {chat.user.role}
                        </span>
                      </div>
                      <p className={`text-[12px] truncate ${chat.unread > 0 ? 'font-extrabold text-gray-800' : 'font-bold text-gray-500'}`}>
                        {chat.lastMessage}
                      </p>
                    </div>
                    
                    {chat.unread > 0 && (
                      <div className="shrink-0 flex flex-col items-end justify-center">
                        <div className="w-5 h-5 bg-[#16a34a] rounded-full flex items-center justify-center text-[10px] font-extrabold text-white shadow-sm">
                          {chat.unread}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredConversations.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                <Search className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-[12px] font-bold">No conversations found.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* ========================================================= */}
        {/* --- CENTER CHAT AREA --- */}
        {/* ========================================================= */}
        <motion.div 
          className={`flex-1 h-full flex flex-col bg-white/90 backdrop-blur-3xl border border-white/60 shadow-[0_8px_40px_rgb(0,0,0,0.08)] rounded-[2.5rem] z-10 overflow-hidden relative ${!selectedChat ? 'hidden md:flex' : 'flex'}`}
        >
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-5 border-b border-gray-100 bg-white/50 backdrop-blur-md flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedChatId(null)} className="md:hidden p-2 -ml-2 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-full"><ArrowLeft className="w-5 h-5" /></button>
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-lg bg-gradient-to-br ${getRoleGradient(selectedChat.user.role)} shadow-sm border-2 border-white`}>
                      {selectedChat.user.avatar}
                    </div>
                    {selectedChat.user.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#16a34a] border-2 border-white rounded-full"></div>}
                  </div>
                  <div>
                    <h3 className="text-[16px] font-extrabold text-gray-900 flex items-center gap-2">
                      {selectedChat.user.name}
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-widest border ${getRoleColors(selectedChat.user.role)}`}>
                        {selectedChat.user.role}
                      </span>
                    </h3>
                    <p className="text-[11px] font-bold text-gray-400 flex items-center gap-1.5 mt-0.5">
                      {selectedChat.user.online ? (
                        <><span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]"></span> Online</>
                      ) : (
                        <><span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> Offline</>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2.5 text-gray-400 hover:text-[#16a34a] hover:bg-green-50 rounded-full transition-colors hidden sm:flex"><Phone className="w-4 h-4" /></button>
                  <button className="p-2.5 text-gray-400 hover:text-[#16a34a] hover:bg-green-50 rounded-full transition-colors hidden sm:flex"><Video className="w-4 h-4" /></button>
                  <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>
                  <button onClick={() => setShowRightPanel(!showRightPanel)} className={`p-2.5 rounded-full transition-colors ${showRightPanel ? 'bg-gray-800 text-white shadow-md' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}>
                    <Info className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"><MoreVertical className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-50/30 flex flex-col gap-6">
                
                <div className="flex justify-center shrink-0">
                  <span className="px-4 py-1.5 bg-white border border-gray-100 shadow-sm rounded-full text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Today</span>
                </div>

                {selectedChat.messages.map((msg, index) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <motion.div 
                      key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${isMe ? 'self-end' : 'self-start'} shrink-0`}
                    >
                      {!isMe && index === 0 && (
                         <span className="text-[11px] font-extrabold text-gray-500 mb-1 ml-1">{selectedChat.user.name}</span>
                      )}
                      <div className={`px-5 py-3.5 shadow-sm text-[13px] font-bold leading-relaxed ${
                        isMe 
                        ? 'bg-[#16a34a] text-white rounded-[1.5rem] rounded-tr-sm' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-[1.5rem] rounded-tl-sm'
                      }`}>
                        {msg.text}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 mx-1">
                        <span className="text-[10px] font-extrabold text-gray-400">{msg.time}</span>
                        {isMe && (
                          msg.status === 'read' ? <CheckCheck className="w-3.5 h-3.5 text-[#16a34a]" /> : <Check className="w-3.5 h-3.5 text-gray-400" />
                        )}
                      </div>
                    </motion.div>
                  )
                })}
                <div ref={messagesEndRef} className="shrink-0" />
              </div>

              {/* Chat Composer */}
              <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-[1.5rem] p-2 focus-within:ring-2 focus-within:ring-[#16a34a]/20 focus-within:border-[#16a34a]/50 transition-all shadow-sm">
                  
                  <div className="flex gap-1 shrink-0 pb-1 pl-1">
                    <button type="button" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition-colors"><Smile className="w-5 h-5" /></button>
                    <button type="button" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition-colors hidden sm:flex"><Paperclip className="w-5 h-5" /></button>
                    <button type="button" className="p-2 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition-colors"><ImageIcon className="w-5 h-5" /></button>
                  </div>

                  <textarea 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 text-[13px] font-bold text-gray-800 placeholder:text-gray-400 custom-scrollbar outline-none"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />

                  <div className="flex gap-2 shrink-0 pb-1 pr-1">
                    {!newMessage.trim() ? (
                      <button type="button" className="p-2.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition-colors"><Mic className="w-5 h-5" /></button>
                    ) : (
                      <button type="submit" className="p-2.5 bg-[#16a34a] text-white hover:bg-[#15803d] shadow-[0_4px_12px_rgba(22,163,74,0.3)] rounded-full transition-all transform hover:scale-105">
                        <Send className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50/50">
              <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center mb-6">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-4xl">💬</motion.div>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Your Conversations</h2>
              <p className="text-[13px] font-bold text-gray-400 max-w-sm leading-relaxed">
                Select a user, volunteer, or team member from the sidebar to view details and start chatting.
              </p>
            </div>
          )}
        </motion.div>

        {/* ========================================================= */}
        {/* --- RIGHT PANEL (Profile Info) --- */}
        {/* ========================================================= */}
        <AnimatePresence>
          {showRightPanel && selectedChat && (
            <motion.div 
              initial={{ width: 0, opacity: 0, marginLeft: 0 }} 
              animate={{ width: 320, opacity: 1, marginLeft: 24 }} 
              exit={{ width: 0, opacity: 0, marginLeft: 0 }}
              className="hidden xl:flex h-full flex-col flex-shrink-0 bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[2.5rem] z-10 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30 shrink-0">
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest">Profile Info</h3>
                <button onClick={() => setShowRightPanel(false)} className="p-1.5 text-gray-400 hover:text-gray-900 bg-white rounded-full shadow-sm border border-gray-100"><X className="w-4 h-4" /></button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col items-center text-center">
                 <div className="relative mb-4">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center font-extrabold text-3xl bg-gradient-to-br ${getRoleGradient(selectedChat.user.role)} shadow-lg border-4 border-white`}>
                      {selectedChat.user.avatar}
                    </div>
                    {selectedChat.user.online && <div className="absolute bottom-1 right-1 w-5 h-5 bg-[#16a34a] border-4 border-white rounded-full shadow-sm"></div>}
                 </div>
                 
                 <h2 className="text-xl font-extrabold text-gray-900">{selectedChat.user.name}</h2>
                 <span className={`mt-2 px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest border ${getRoleColors(selectedChat.user.role)}`}>
                    {selectedChat.user.role}
                 </span>

                 <div className="w-full mt-8 flex flex-col gap-4">
                   
                   <div className="bg-gray-50 p-4 rounded-[1.5rem] border border-gray-100 text-left">
                     <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Contact Details</p>
                     <div className="flex items-center gap-3 mb-2.5">
                       <Mail className="w-4 h-4 text-gray-400" />
                       <span className="text-[12px] font-bold text-gray-800 truncate">{selectedChat.user.email}</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <Phone className="w-4 h-4 text-gray-400" />
                       <span className="text-[12px] font-bold text-gray-800">{selectedChat.user.phone}</span>
                     </div>
                   </div>

                   {(selectedChat.user.program || selectedChat.user.event) && (
                     <div className="bg-gray-50 p-4 rounded-[1.5rem] border border-gray-100 text-left">
                       <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Assignments</p>
                       {selectedChat.user.program && (
                         <div className="flex items-center gap-3 mb-2.5">
                           <BookOpen className="w-4 h-4 text-[#16a34a]" />
                           <span className="text-[12px] font-bold text-gray-800 truncate">{selectedChat.user.program}</span>
                         </div>
                       )}
                       {selectedChat.user.event && (
                         <div className="flex items-center gap-3">
                           <Calendar className="w-4 h-4 text-[#f97316]" />
                           <span className="text-[12px] font-bold text-gray-800 truncate">{selectedChat.user.event}</span>
                         </div>
                       )}
                     </div>
                   )}
                 </div>
              </div>
              
              <div className="p-4 shrink-0 bg-white border-t border-gray-100">
                 <button className="w-full py-3.5 bg-gray-800 text-white rounded-full font-bold text-[13px] shadow-md hover:bg-gray-900 transition-colors">
                   View Full Profile
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}