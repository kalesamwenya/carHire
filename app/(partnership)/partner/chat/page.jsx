"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, User, Search, MoreHorizontal, 
  Paperclip, Smile, Phone, Video, 
  CheckCheck, Filter, Edit3 
} from 'lucide-react';

const ProfessionalChat = () => {
  // Mockup Data with refined structure
  const [chats] = useState([
    { id: 1, name: "Mr. Charles", lastMsg: "Payment confirmed for the event.", time: "10:30", status: 'online', unread: 2 },
    { id: 2, name: "Sarah (Wedding Client)", lastMsg: "Can we add more prints?", time: "Yesterday", status: 'offline', unread: 0 },
    { id: 3, name: "Vivid Choice Logistics", lastMsg: "The logo files look great.", time: "Mon", status: 'online', unread: 0 },
  ]);

  const [activeChat, setActiveChat] = useState(chats[0]);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'client', text: "Hello! Checking on the status of the wedding photos?", time: "10:00 AM", status: 'read' },
    { id: 2, sender: 'me', text: "Hi! I'm currently editing the ceremony shots. They look amazing!", time: "10:05 AM", status: 'read' },
    { id: 3, sender: 'client', text: "Great! Can't wait to see them.", time: "10:10 AM", status: 'received' },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: messages.length + 1,
      sender: 'me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages([...messages, msg]);
    setNewMessage("");
  };

  return (
    <div className="flex h-[750px] w-full max-w-8xl mx-auto bg-slate-50 rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
      
      {/* --- LEFT SIDEBAR --- */}
      <div className="w-80 flex flex-col bg-white border-r border-slate-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Messages</h1>
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Edit3 className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-3">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recent Chats</span>
            <Filter className="w-3 h-3 text-slate-400 cursor-pointer" />
          </div>
          
          {chats.map((chat) => (
            <div 
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`group p-3 mb-1 flex items-center gap-4 cursor-pointer rounded-xl transition-all ${
                activeChat.id === chat.id 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                  activeChat.id === chat.id ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {chat.name.charAt(0)}
                </div>
                {chat.status === 'online' && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={`font-semibold text-sm truncate ${activeChat.id === chat.id ? 'text-white' : 'text-slate-900'}`}>
                    {chat.name}
                  </h3>
                  <span className={`text-[10px] ${activeChat.id === chat.id ? 'text-blue-100' : 'text-slate-400'}`}>
                    {chat.time}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className={`text-xs truncate ${activeChat.id === chat.id ? 'text-blue-50' : 'text-slate-500'}`}>
                    {chat.lastMsg}
                  </p>
                  {chat.unread > 0 && activeChat.id !== chat.id && (
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <header className="h-20 px-8 border-b border-slate-200 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <User className="text-slate-600 w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 tracking-tight">{activeChat.name}</h3>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${activeChat.status === 'online' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                <span className="text-[11px] text-slate-400 font-medium capitalize">{activeChat.status}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {[Phone, Video, MoreHorizontal].map((Icon, i) => (
              <button key={i} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </header>

        {/* Messaging Area */}
        <main className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#F8FAFC]">
          <div className="flex justify-center mb-8">
            <span className="px-3 py-1 bg-slate-200/50 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
              Today
            </span>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'} max-w-[65%]`}>
                <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  msg.sender === 'me' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 px-1">
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{msg.time}</span>
                  {msg.sender === 'me' && (
                    <CheckCheck className={`w-3.5 h-3.5 ${msg.status === 'read' ? 'text-blue-500' : 'text-slate-300'}`} />
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </main>

        {/* Input Bar */}
        <footer className="p-6 bg-white border-t border-slate-200">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-slate-100 p-2 rounded-2xl border border-transparent focus-within:border-blue-200 focus-within:bg-white focus-within:shadow-inner transition-all">
            <button type="button" className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            
            <input 
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Write a message..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 text-slate-700"
            />
            
            <button type="button" className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
              <Smile className="w-5 h-5" />
            </button>
            
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-blue-600 disabled:bg-slate-300 text-white p-2.5 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default ProfessionalChat;