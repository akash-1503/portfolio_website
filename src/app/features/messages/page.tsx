"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Search, ArrowLeft, Send, Check, CheckCheck, MoreVertical } from "lucide-react";
import Navbar from "@/src/components/Navbar/Navbar"; // Adjust path if necessary

// --- DUMMY DATA ---
const currentUser = { id: "admin-1", role: "Admin" };

const initialConversations = [
  {
    id: "CHAT-001",
    user: { name: "Rahul Sharma", avatar: "R", online: true },
    lastMessage: "Yes Sir, I'll reach by 8 AM.",
    time: "10:05 AM",
    unread: 2,
    messages: [
      { id: 1, text: "Hello Rahul, can you help with tomorrow's health camp?", date: "August 18, 2026", time: "09:15 AM", senderId: "admin-1", status: "read" },
      { id: 2, text: "Yes Sir.", date: "August 18, 2026", time: "09:20 AM", senderId: "CHAT-001", status: "read" },
      { id: 3, text: "I'll be there before 8 AM.", date: "August 18, 2026", time: "09:21 AM", senderId: "CHAT-001", status: "read" },
      { id: 4, text: "Great! Please carry your ID card.", date: "August 18, 2026", time: "09:25 AM", senderId: "admin-1", status: "read" },
      { id: 5, text: "Will do. Should I bring the extra banners?", date: "Today", time: "10:01 AM", senderId: "CHAT-001", status: "delivered" },
      { id: 6, text: "Yes Sir, I'll reach by 8 AM.", date: "Today", time: "10:05 AM", senderId: "CHAT-001", status: "delivered" },
    ]
  },
  {
    id: "CHAT-002",
    user: { name: "Priya Verma", avatar: "P", online: false },
    lastMessage: "Donation completed successfully.",
    time: "Yesterday",
    unread: 0,
    messages: [
      { id: 1, text: "Hi, I just wanted to confirm if my recent donation went through?", date: "Yesterday", time: "02:30 PM", senderId: "CHAT-002", status: "read" },
      { id: 2, text: "Let me check that for you right away.", date: "Yesterday", time: "02:35 PM", senderId: "admin-1", status: "read" },
      { id: 3, text: "Donation completed successfully.", date: "Yesterday", time: "03:15 PM", senderId: "CHAT-002", status: "read" }
    ]
  },
  {
    id: "CHAT-003",
    user: { name: "Amit Patel", avatar: "A", online: true },
    lastMessage: "Attendance updated for the weekend batch.",
    time: "Yesterday",
    unread: 0,
    messages: [
      { id: 1, text: "Hey, did you get a chance to update the logs?", date: "Yesterday", time: "11:00 AM", senderId: "admin-1", status: "read" },
      { id: 2, text: "Attendance updated for the weekend batch.", date: "Yesterday", time: "11:45 AM", senderId: "CHAT-003", status: "read" }
    ]
  }
];

// --- FRAMER MOTION VARIANTS ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export default function MessagesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [conversations, setConversations] = useState(initialConversations);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedChat = conversations.find(c => c.id === selectedChatId);

  // Simulate loading state for UX refinement
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChat?.messages]);

  // Filter conversations strictly by search query
  const filteredConversations = conversations.filter(c => 
    c.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedConversations = conversations.map(chat => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          lastMessage: newMessage,
          time: timeString,
          messages: [
            ...chat.messages, 
            { 
              id: Date.now(), 
              text: newMessage, 
              date: "Today", 
              time: timeString, 
              senderId: currentUser.id, 
              status: "sent" 
            }
          ]
        };
      }
      return chat;
    });

    setConversations(updatedConversations);
    setNewMessage("");
  };

  const groupMessagesByDate = (messages: any[]) => {
    const groups: { [key: string]: any[] } = {};
    messages.forEach(msg => {
      if (!groups[msg.date]) groups[msg.date] = [];
      groups[msg.date].push(msg);
    });
    return groups;
  };

  return (
    // Base layer: Soft off-white neomorphic background (Removed craft dots)
    <div className="flex flex-col h-screen bg-[#E8EEF2] overflow-hidden">
      
      {/* Navbar Placeholder */}
      <div className="shrink-0 relative z-10">
        <Navbar />
      </div>

      {/* Main Glassmorphic Container with Neomorphic Drop Shadow */}
      <div className="flex-1 flex w-full max-w-[1400px] mx-auto my-4 md:my-8 overflow-hidden rounded-3xl border border-white/60 bg-white/40 backdrop-blur-xl shadow-[12px_12px_24px_rgba(174,192,206,0.4),-12px_-12px_24px_rgba(255,255,255,0.9)] z-0">
        
        {/* ========================================================= */}
        {/* --- LEFT SIDEBAR (Conversations List) --- */}
        {/* ========================================================= */}
        <div className={`w-full md:w-[380px] flex-shrink-0 flex flex-col border-r border-dashed border-slate-300/60 transition-all ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-dashed border-slate-300/60 shrink-0">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-5">Messages</h2>
            
            {/* Neomorphic Inset Search Bar */}
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none rounded-2xl py-3 pl-11 pr-4 text-sm font-medium text-slate-700 placeholder:text-slate-400 shadow-[inset_3px_3px_6px_rgba(174,192,206,0.4),inset_-3px_-3px_6px_rgba(255,255,255,1)] focus:outline-none focus:ring-2 focus:ring-blue-400/30 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
            {isLoading ? (
              // Loading State UX: Animate-pulse shimmer
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 rounded-2xl flex gap-4 items-center animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-slate-300/40 shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-300/40 rounded w-1/2"></div>
                      <div className="h-3 bg-slate-300/40 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length > 0 ? (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
                {filteredConversations.map(chat => {
                  const isActive = selectedChatId === chat.id;
                  return (
                    <motion.div 
                      variants={itemVariants}
                      key={chat.id} 
                      onClick={() => setSelectedChatId(chat.id)}
                      className={`group p-4 cursor-pointer transition-all duration-300 rounded-2xl flex gap-4 items-center border hover:-translate-y-0.5 ${
                        isActive 
                          ? 'bg-white/80 border-white shadow-[4px_4px_10px_rgba(174,192,206,0.3),-4px_-4px_10px_rgba(255,255,255,0.9)]' 
                          : 'bg-transparent border-transparent hover:bg-white/30 hover:border-white/50'
                      }`}
                    >
                      {/* Neomorphic Avatar */}
                      <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg bg-[#E8EEF2] text-slate-600 shadow-[3px_3px_6px_rgba(174,192,206,0.5),-3px_-3px_6px_rgba(255,255,255,1)] group-hover:scale-105 transition-transform duration-300">
                          {chat.user.avatar}
                        </div>
                        {chat.user.online && (
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-[#f2f6f9] rounded-full shadow-sm"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="text-sm font-bold text-slate-800 truncate pr-2">{chat.user.name}</h4>
                          <span className={`text-[11px] whitespace-nowrap ${chat.unread > 0 ? 'text-blue-500 font-bold' : 'text-slate-500 font-medium'}`}>
                            {chat.time}
                          </span>
                        </div>
                        <p className={`text-xs truncate ${chat.unread > 0 ? 'font-bold text-slate-700' : 'text-slate-500 font-medium'}`}>
                          {chat.lastMessage}
                        </p>
                      </div>
                      
                      {chat.unread > 0 && (
                        <div className="shrink-0">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-500 shadow-[2px_2px_5px_rgba(249,115,22,0.4)] rounded-full flex items-center justify-center text-[11px] font-bold text-white animate-pulse">
                            {chat.unread}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400"
              >
                <Search className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm font-medium">No conversations found.</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* --- CENTER CHAT AREA --- */}
        {/* ========================================================= */}
        <div className={`flex-1 h-full flex flex-col relative ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
          <AnimatePresence mode="wait">
            {selectedChat ? (
              <motion.div 
                key={selectedChat.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col h-full"
              >
                {/* Chat Header (Glassmorphic) */}
                <div className="px-6 py-4 border-b border-dashed border-slate-300/60 bg-white/20 backdrop-blur-md flex items-center justify-between shrink-0">
                  <div className="flex items-center">
                    <button onClick={() => setSelectedChatId(null)} className="md:hidden p-2 -ml-2 mr-3 text-slate-600 shadow-[2px_2px_5px_rgba(174,192,206,0.3),-2px_-2px_5px_rgba(255,255,255,0.9)] rounded-full bg-[#E8EEF2] hover:-translate-y-0.5 transition-transform">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="relative shrink-0 mr-4">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold bg-[#E8EEF2] text-slate-600 shadow-[3px_3px_6px_rgba(174,192,206,0.5),-3px_-3px_6px_rgba(255,255,255,1)]">
                        {selectedChat.user.avatar}
                      </div>
                      {selectedChat.user.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800">{selectedChat.user.name}</h3>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        {selectedChat.user.online ? 'Active now' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  
                  <button className="p-2.5 text-slate-500 hover:text-slate-800 transition-colors rounded-full hover:bg-white/40">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-5">
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col gap-5"
                  >
                    {Object.entries(groupMessagesByDate(selectedChat.messages)).map(([date, msgs]) => (
                      <div key={date} className="flex flex-col gap-5">
                        
                        {/* Dotted Date Separator */}
                        <motion.div variants={itemVariants} className="flex justify-center my-3 relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-dashed border-slate-300/70"></div>
                          </div>
                          <span className="relative px-4 py-1.5 bg-[#E8EEF2] shadow-[inset_2px_2px_4px_rgba(174,192,206,0.3),inset_-2px_-2px_4px_rgba(255,255,255,1)] rounded-full text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            {date}
                          </span>
                        </motion.div>

                        {msgs.map((msg: any) => {
                          const isMe = msg.senderId === currentUser.id;
                          return (
                            <motion.div 
                              variants={itemVariants}
                              key={msg.id} 
                              className={`group flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%] ${isMe ? 'self-end' : 'self-start'} shrink-0`}
                            >
                              <div className={`px-5 py-3 text-[15px] font-medium leading-relaxed border transition-transform duration-300 group-hover:-translate-y-0.5 ${
                                isMe 
                                ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-[20px] rounded-tr-[4px] border-blue-300/30 shadow-[4px_4px_12px_rgba(249,115,22,0.25)]' 
                                : 'bg-white/70 backdrop-blur-md text-slate-700 rounded-[20px] rounded-tl-[4px] border-white/60 shadow-[4px_4px_10px_rgba(174,192,206,0.3),-4px_-4px_10px_rgba(255,255,255,0.8)]'
                              }`}>
                                {msg.text}
                              </div>
                              <div className={`flex items-center gap-1.5 mt-1.5 mx-1.5 ${isMe ? 'text-slate-500' : 'text-slate-400'}`}>
                                <span className="text-[10px] font-bold tracking-wide">{msg.time}</span>
                                {isMe && (
                                  msg.status === 'read' ? <CheckCheck className="w-3.5 h-3.5 text-blue-500" /> : <Check className="w-3.5 h-3.5" />
                                )}
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    ))}
                  </motion.div>
                  <div ref={messagesEndRef} className="shrink-0" />
                </div>

                {/* Chat Composer */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-5 bg-white/30 backdrop-blur-xl border-t border-dashed border-slate-300/60 shrink-0"
                >
                  <form onSubmit={handleSendMessage} className="flex items-end gap-3 max-w-4xl mx-auto">
                    
                    {/* Neomorphic Inset Textarea */}
                    <div className="flex-1 flex items-center bg-[#f4f7f9] rounded-2xl px-5 border border-white shadow-[inset_3px_3px_6px_rgba(174,192,206,0.4),inset_-3px_-3px_6px_rgba(255,255,255,1)] focus-within:ring-2 focus-within:ring-blue-400/20 transition-all duration-300">
                      <textarea 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[52px] py-3.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none"
                        rows={1}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                      />
                    </div>

                    {/* Craft Neomorphic Send Button */}
                    <button 
                      type="submit" 
                      disabled={!newMessage.trim()}
                      className="p-3.5 bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-2xl shadow-[4px_4px_10px_rgba(249,115,22,0.3),-2px_-2px_8px_rgba(255,255,255,0.8)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-300 shrink-0 border border-blue-300/50"
                    >
                      <Send className="w-5 h-5 ml-0.5" />
                    </button>
                  </form>
                </motion.div>
              </motion.div>
            ) : (
              /* Empty State */
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white/10 backdrop-blur-sm"
              >
                <div className="w-20 h-20 bg-[#E8EEF2] rounded-full flex items-center justify-center mb-6 shadow-[5px_5px_10px_rgba(174,192,206,0.5),-5px_-5px_10px_rgba(255,255,255,1)] hover:-translate-y-1.5 transition-transform duration-300">
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center">
                    <Send className="w-4 h-4 text-slate-400 ml-1" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Your Workspace Messages</h2>
                <p className="text-sm font-medium text-slate-500 max-w-xs">
                  Select a conversation from the sidebar to view details and start collaborating.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}