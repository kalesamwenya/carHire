"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X, Send, Hash, ArrowLeft, Search, Bell, BellOff, User, Layers } from "lucide-react";

export default function GlobalStaffChat() {
  const pathname = usePathname();
  
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("list");
  const [activeChat, setActiveChat] = useState(null);
  const [currentUser] = useState({ id: 999, name: "Emit Admin", role: "Staff" });
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [unreadCount, setUnreadCount] = useState(3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Dynamic Data States
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);

  const messagesEndRef = useRef(null);
  const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

  // 1. Fetch Users List from your admin endpoint
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASE_API}/admin/user-list.php`);
        const result = await response.json();
        
        if (result.success) {
          const formatted = result.data.map(u => ({
            id: u.id,
            name: u.name,
            // If it's a partner, show business name, otherwise personal name
            displayName: u.role === 'partner' ? (u.business_name || u.name) : u.name,
            role: u.role,
            image: u.image,
            initials: u.name ? u.name.split(' ').map(n => n[0]).join('').toUpperCase() : "??",
            status: 'online' // Mocked status for UI
          }));
          setMembers(formatted);
        }
      } catch (error) {
        console.error("User list fetch failed:", error);
      } finally {
        setIsLoadingMembers(false);
      }
    };

    if (isOpen) fetchUsers();
  }, [isOpen, BASE_API]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, view]);

  // 2. Fetch Chat History
  const fetchChatHistory = async (recipientId) => {
    setIsLoadingMessages(true);
    try {
      const response = await fetch(`${BASE_API}/messages/chat.php?sender_id=${currentUser.id}&recipient_id=${recipientId}`);
      const result = await response.json();
      if (result.success) {
        setMessages(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch chat:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // 3. Send Message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat) return;

    const payload = {
      sender_id: currentUser.id,
      recipient_id: activeChat.id,
      body: messageInput
    };

    try {
      const response = await fetch(`${BASE_API}/messages/send.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (result.success) {
        const newMsg = {
          id: Date.now(),
          sender_id: currentUser.id,
          body: messageInput,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newMsg]);
        setMessageInput("");
      }
    } catch (error) {
      console.error("Message send failed:", error);
    }
  };

  const startChat = (user) => {
    setActiveChat({ id: user.id, name: user.displayName });
    setView("chat");
    setUnreadCount(0);
    fetchChatHistory(user.id);
  };

  const isHiddenRoute = pathname === "/partner/chat" || pathname === "/admin/chat";
  if (isHiddenRoute) return null;

  const filteredMembers = members.filter(m => 
    m.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {isOpen && (
        <div className="w-[380px] h-[600px] bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-4 duration-300">
          
          <header className="bg-slate-900 text-white p-5 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              {view === "chat" && (
                <button onClick={() => setView("list")} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                  <ArrowLeft size={20} />
                </button>
              )}
              <div>
                <h3 className="font-bold text-base leading-tight">
                  {view === "list" ? "Staff Network" : activeChat?.name}
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {view === "list" ? "Directory" : "Active Session"}
                </p>
              </div>
            </div>
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-slate-400 hover:text-white">
              {soundEnabled ? <Bell size={18} /> : <BellOff size={18} />}
            </button>
          </header>

          {view === "list" ? (
            <div className="flex-1 flex flex-col bg-slate-50/50">
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
                    placeholder="Search name or role..."
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-4">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                  <User size={12} /> Direct Messages
                </h4>
                
                {isLoadingMembers ? (
                  <div className="flex justify-center p-8 text-slate-400 text-xs animate-pulse">Syncing Network...</div>
                ) : filteredMembers.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => startChat(m)}
                    className="w-full p-3 mb-1 rounded-2xl hover:bg-white hover:shadow-md transition-all flex items-center gap-3 group text-left"
                  >
                    <div className="relative">
                      {m.image ? (
                        <img src={`${BASE_API}/uploads/${m.image}`} className="w-10 h-10 rounded-xl object-cover" alt="" />
                      ) : (
                        <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-xs font-bold text-slate-500">
                          {m.initials}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <span className="font-semibold block text-slate-700 text-sm leading-tight">{m.displayName}</span>
                        <span className="text-[10px] text-slate-400 capitalize">{m.role}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col bg-slate-50">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoadingMessages ? (
                  <div className="flex justify-center p-10 text-slate-400 text-xs uppercase font-bold tracking-widest">Loading...</div>
                ) : messages.map((msg) => {
                  const isMe = parseInt(msg.sender_id) === currentUser.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[80%]`}>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                          isMe ? "bg-orange-600 text-white rounded-tr-none" : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"
                        }`}>
                          {msg.body}
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
                  className="flex-1 bg-slate-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-600 outline-none"
                  placeholder="Type a message..."
                />
                <button type="submit" className="bg-orange-600 text-white p-3 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                  <Send size={20} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 relative ${
          isOpen ? "bg-slate-800 text-white" : "bg-green-600 text-white"
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-lg">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}