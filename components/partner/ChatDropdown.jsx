'use client';

import { useState, useEffect, useRef } from 'react';
import { FaCommentDots } from 'react-icons/fa';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function ChatDropdown() {

    const { data: session } = useSession();

    const [isOpen, setIsOpen] = useState(false);
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const containerRef = useRef(null);
    const soundRef = useRef(null);
    const prevUnreadRef = useRef(0);

    const BASE_API = "https://api.citydrivehire.com";

    const userId = session?.user?.id;

    // =========================================
    // INIT SOUND
    // =========================================
    useEffect(() => {
        soundRef.current = new Audio('/sound/universfield-new-notification-022-370046.mp3');
        soundRef.current.volume = 0.7;
    }, []);

    // =========================================
    // FETCH CHAT THREADS
    // =========================================
    const fetchThreads = async (silent = false) => {

        if (!userId) return;

        try {

            if (!silent) setIsLoading(true);

            const res = await axios.get(
                `${BASE_API}/messages/get-chat-threads.php?user_id=${userId}`
            );

            if (res.data.success) {

                const threads = res.data.data || [];

                setChats(
                    threads.map(t => ({
                        id: t.chat_user_id,
                        name: t.name,
                        image: t.image,
                        msg: t.last_message,
                        time: t.last_time,
                        unread: t.unread
                    }))
                );

                // =========================================
                // SOUND ONLY WHEN NEW UNREAD INCREASES
                // =========================================
                const totalUnread = threads.reduce((sum, t) => sum + Number(t.unread || 0), 0);

                if (
                    prevUnreadRef.current !== 0 &&
                    totalUnread > prevUnreadRef.current
                ) {
                    soundRef.current?.play().catch(() => {});
                }

                prevUnreadRef.current = totalUnread;
            }

        } catch (err) {
            console.error("Chat threads error:", err.message);
        } finally {
            if (!silent) setIsLoading(false);
        }
    };

    // =========================================
    // INITIAL + POLLING (SILENT)
    // =========================================
    useEffect(() => {

        if (!userId) return;

        fetchThreads(false);

        const interval = setInterval(() => {
            fetchThreads(true);
        }, 10000); // 10s polling

        return () => clearInterval(interval);

    }, [userId]);

    // =========================================
    // CLICK OUTSIDE
    // =========================================
    useEffect(() => {
        const handleClick = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div className="relative" ref={containerRef}>

            {/* BUTTON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-full transition-all relative ${
                    isOpen
                        ? 'bg-green-50 text-green-600'
                        : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                }`}
            >
                <FaCommentDots size={18} />

                {/* DOT */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 border-2 border-white rounded-full"></span>
            </button>

            {/* DROPDOWN */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">

                    {/* HEADER */}
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-gray-900 leading-none">
                                Messages
                            </h3>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">
                                Recent Chats
                            </span>
                        </div>

                        <Link
                            href="/partner/chat"
                            onClick={() => setIsOpen(false)}
                            className="text-[10px] text-green-600 font-bold uppercase hover:bg-green-50 px-2 py-1 rounded-lg"
                        >
                            View All
                        </Link>
                    </div>

                    {/* LIST */}
                    <div className="max-h-[360px] overflow-y-auto bg-white">

                        {isLoading ? (
                            <div className="p-10 text-center">
                                <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                <span className="text-[10px] text-gray-400 uppercase font-bold">
                                    Syncing...
                                </span>
                            </div>
                        ) : chats.length > 0 ? (
                            chats.map(chat => (
                                <Link
                                    key={chat.id}
                                    href={`/partner/chat?id=${chat.id}`}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
                                >

                                    {/* AVATAR */}
                                    <div className="relative shrink-0">
                                        {chat.image ? (
                                            <img
                                                src={`${BASE_API}/uploads/${chat.image}`}
                                                className="w-10 h-10 rounded-xl object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xs font-bold text-slate-400">
                                                {chat.name.charAt(0)}
                                            </div>
                                        )}

                                        {chat.unread > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
                                                {chat.unread}
                                            </span>
                                        )}
                                    </div>

                                    {/* TEXT */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <p className="text-sm font-bold text-gray-900 truncate">
                                                {chat.name}
                                            </p>
                                            <span className="text-[9px] text-gray-400 uppercase font-bold">
                                                {chat.time
                                                    ? new Date(chat.time).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })
                                                    : ''}
                                            </span>
                                        </div>

                                        <p className="text-[11px] text-gray-500 truncate mt-0.5">
                                            {chat.msg}
                                        </p>
                                    </div>

                                </Link>
                            ))
                        ) : (
                            <div className="p-10 text-center text-xs text-gray-400">
                                No chats found
                            </div>
                        )}
                    </div>

                    {/* FOOTER */}
                    <div className="p-3 bg-gray-50/50 text-center">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                            Secure Messaging
                        </p>
                    </div>

                </div>
            )}
        </div>
    );
}