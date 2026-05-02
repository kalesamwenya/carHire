'use client';

import { useState, useEffect, useRef } from 'react';
import { FaCommentDots, FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function ChatDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef(null);
    
    const BASE_API = "https://api.citydrivehire.com";

    // 1. Fetch live directory preview when opened
    useEffect(() => {
        const fetchPreview = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${BASE_API}/admin/users_list.php`);
                const result = await response.json();
                if (result.success) {
                    // Limiting to top 5 for the dropdown preview
                    const formatted = result.data.slice(0, 5).map(u => ({
                        id: u.id,
                        name: u.role === 'partner' ? (u.business_name || u.name) : u.name,
                        msg: "Click to message...", // Placeholder until a 'last message' API is added
                        time: "Active",
                        image: u.image
                    }));
                    setChats(formatted);
                }
            } catch (error) {
                console.error("Preview fetch failed:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) fetchPreview();
    }, [isOpen]);

    // 2. Click-outside logic
    useEffect(() => {
        const handleClick = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full transition-all relative ${
                    isOpen ? 'bg-green-50 text-green-600' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                }`}
            >
                <FaCommentDots size={18} />
                {/* Visual indicator for notifications */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 border-2 border-white rounded-full"></span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 bg-white border-b border-gray-50 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-900 leading-none">Messages</h3>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Recent Contacts</span>
                        </div>
                        <Link 
                            href="/partner/chat" 
                            onClick={() => setIsOpen(false)} 
                            className="text-[10px] text-green-600 font-bold uppercase hover:bg-green-50 px-2 py-1 rounded-lg transition-colors"
                        >
                            View All
                        </Link>
                    </div>
                    
                    <div className="max-h-[360px] overflow-y-auto bg-white">
                        {isLoading ? (
                            <div className="p-10 text-center flex flex-col items-center gap-2">
                                <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Syncing...</span>
                            </div>
                        ) : chats.length > 0 ? (
                            chats.map(chat => (
                                <Link 
                                    key={chat.id} 
                                    href={`/partner/chat?id=${chat.id}`}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="relative shrink-0">
                                        {chat.image ? (
                                            <img 
                                                src={`${BASE_API}/uploads/${chat.image}`} 
                                                className="w-10 h-10 rounded-xl object-cover" 
                                                alt="" 
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xs group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                                                {chat.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <p className="text-sm font-bold text-gray-900 truncate">{chat.name}</p>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase">{chat.time}</span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 truncate mt-0.5">{chat.msg}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="p-10 text-center">
                                <p className="text-xs text-gray-400">No active conversations found.</p>
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-gray-50/50 text-center">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">End to End Encrypted</p>
                    </div>
                </div>
            )}
        </div>
    );
}