"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, X, Send, Hash, ArrowLeft, Search, Bell, BellOff, User, Layers } from "lucide-react";

// Mockup Data for Development
const MOCK_CHANNELS = [
  { id: 1, name: "general", type: "public" },
  { id: 2, name: "announcements", type: "public" },
];

const MOCK_UNITS = [
  { id: 101, name: "Photography Dept", type: "department" },
  { id: 102, name: "Web Development", type: "department" },
];

const MOCK_MEMBERS = [
  { id: 501, name: "Mr. Charles", initials: "MC", avatar_url: null, status: 'online' },
  { id: 502, name: "Sarah Phiri", initials: "SP", avatar_url: null, status: 'offline' },
];

const MOCK_MESSAGES = [
  { id: 1, sender_id: 501, content: "Has the venue branding been finalized?", created_at: "2026-05-01 10:00:00" },
  { id: 2, sender_id: 999, content: "Yes, just waiting on the final prints.", created_at: "2026-05-01 10:05:00" }, // 999 is 'Me'
];

export default function GlobalStaffChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("list"); // 'list' or 'chat'
  const [activeChat, setActiveChat] = useState(null);
  const [currentUser, setCurrentUser] = useState({ id: 999, name: "Emit Admin", role: "Staff" });

  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [unreadCount, setUnreadCount] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, view]);

  // Toggle handlers
  const toggleOpen = () => setIsOpen((prev) => !prev);
  
  const handleSend = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender_id: currentUser.id,
      content: messageInput,
      created_at: new Date().toISOString(),
    };

    setMessages([...messages, newMsg]);
    setMessageInput("");
  };

  const startChat = (item) => {
    setActiveChat(item);
    setView("chat");
    setUnreadCount(0); // Mock clear unread
  };

  // Filter logic
  const query = searchTerm.toLowerCase();
  const filteredChannels = MOCK_CHANNELS.filter(c => c.name.toLowerCase().includes(query));
  const filteredUnits = MOCK_UNITS.filter(u => u.name.toLowerCase().includes(query));
  const filteredMembers = MOCK_MEMBERS.filter(m => m.name.toLowerCase().includes(query));

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {isOpen && (
        <div className="w-[380px] h-[600px] bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <header className="bg-slate-900 text-white p-5 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              {view === "chat" && (
                <button 
                  onClick={() => setView("list")}
                  className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <div>
                <h3 className="font-bold text-base leading-tight">
                  {view === "list" ? "Staff Network" : activeChat?.name}
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {view === "list" ? "Emit Photography" : "Active Session"}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {soundEnabled ? <Bell size={18} /> : <BellOff size={18} />}
            </button>
          </header>

          {/* LIST VIEW */}
          {view === "list" && (
            <div className="flex-1 flex flex-col bg-slate-50/50">
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm"
                    placeholder="Search people or channels..."
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6">
                {/* Channels Section */}
                <section>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                    <Hash size={12} /> Company Channels
                  </h4>
                  {filteredChannels.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => startChat(c)}
                      className="w-full p-3 mb-1 rounded-2xl hover:bg-white hover:shadow-md transition-all flex items-center gap-3 group text-left"
                    >
                      <div className="bg-orange-100 text-orange-600 p-2 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <Hash size={18} />
                      </div>
                      <span className="font-semibold text-slate-700 text-sm italic">#{c.name}</span>
                    </button>
                  ))}
                </section>

                {/* Units Section */}
                <section>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                    <Layers size={12} /> Departments
                  </h4>
                  {filteredUnits.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => startChat(u)}
                      className="w-full p-3 mb-1 rounded-2xl hover:bg-white hover:shadow-md transition-all flex items-center gap-3 group text-left"
                    >
                      <div className="bg-blue-50 text-blue-600 p-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Layers size={18} />
                      </div>
                      <span className="font-semibold text-slate-700 text-sm">{u.name}</span>
                    </button>
                  ))}
                </section>

                {/* Staff Section */}
                <section>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                    <User size={12} /> Direct Messages
                  </h4>
                  {filteredMembers.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => startChat(m)}
                      className="w-full p-3 mb-1 rounded-2xl hover:bg-white hover:shadow-md transition-all flex items-center gap-3 group text-left"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-xs font-bold text-slate-500">
                          {m.initials}
                        </div>
                        {m.status === 'online' && (
                          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <span className="font-semibold text-slate-700 text-sm">{m.name}</span>
                    </button>
                  ))}
                </section>
              </div>
            </div>
          )}

          {/* CHAT VIEW */}
          {view === "chat" && (
            <div className="flex-1 flex flex-col bg-slate-50">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex justify-center my-4">
                   <span className="bg-slate-200 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Today</span>
                </div>
                
                {messages.map((msg, i) => {
                  const isMe = msg.sender_id === currentUser.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[80%]`}>
                        {!isMe && <span className="text-[10px] font-bold text-slate-400 mb-1 ml-1">Staff Member</span>}
                        <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                          isMe ? "bg-orange-600 text-white rounded-tr-none" : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"
                        }`}>
                          {msg.content}
                        </div>
                        <span className="text-[9px] mt-1 text-slate-400 font-medium">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                <input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 bg-slate-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-600 outline-none transition-all"
                  placeholder="Type a message..."
                />
                <button 
                   type="submit"
                   className="bg-orange-600 text-white p-3 rounded-2xl shadow-lg shadow-orange-100 hover:scale-105 active:scale-95 transition-all"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Main Floating Trigger */}
      <button
        onClick={toggleOpen}
        className={`p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 relative ${
          isOpen ? "bg-slate-800 text-white" : "bg-orange-600 text-white"
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}