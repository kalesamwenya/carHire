'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa';
import Link from 'next/link';

export default function MessagesDropdown({ isOpen, onToggle }) {
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const prevCountRef = useRef(0);
    const audioRef = useRef(null);
    const router = useRouter();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.citydrivehire.com';

    // Initialize audio only once
    useEffect(() => {
        audioRef.current = new Audio('/sound/universfield-new-notification-040-493469.mp3');
    }, []);

    const fetchMessages = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/support/contact_messages.php`);
            const result = await res.json();
            
            if (result.success && Array.isArray(result.data)) {
                // Filter for messages that need attention (exclude replied ones)
                const customerMessages = result.data.filter(m => m.status !== 'replied');
                const latestInquiries = customerMessages.slice(0, 5); 
                const currentUnread = customerMessages.filter(m => m.status === 'unread').length;

                // Trigger sound only if unread count increases
                if (currentUnread > prevCountRef.current) {
                    audioRef.current?.play().catch(() => {
                        /* Autoplay policy usually blocks this until first user interaction */
                    });
                }

                setMessages(latestInquiries);
                setUnreadCount(currentUnread);
                prevCountRef.current = currentUnread;
            }
        } catch (error) {
            console.error('Dropdown fetch error:', error);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 20000); 
        return () => clearInterval(interval);
    }, [fetchMessages]);

    const handleNotificationClick = (msg) => {
        onToggle(); // Close dropdown
        // Direct navigation to the specific thread
        router.push(`/admin/messages?email=${encodeURIComponent(msg.email)}&subject=${encodeURIComponent(msg.subject || '')}`);
    };

    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className={`p-2.5 transition-all relative rounded-xl ${
                    isOpen 
                    ? 'text-green-600 bg-green-50 shadow-inner' 
                    : 'text-gray-500 hover:text-green-600 hover:bg-gray-50'
                }`}
                title="Support Messages"
            >
                <FaEnvelope className="text-xl" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white shadow-sm"></span>
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    {/* Backdrop to close on click outside (optional but helpful) */}
                    <div className="fixed inset-0 z-40" onClick={onToggle}></div>
                    
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
                        <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-sm text-gray-900">Recent Inquiries</h3>
                            {unreadCount > 0 && (
                                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase">
                                    {unreadCount} New
                                </span>
                            )}
                        </div>

                        <div className="max-h-[380px] overflow-y-auto">
                            {messages.length > 0 ? (
                                messages.map((msg, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => handleNotificationClick(msg)}
                                        className={`px-5 py-4 hover:bg-green-50/30 cursor-pointer border-b border-gray-50 last:border-0 transition-colors relative ${
                                            msg.status === 'unread' ? 'bg-blue-50/10' : ''
                                        }`}
                                    >
                                        {msg.status === 'unread' && (
                                            <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-500 rounded-full"></div>
                                        )}
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-sm truncate pr-2 ${msg.status === 'unread' ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                                                {msg.name}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                                                {new Date(msg.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider truncate mb-1">
                                            {msg.subject || 'Standard Inquiry'}
                                        </p>
                                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                            {msg.message}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="px-5 py-12 text-center">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <FaEnvelope className="text-gray-200 text-lg" />
                                    </div>
                                    <p className="text-xs text-gray-400">Your inbox is empty</p>
                                </div>
                            )}
                        </div>

                        <Link 
                            href="/admin/messages" 
                            onClick={onToggle}
                            className="block py-3 text-center text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-green-600 transition-all border-t border-gray-100"
                        >
                            <span className="flex items-center justify-center gap-2">
                                View All Messages <FaExternalLinkAlt size={10} />
                            </span>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}