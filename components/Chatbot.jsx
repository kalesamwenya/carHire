"use client";
import React, { useState, useRef, useEffect } from 'react';

// Inline SVG components to replace external dependencies
const IconChat = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path></svg>
);
const IconClose = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);
const IconBot = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" y="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>
);

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! How can I help you today?', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, isTyping]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { 
      from: 'user', 
      text: input, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('https://api.citydrivehire.com/chatbot.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      
      setMessages((msgs) => [...msgs, { 
        from: 'bot', 
        text: data.reply, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } catch {
      setMessages((msgs) => [...msgs, { 
        from: 'bot', 
        text: 'Sorry, I am having trouble connecting right now.', 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const brand = {
    primary: 'bg-emerald-700',
    primaryHover: 'hover:bg-emerald-800',
    userBubble: 'bg-emerald-700 text-white rounded-br-none',
    botBubble: 'bg-gray-100 text-gray-800 rounded-bl-none',
    headerGradient: 'bg-gradient-to-r from-emerald-800 to-emerald-600',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Trigger Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className={`${brand.primary} ${brand.primaryHover} p-4 rounded-full shadow-2xl text-white transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center`}
          aria-label="Open chat"
        >
          <IconChat />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className={`
          flex flex-col bg-white shadow-2xl transition-all duration-300 ease-in-out border border-gray-100
          ${typeof window !== 'undefined' && window.innerWidth < 640 
            ? 'fixed inset-0 w-full h-full rounded-none' 
            : 'w-96 h-[550px] rounded-2xl mb-2 overflow-hidden'}
        `}>
          {/* Header */}
          <div className={`${brand.headerGradient} p-4 text-white flex items-center justify-between shadow-md`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30 text-white">
                <IconBot />
              </div>
              <div>
                <h3 className="font-bold text-sm">Support Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-xs text-emerald-50 opacity-90">Online</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setOpen(false)} 
              className="p-1 hover:bg-white/20 rounded-full transition-colors text-white"
            >
              <IconClose />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} transition-opacity duration-300`}>
                <div className={`max-w-[85%] flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-2.5 shadow-sm text-sm leading-relaxed ${msg.from === 'user' ? brand.userBubble : brand.botBubble} rounded-2xl`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1 font-medium uppercase">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className={`${brand.botBubble} px-4 py-3 rounded-2xl flex gap-1 items-center shadow-sm`}>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              className="flex-1 bg-gray-100 border-none rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Write a message..."
              autoFocus
            />
            <button 
              type="submit" 
              disabled={!input.trim()}
              className={`${brand.primary} text-white p-3 rounded-full shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center`}
            >
              <IconSend />
            </button>
          </form>
          
          <div className="text-center py-2 bg-white border-t border-gray-50">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">CityDrive AI</p>
          </div>
        </div>
      )}
    </div>
  );
}