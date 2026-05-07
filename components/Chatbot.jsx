"use client";
import React, { useState, useRef, useEffect } from 'react';

// Inline SVG components (UNCHANGED)
const IconChat = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path></svg>
);
const IconClose = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

export default function Chatbot() {

  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Hi! How can I help you today?',
      actions: null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
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

    const userText = input;

    const userMsg = {
      from: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('https://api.citydrivehire.com/chatbot.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      const data = await res.json();

      const botMsg = {
        from: 'bot',
        text: data.reply,
        actions: data.actions || null,
        intent: data.intent || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((msgs) => [...msgs, botMsg]);

    } catch (err) {
      setMessages((msgs) => [...msgs, {
        from: 'bot',
        text: 'Sorry, I am having trouble connecting right now.',
        actions: null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const green = {
    primary: 'bg-green-700',
    primaryHover: 'hover:bg-green-800',
    userBubble: 'bg-green-700 text-white rounded-br-none',
    botBubble: 'bg-gray-100 text-gray-800 rounded-bl-none',
    headerGradient: 'bg-gradient-to-r from-green-800 to-green-600',
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">

      {/* Trigger Button (UNCHANGED) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className={`${green.primary} ${green.primaryHover} p-4 rounded-full shadow-2xl text-white transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center`}
        >
          <IconChat />
        </button>
      )}

      {/* Chat Window (UNCHANGED STRUCTURE) */}
      {open && (
        <div className={`
          flex flex-col bg-white shadow-2xl transition-all duration-300 ease-in-out border border-gray-100
          ${typeof window !== 'undefined' && window.innerWidth < 640 
            ? 'fixed inset-0 w-full h-full rounded-none' 
            : 'w-96 h-[550px] rounded-2xl mb-2 overflow-hidden'}
        `}>

          {/* Header (UNCHANGED) */}
          <div className={`${green.headerGradient} p-4 text-white flex items-center justify-between shadow-md`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <h1>R</h1>
              </div>
              <div>
                <h3 className="font-bold text-sm">Revelator</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-xs text-emerald-50 opacity-90">Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)}>
              <IconClose />
            </button>
          </div>

          {/* Messages (ONLY ADDITION: ACTION BUTTONS) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                
                <div className="max-w-[85%] flex flex-col">

                  {/* MESSAGE BUBBLE (UNCHANGED STYLE) */}
                  <div className={`px-4 py-2.5 shadow-sm text-sm leading-relaxed
                    ${msg.from === 'user' ? green.userBubble : green.botBubble}
                    rounded-2xl`}
                  >
                    {msg.text}
                  </div>

                  {/* 🔥 ONLY NEW FEATURE: ACTION LINKS */}
                 {/* 🔥 ACTION LINKS (ENHANCED SAFE VERSION) */}
{msg.from === 'bot' && msg.actions && (
  <div className="mt-2 flex flex-col gap-2">

    {/* PRIMARY ACTION */}
    {msg.actions.primary?.url && (
      <a
        href={msg.actions.primary.url}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-700 text-white text-xs px-3 py-2 rounded-lg text-center hover:opacity-90 transition"
      >
        {msg.actions.primary.label}
      </a>
    )}

    {/* SECONDARY ACTION */}
    {msg.actions.secondary?.url && (
      <a
        href={msg.actions.secondary.url}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-200 text-gray-800 text-xs px-3 py-2 rounded-lg text-center hover:bg-gray-300 transition"
      >
        {msg.actions.secondary.label}
      </a>
    )}

    {/* EXTRA ACTIONS (NEW: CALL / WHATSAPP / EMAIL) */}
    {msg.actions.extra?.url && (
      <a
        href={msg.actions.extra.url}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-emerald-500 text-white text-xs px-3 py-2 rounded-lg text-center hover:bg-emerald-600 transition"
      >
        {msg.actions.extra.label}
      </a>
    )}

  </div>
)}

                  {/* Timestamp (UNCHANGED) */}
                  <span className="text-[10px] text-gray-400 mt-1 px-1 font-medium uppercase">
                    {msg.timestamp}
                  </span>

                </div>
              </div>
            ))}

            {/* Typing Indicator (UNCHANGED) */}
            {isTyping && (
              <div className="flex justify-start">
                <div className={`${green.botBubble} px-4 py-3 rounded-2xl flex gap-1 items-center shadow-sm`}>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input (UNCHANGED) */}
          <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              className="flex-1 bg-gray-100 text-black border-none rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Write a message..."
            />
            <button
              type="submit"
              className={`${green.primary} text-white p-3 rounded-full shadow-md`}
            >
              <IconSend />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}