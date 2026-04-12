"use client";
import { useState } from "react";
import { FaComments } from "react-icons/fa";

export default function ChatBubble({ onClick, unreadCount = 0 }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl bg-gradient-to-br from-green-600 via-green-500 to-emerald-400 hover:from-green-700 hover:to-emerald-500 text-white font-bold text-lg transition-all duration-200 ${hover ? 'scale-105 drop-shadow-lg' : ''}`}
      style={{ boxShadow: '0 8px 32px 0 rgba(34,197,94,0.25), 0 1.5px 8px 0 rgba(16,185,129,0.10)' }}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label="Open Chat"
    >
      <span className="relative flex items-center">
        <FaComments className="text-3xl drop-shadow-sm" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-bold animate-bounce shadow-md border-2 border-white">
            {unreadCount}
          </span>
        )}
      </span>
      <span className="hidden md:inline tracking-tight text-base font-semibold drop-shadow-sm">Chat</span>
    </button>
  );
}
