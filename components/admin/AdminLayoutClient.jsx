'use client';

import { useState } from 'react';

import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminPartnerChat from '../ui/AdminPartnerChat';
import ChatBubble from '../ui/ChatBubble';
import { fetchChatMessages, sendChatMessage } from '@/lib/chat';

export default function AdminLayoutClient({ user, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const demoPartner = { id: 2, name: 'Partner Demo', role: 'partner' };
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* MOBILE OVERLAY */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* SIDEBAR */}
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header (Mobile + Desktop) */}
                <AdminHeader user={user} onMenuClick={() => setSidebarOpen(true)} />

                {/* Viewport */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 bg-slate-50">
                    {children}
                </main>
            </div>
            {/* Chat Bubble (always visible) */}
            <ChatBubble onClick={() => setShowChat(v => !v)} unreadCount={2} />
            {/* Chat Slide-in Panel (like chatbot) */}
            <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans transition-all duration-300 ${showChat ? '' : 'pointer-events-none'}`}>
                {showChat && (
                    <div className={`w-96 max-w-full h-[550px] rounded-2xl mb-2 overflow-hidden shadow-2xl border border-gray-100 bg-white flex flex-col animate-slide-in-up`}>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-800 to-green-600 p-4 text-white flex items-center justify-between shadow-md">
                            <div className="font-bold text-sm">Direct Chat</div>
                            <button onClick={() => setShowChat(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors text-white text-xl">&times;</button>
                        </div>
                        {/* Chat UI */}
                        <div className="flex-1 overflow-y-auto">
                            <AdminPartnerChat
                                user={user}
                                recipient={demoPartner}
                                fetchMessages={fetchChatMessages}
                                sendMessage={sendChatMessage}
                            />
                        </div>
                    </div>
                )}
            </div>
            <style jsx global>{`
                @keyframes slide-in-up {
                  from { transform: translateY(40px); opacity: 0; }
                  to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-in-up {
                  animation: slide-in-up 0.3s cubic-bezier(0.4,0,0.2,1);
                }
            `}</style>
        </div>
    );
}