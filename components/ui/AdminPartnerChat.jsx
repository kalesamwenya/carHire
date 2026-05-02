'use client';

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare, X, Send, ArrowLeft, Search, Bell, BellOff, User } from "lucide-react";
import { useSession } from "next-auth/react";

export default function GlobalStaffChat() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("list");
  const [activeChat, setActiveChat] = useState(null);
  
  // Replace this with your actual session user ID
  const [currentUser] = useState({ id: session?.user?.id, name: session?.user?.name, role: session?.user?.role }); 
  
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);

  const messagesEndRef = useRef(null);
  const BASE_API = "https://api.citydrivehire.com";

  // 1. Fetch, Filter Roles, and Exclude Self
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingMembers(true);
      try {
        const response = await fetch(`${BASE_API}/admin/user-list.php`);
        const result = await response.json();
        
        if (result.success) {
          const filtered = result.data
            .filter(u => 
              // Rule 1: Only Admin and Partner roles
              (u.role === 'admin' || u.role === 'partner') && 
              // Rule 2: Exclude the currently logged-in user
              parseInt(u.id) !== currentUser.id
            )
            .map(u => ({
              id: u.id,
              name: u.name,
              displayName: u.role === 'partner' ? (u.business_name || u.name) : u.name,
              role: u.role,
              image: u.image,
              initials: u.name ? u.name.split(' ').map(n => n[0]).join('').toUpperCase() : "??",
              status: 'online'
            }));
          setMembers(filtered);
        }
      } catch (error) {
        console.error("User list fetch failed:", error);
      } finally {
        setIsLoadingMembers(false);
      }
    };

    if (isOpen) fetchUsers();
  }, [isOpen, BASE_API, currentUser.id]);

  // Auto-scroll to bottom of chat
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

  // 3. Send Message logic remains the same...
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
    fetchChatHistory(user.id);
  };

  const isHiddenRoute = pathname === "/partner/chat" || pathname === "/admin/chat";
  if (isHiddenRoute) return null;

  const displayedMembers = members.filter(m => 
    m.displayName.toLowerCase().includes(searchTerm.toLowerCase())
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
                <h3 className="font-bold text-sm leading-tight truncate max-w-[180px]">
                  {view === "list" ? "Staff Directory" : activeChat?.name}
                </h3>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                  {view === "list" ? "Internal Network" : "Connected"}
                </p>
              </div>
            </div>
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="text-slate-400 hover:text-white">
              {soundEnabled ? <Bell size={18} /> : <BellOff size={18} />}
            </button>
          </header>

          {view === "list" ? (
            <div className="flex-1 flex flex-col bg-slate-50/30">
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="Search people..."
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
                {isLoadingMembers ? (
                  <div className="flex justify-center p-10 animate-pulse text-[10px] text-slate-400 font-bold uppercase">Refreshing...</div>
                ) : displayedMembers.length > 0 ? (
                  displayedMembers.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => startChat(m)}
                      className="w-full p-3 mb-1 rounded-2xl hover:bg-white hover:shadow-sm transition-all flex items-center gap-3 group text-left border border-transparent hover:border-slate-100"
                    >
                      <div className="relative">
                        {m.image ? (
                          <img src={`${BASE_API}/uploads/${m.image}`} className="w-10 h-10 rounded-xl object-cover" alt="" />
                        ) : (
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xs font-bold text-slate-400 group-hover:bg-green-50 group-hover:text-green-600">
                            {m.initials}
                          </div>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate leading-tight group-hover:text-green-700">{m.displayName}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{m.role}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-20">
                    <p className="text-xs text-slate-400 italic">No other staff members found.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Chat View remains identical to previous refined version...
            <div className="flex-1 flex flex-col bg-slate-50">
               <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoadingMessages ? (
                  <div className="flex justify-center p-10 text-slate-400 text-[10px] uppercase font-bold tracking-widest animate-pulse">Syncing...</div>
                ) : messages.map((msg) => {
                  const isMe = parseInt(msg.sender_id) === currentUser.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[85%]`}>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm leading-relaxed ${
                          isMe ? "bg-green-600 text-white rounded-tr-none" : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"
                        }`}>
                          {msg.body}
                        </div>
                        <span className="text-[9px] mt-1 text-slate-400 font-bold uppercase">
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
                  className="flex-1 bg-slate-50 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-600 outline-none border border-slate-100"
                  placeholder="Type a message..."
                />
                <button type="submit" className="bg-green-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-green-700 active:scale-95 transition-all">
                  <Send size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 relative ${
          isOpen ? "bg-slate-900 text-white" : "bg-green-600 text-white"
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}