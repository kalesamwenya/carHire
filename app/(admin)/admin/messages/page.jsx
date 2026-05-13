'use client';

import CityDriveLoader from '@/components/CityDriveLoader';
import { useState, useEffect, useMemo, useRef } from 'react';
import { FaSearch, FaTrash, FaChevronLeft, FaPaperPlane, FaUserCircle, FaCircle } from 'react-icons/fa';

export default function MessagesPage() {
    const [inquiries, setInquiries] = useState([]);
    const [selectedThread, setSelectedThread] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [reply, setReply] = useState('');
    const [showMobileDetail, setShowMobileDetail] = useState(false);

    const chatEndRef = useRef(null);
    const textareaRef = useRef(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.citydrivehire.com';

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [selectedThread, inquiries]);

    const fetchMessages = async (isInitial = false) => {
        try {
            const res = await fetch(`${API_URL}/support/contact_messages.php`);
            const result = await res.json();
            if (result.success && Array.isArray(result.data)) {
                setInquiries(result.data);
                
                // Desktop Auto-select first thread on initial load
                if (isInitial && result.data.length > 0 && !selectedThread && window.innerWidth > 768) {
                    const first = result.data[0];
                    setSelectedThread({ email: first.email, subject: first.subject });
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

  useEffect(() => {
    // 1. Initial fetch
    fetchMessages(true);

    // 2. Setup interval for auto-polling (every 30 seconds)
    const pollInterval = setInterval(() => {
        // We pass 'false' because we don't want to auto-select the first thread 
        // and interrupt the admin if they are already reading a different one.
        fetchMessages(false);
    }, 20000); 

    // 3. Clean up on unmount
    return () => clearInterval(pollInterval);
}, [selectedThread]); // Added selectedThread to dependency so it knows the current state

    // Grouping logic for threads
    const conversationThreads = useMemo(() => {
        const groups = inquiries.reduce((acc, item) => {
            const threadKey = `${item.email}-${item.subject || 'No Subject'}`;
            if (!acc[threadKey]) acc[threadKey] = [];
            acc[threadKey].push(item);
            return acc;
        }, {});

        return Object.values(groups).sort((a, b) => {
            const lastA = new Date(a[a.length - 1].created_at);
            const lastB = new Date(b[b.length - 1].created_at);
            return lastB - lastA;
        });
    }, [inquiries]);

    const filteredThreads = conversationThreads.filter((thread) => {
        const first = thread[0];
        const searchStr = `${first.name} ${first.email} ${first.subject}`.toLowerCase();
        return searchStr.includes(searchTerm.toLowerCase());
    });

    const activeChat = useMemo(() => {
        if (!selectedThread) return [];
        return inquiries
            .filter(i => i.email === selectedThread.email && i.subject === selectedThread.subject)
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }, [inquiries, selectedThread]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!reply.trim() || !selectedThread || sending) return;

        setSending(true);
        try {
            const res = await fetch(`${API_URL}/support/reply_message.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: selectedThread.email,
                    subject: selectedThread.subject || "Support Inquiry",
                    message: reply,
                    admin_name: "CityDrive Support"
                }),
            });

            const result = await res.json();
            if (result.success) {
                setReply('');
                if (textareaRef.current) textareaRef.current.style.height = 'auto';
                await fetchMessages();
            } else {
                alert(result.message || "Failed to send");
            }
        } catch (error) {
            console.error("Reply Error:", error);
        } finally {
            setSending(false);
        }
    };

    if (loading) return <CityDriveLoader message="Syncing conversations..." />;

    return (
        <div className="h-[calc(100vh-10rem)] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex relative">
            
            {/* SIDEBAR */}
            <div className={`w-full md:w-96 border-r border-gray-100 flex flex-col bg-gray-50/50 ${showMobileDetail ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 bg-white border-b border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Inbox</h2>
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                            {inquiries.filter(m => m.status === 'unread').length} New
                        </span>
                    </div>
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-3" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100/80 border-none rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredThreads.map((thread) => {
                        const lastMsg = thread[thread.length - 1];
                        const isUnread = thread.some(m => m.status === 'unread');
                        const isActive = selectedThread?.email === lastMsg.email && selectedThread?.subject === lastMsg.subject;

                        return (
                            <div
                                key={`${lastMsg.email}-${lastMsg.subject}`}
                                onClick={() => {
                                    setSelectedThread({ email: lastMsg.email, subject: lastMsg.subject });
                                    setShowMobileDetail(true);
                                }}
                                className={`group p-4 mx-2 my-1 rounded-xl cursor-pointer transition-all flex gap-4 items-start ${
                                    isActive ? 'bg-white shadow-md ring-1 ring-black/5' : 'hover:bg-white/60'
                                }`}
                            >
                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border border-gray-200 uppercase">
                                        <span className="text-sm font-bold text-gray-600">{lastMsg.name?.charAt(0) || '?'}</span>
                                    </div>
                                    {isUnread && <FaCircle className="absolute -top-0.5 -right-0.5 text-green-500 border-2 border-white size-3" />}
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className={`text-sm truncate ${isUnread ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                                            {lastMsg.name}
                                        </h4>
                                        <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                            {new Date(lastMsg.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-[11px] font-semibold text-green-600 truncate uppercase tracking-wide mt-0.5">
                                        {lastMsg.subject || 'Inquiry'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate mt-1 group-hover:text-gray-700 transition-colors">
                                        {lastMsg.message}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CHAT AREA */}
            <div className={`flex-1 flex flex-col bg-gray-50/30 ${!showMobileDetail ? 'hidden md:flex' : 'flex'}`}>
                {selectedThread ? (
                    <>
                        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setShowMobileDetail(false)} className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full">
                                    <FaChevronLeft />
                                </button>
                                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                    <FaUserCircle size={28} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm leading-tight">{activeChat[0]?.name}</h3>
                                    <p className="text-[11px] text-gray-500 font-medium tracking-tight">{selectedThread.email}</p>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-red-500 p-2.5 hover:bg-red-50 rounded-xl transition-all">
                                <FaTrash size={14} />
                            </button>
                        </header>

                        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 scrollbar-hide">
                            {activeChat.map((msg, idx) => {
                                const isSupport = msg.status === 'replied';
                                return (
                                    <div key={idx} className={`flex flex-col ${isSupport ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-sm relative ${
                                            isSupport 
                                            ? 'bg-green-600 text-white rounded-tr-none' 
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                        }`}>
                                            <p className={`text-[10px] font-bold mb-2 opacity-60 uppercase tracking-widest`}>
                                                {isSupport ? 'Support Team' : msg.subject}
                                            </p>
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                        </div>
                                        <span className="text-[10px] text-gray-400 mt-2 font-medium px-1 uppercase">
                                            {new Date(msg.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                );
                            })}
                            <div ref={chatEndRef} />
                        </div>

                        <footer className="p-6 bg-white border-t border-gray-100">
                            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3 items-end">
                                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/5 transition-all overflow-hidden px-4 py-2">
                                    <textarea
                                        ref={textareaRef}
                                        className="w-full bg-transparent border-none text-sm outline-none resize-none pt-2 min-h-[45px] max-h-[150px] leading-relaxed"
                                        placeholder="Type a professional reply..."
                                        rows={1}
                                        value={reply}
                                        onChange={(e) => {
                                            setReply(e.target.value);
                                            e.target.style.height = 'auto';
                                            e.target.style.height = e.target.scrollHeight + 'px';
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e);
                                            }
                                        }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!reply.trim() || sending}
                                    className="bg-green-600 text-white p-4 rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-200 disabled:opacity-50 disabled:shadow-none shrink-0"
                                >
                                    {sending ? (
                                        <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <FaPaperPlane size={16} />
                                    )}
                                </button>
                            </form>
                        </footer>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <FaPaperPlane size={24} className="opacity-20 -rotate-12" />
                        </div>
                        <h3 className="text-gray-900 font-bold">CityDrive Support</h3>
                        <p className="text-sm max-w-[200px] text-center mt-1">Select a message from the sidebar to start a conversation.</p>
                    </div>
                )}
            </div>
        </div>
    );
}