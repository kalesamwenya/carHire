'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import PartnerSidebar from './PartnerSidebar';
import PartnerHeader from './PartnerHeader';
import AdminPartnerChat from '../ui/AdminPartnerChat';
import { fetchChatMessages, sendChatMessage } from '@/lib/chat';
import { X } from 'lucide-react';

export default function PartnerLayoutClient({ user, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const pathname = usePathname();

    const demoAdmin = { id: 1, name: 'Support Admin', role: 'admin' };

    // Automatically hide bubble if we are on the dedicated chat page
    const isChatPage = pathname === '/partner/chat';

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden relative">
            {/* MOBILE OVERLAY */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* SIDEBAR COMPONENT */}
            <PartnerSidebar 
                user={user} 
                isOpen={sidebarOpen} 
                setIsOpen={setSidebarOpen} 
            />

            {/* CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* HEADER COMPONENT */}
                <PartnerHeader 
                    setIsOpen={setSidebarOpen} 
                    kycStatus={user?.kyc_status} 
                />

                {/* PAGE CONTENT */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
                    {children}
                </main>
            </div>

            {/* --- IMPROVED CHAT BUBBLE CONTROL --- */}
            {!isChatPage && (
                <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
                    
                    {/* Chat Mini-Window (Pinned to bottom-right) */}
                    {showChat && (
                        <div className="w-[380px] h-[550px] mb-4 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                            {/* Mini Header with Close Button */}
                            <div className="bg-slate-900 px-4 py-3 flex justify-between items-center text-white">
                                <span className="text-sm font-bold">Support Chat</span>
                                <button 
                                    onClick={() => setShowChat(false)}
                                    className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-hidden p-2">
                                <AdminPartnerChat
                                    user={user}
                                    recipient={demoAdmin}
                                    fetchMessages={fetchChatMessages}
                                    sendMessage={sendChatMessage}
                                />
                            </div>
                        </div>
                    )}

                    {/* Floating Action Button (The Bubble) */}
                    <button
                        onClick={() => setShowChat(!showChat)}
                        className={`group flex items-center gap-3 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${
                            showChat ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white'
                        }`}
                    >
                        {showChat ? (
                            <X size={24} />
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold pl-2 hidden md:block">Need Help?</span>
                                <div className="relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                                        2
                                    </span>
                                </div>
                            </div>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}