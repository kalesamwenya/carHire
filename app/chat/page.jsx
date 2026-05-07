'use client';

import { useState, useEffect, useRef } from "react";
import { Send, Search, Bell, BellOff, User, Hash } from "lucide-react";

export default function StaffChatPage({ user }) {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef([]);
  const messagesEndRef = useRef(null);

  const [currentUser, setCurrentUser] = useState({ 
    id: user?.id || user?.admin_id || user?.pk ? Number(user.id || user.admin_id || user.pk) : null, 
    name: user?.name || "Staff", 
    role: user?.role 
  });

  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [members, setMembers] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);

  const BASE_API = "https://api.citydrivehire.com";

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (user) {
      setCurrentUser({
        id: Number(user.id || user.admin_id || user.pk),
        name: user.name || "Staff",
        role: user.role
      });
    }
  }, [user]);

  const playNotification = () => {
    if (soundEnabled) {
      const audio = new Audio('/sounds/notification.mp3');
      audio.play().catch(() => {}); 
    }
  };

  const fetchChatHistory = async (recipientId) => {
    if (!recipientId || !currentUser.id) return;
    try {
      const response = await fetch(`${BASE_API}/messages/chat.php?sender_id=${currentUser.id}&recipient_id=${recipientId}`);
      const result = await response.json();
      if (result.success) {
        if (messagesRef.current.length > 0 && result.data.length > messagesRef.current.length) {
          const lastMsg = result.data[result.data.length - 1];
          if (Number(lastMsg.sender_id) !== currentUser.id) playNotification();
        }
        setMessages(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch chat:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Initial Fetch: Directory
  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser.id) return;
      setIsLoadingMembers(true);
      try {
        const response = await fetch(`${BASE_API}/admin/user-list.php`);
        const result = await response.json();
        if (result.success) {
          const filtered = result.data
            .filter(u => (u.role === 'admin' || u.role === 'partner') && Number(u.id) !== currentUser.id)
            .map(u => ({
              id: u.id,
              displayName: u.role === 'partner' ? (u.business_name || u.name) : u.name,
              role: u.role,
              image: u.image,
              initials: u.name ? u.name.split(' ').map(n => n[0]).join('').toUpperCase() : "??"
            }));
          setMembers(filtered);
        }
      } catch (error) {
        console.error("User list fetch failed:", error);
      } finally {
        setIsLoadingMembers(false);
      }
    };
    fetchUsers();
  }, [currentUser.id]);

  // Polling for new messages
  useEffect(() => {
    let interval;
    if (activeChat?.id) {
      interval = setInterval(() => {
        fetchChatHistory(activeChat.id);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [activeChat?.id, currentUser.id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat || !currentUser.id) return;
    const payload = { sender_id: currentUser.id, recipient_id: activeChat.id, body: messageInput };
    try {
      const response = await fetch(`${BASE_API}/messages/chat.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (result.success) {
        setMessageInput("");
        fetchChatHistory(activeChat.id); 
      }
    } catch (error) {
      console.error("Message send failed:", error);
    }
  };

  const startChat = (targetUser) => {
    setActiveChat({ id: targetUser.id, name: targetUser.displayName });
    setIsLoadingMessages(true);
    fetchChatHistory(targetUser.id);
  };

  const filteredMembers = members.filter(m => 
    m.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm m-4">
      {/* SIDEBAR: Staff List */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-6 border-b border-slate-100 bg-white">
          <h1 className="text-xl font-bold text-slate-800 mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all"
              placeholder="Search staff..."
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {isLoadingMembers ? (
            <div className="flex justify-center p-10 text-[10px] text-slate-400 font-bold uppercase animate-pulse">Loading Directory...</div>
          ) : filteredMembers.map((m) => (
            <button
              key={m.id}
              onClick={() => startChat(m)}
              className={`w-full p-3 rounded-2xl transition-all flex items-center gap-3 group text-left ${
                activeChat?.id === m.id ? "bg-white shadow-md border-slate-100" : "hover:bg-white/80 border-transparent"
              } border`}
            >
              <div className="relative">
                {m.image ? (
                  <img src={`${BASE_API}/uploads/${m.image}`} className="w-12 h-12 rounded-2xl object-cover" alt="" />
                ) : (
                  <div className="w-12 h-12 bg-slate-200 rounded-2xl flex items-center justify-center text-xs font-bold text-slate-500">
                    {m.initials}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm truncate ${activeChat?.id === m.id ? "text-green-700" : "text-slate-800"}`}>
                  {m.displayName}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{m.role}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT: Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeChat ? (
          <>
            <header className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{activeChat.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Now</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)} 
                className={`p-2 rounded-xl transition-colors ${soundEnabled ? "text-green-600 bg-green-50" : "text-slate-400 bg-slate-50"}`}
              >
                {soundEnabled ? <Bell size={20} /> : <BellOff size={20} />}
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
              {isLoadingMessages ? (
                <div className="flex justify-center p-10 text-[10px] text-slate-400 uppercase font-bold tracking-widest animate-pulse">Syncing Conversation...</div>
              ) : messages.length > 0 ? (
                messages.map((msg) => {
                  const isMe = Number(msg.sender_id) === currentUser.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[70%]`}>
                        <div className={`px-5 py-3 rounded-2xl text-[15px] shadow-sm leading-relaxed ${
                          isMe ? "bg-green-600 text-white rounded-tr-none" : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"
                        }`}>
                          {msg.body}
                        </div>
                        <span className="text-[10px] mt-1.5 text-slate-400 font-bold uppercase tracking-tight">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Hash size={32} />
                  </div>
                  <p className="text-sm font-medium">No messages yet. Send a greeting!</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <footer className="p-6 bg-white border-t border-slate-100">
              <form onSubmit={handleSend} className="flex gap-3 max-w-4xl mx-auto">
                <input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 bg-slate-100 border-none rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-green-600 transition-all"
                  placeholder={`Message ${activeChat.name}...`}
                />
                <button type="submit" className="bg-green-600 text-white px-6 rounded-2xl shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 font-bold text-sm">
                  <Send size={18} />
                  Send
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50">
            <div className="w-20 h-20 bg-white shadow-xl rounded-[2.5rem] flex items-center justify-center mb-6 text-green-600">
              <MessageSquare size={40} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Your Inbox</h2>
            <p className="text-slate-500 mt-2 max-w-xs text-center text-sm">
              Select a staff member from the directory to start a secure internal conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}