"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Send, User, Search, MoreHorizontal, 
  Paperclip, Smile, Phone, Video, 
  CheckCheck, Filter, Edit3, ChevronLeft, MessageSquare
} from 'lucide-react';


const ProfessionalChat = () => {
  // --- STATE ---
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileChat, setShowMobileChat] = useState(false);
   const { data: session, status } = useSession();

     const partnerName = session?.user?.name;
  
  const scrollRef = useRef(null);
  const currentUser = { id: session?.user?.id, name: partnerName }; // Your Admin ID
  const BASE_API = "https://api.citydrivehire.com";

  // --- FETCH USER DIRECTORY ---
  useEffect(() => {
    const fetchDirectory = async () => {
      try {
        const response = await fetch(`${BASE_API}/admin/users_list.php`);
        const result = await response.json();
        if (result.success) {
          // Map DB fields to your UI structure
          const formatted = result.data.map(u => ({
            id: u.id,
            name: u.role === 'partner' ? (u.business_name || u.name) : u.name,
            lastMsg: "Click to view history", // Could be enhanced with a 'latest message' API
            time: "Active",
            status: 'online',
            unread: 0,
            image: u.image
          }));
          setChats(formatted);
          if (formatted.length > 0) setActiveChat(formatted[0]);
        }
      } catch (error) {
        console.error("Directory fetch failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDirectory();
  }, []);

  // --- FETCH MESSAGES FOR ACTIVE CHAT ---
  useEffect(() => {
    if (!activeChat) return;

    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `${BASE_API}/messages/chat.php?sender_id=${currentUser.id}&recipient_id=${activeChat.id}`
        );
        const result = await response.json();
        if (result.success) {
          setMessages(result.data);
        }
      } catch (error) {
        console.error("Chat history failed:", error);
      }
    };

    fetchHistory();
    // Optional: Set up polling here for real-time feel
  }, [activeChat]);

  // --- SCROLL TO BOTTOM ---
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    setShowMobileChat(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const body = newMessage;
    setNewMessage(""); // Clear input early for better UX

    try {
      const response = await fetch(`${BASE_API}/messages/send.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: currentUser.id,
          recipient_id: activeChat.id,
          body: body
        })
      });

      const result = await response.json();
      if (result.success) {
        // Optimistic update
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender_id: currentUser.id,
          body: body,
          created_at: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error("Send failed:", error);
    }
  };

  const filteredChats = chats.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen md:h-[800px] w-full max-w-8xl mx-auto bg-slate-50 md:rounded-2xl overflow-hidden border border-slate-200">
      
      {/* --- SIDEBAR --- */}
      <div className={`w-full md:w-85 flex flex-col bg-white border-r border-slate-200 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Inbox</h1>
            <Edit3 className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" />
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search directory..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-green-500 transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="px-3 mb-2 flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network</span>
            <Filter className="w-3 h-3 text-slate-400" />
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center text-slate-400 text-xs animate-pulse">Loading directory...</div>
          ) : filteredChats.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => handleChatSelect(chat)}
              className={`p-3 mb-1 flex items-center gap-4 cursor-pointer rounded-2xl transition-all ${
                activeChat?.id === chat.id 
                ? 'bg-green-600 text-white shadow-lg shadow-green-100' 
                : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="relative shrink-0">
                {chat.image ? (
                   <img src={`${BASE_API}/uploads/${chat.image}`} className="w-12 h-12 rounded-xl object-cover" alt="" />
                ) : (
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                    activeChat?.id === chat.id ? 'bg-green-500' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {chat.name.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm truncate">{chat.name}</h3>
                  <span className={`text-[9px] font-bold uppercase ${activeChat?.id === chat.id ? 'text-green-100' : 'text-slate-400'}`}>
                    {chat.time}
                  </span>
                </div>
                <p className={`text-xs truncate ${activeChat?.id === chat.id ? 'text-green-50' : 'text-slate-400'}`}>
                  {chat.lastMsg}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- CHAT AREA --- */}
      <div className={`flex-1 flex flex-col bg-white ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            <header className="h-20 px-6 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <button onClick={() => setShowMobileChat(false)} className="md:hidden p-2 -ml-2 text-slate-600"><ChevronLeft /></button>
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <User className="text-slate-400 w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 leading-tight">{activeChat.name}</h3>
                  <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active Session</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" />
                <MoreHorizontal className="w-5 h-5 text-slate-400 cursor-pointer hover:text-slate-600" />
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
              {messages.map((msg) => {
                const isMe = parseInt(msg.sender_id) === currentUser.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                    <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        isMe ? 'bg-green-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                      }`}>
                        {msg.body}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[9px] text-slate-400 font-bold">
                           {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && <CheckCheck className="w-3 h-3 text-green-500" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </main>

            <footer className="p-6 bg-white border-t border-slate-100">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-100 transition-all">
                <Paperclip className="w-5 h-5 text-slate-400 ml-2 cursor-pointer" />
                <input 
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="bg-green-600 text-white p-2.5 rounded-xl hover:bg-green-700 disabled:bg-slate-200 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
            <div className="p-6 bg-slate-50 rounded-full"><MessageSquare size={40} /></div>
            <p className="text-sm font-medium">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalChat;