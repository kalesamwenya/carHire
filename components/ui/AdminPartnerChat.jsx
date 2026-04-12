'use client';
import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

// Branded chat colors
const adminColor = 'bg-green-600 text-white';
const partnerColor = 'bg-blue-600 text-white';

export default function AdminPartnerChat({ user, recipient, fetchMessages, sendMessage }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (fetchMessages && user && recipient) {
      fetchMessages(user.id, recipient.id).then(setMessages);
    }
  }, [user, recipient, fetchMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    await sendMessage(user.id, recipient.id, input);
    setInput('');
    if (fetchMessages) {
      fetchMessages(user.id, recipient.id).then(setMessages);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full max-h-[500px] border rounded-2xl shadow-xl bg-white">
      <div className="px-6 py-4 border-b bg-slate-900 text-white rounded-t-2xl flex items-center justify-between">
        <span className="font-bold text-lg">Direct Chat</span>
        <span className="text-xs opacity-70">{user.role} → {recipient.role}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {messages.length === 0 && <div className="text-center text-slate-400">No messages yet.</div>}
        {messages.map((msg, idx) => (
          <div
            key={msg.id || idx}
            className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md text-sm mb-2 ${msg.sender_id === user.id ? adminColor : partnerColor} ${msg.sender_id === user.id ? 'ml-auto' : 'mr-auto'}`}
          >
            <div>{msg.body}</div>
            <div className="text-xs opacity-60 mt-1 text-right">{new Date(msg.created_at).toLocaleTimeString()}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex items-center gap-2 p-4 border-t bg-white rounded-b-2xl">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded-xl border focus:ring-2 focus:ring-green-500 outline-none"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 disabled:opacity-60"
          disabled={loading || !input.trim()}
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}
