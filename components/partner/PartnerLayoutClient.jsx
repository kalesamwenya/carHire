'use client';


import { useState } from 'react';
import PartnerSidebar from './PartnerSidebar';
import PartnerHeader from './PartnerHeader';
import ChatBubble from '../ui/ChatBubble';
import AdminPartnerChat from '../ui/AdminPartnerChat';
import { fetchChatMessages, sendChatMessage } from '@/lib/chat';

export default function PartnerLayoutClient({ user, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const demoAdmin = { id: 1, name: 'Admin Demo', role: 'admin' };
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
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
                    kycStatus={user.kyc_status} 
                />

                {/* PAGE CONTENT */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
                    {children}
                </main>
            </div>
            {/* Chat Bubble (always visible) */}
            <ChatBubble onClick={() => setShowChat(v => !v)} unreadCount={2} />
            {/* Chat Modal (simple overlay) */}
            {showChat && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-2xl p-0 max-w-lg w-full relative">
                        <button className="absolute top-2 right-2 text-slate-400 hover:text-red-500 text-2xl font-bold" onClick={() => setShowChat(false)}>&times;</button>
                        <div className="p-4">
                            <AdminPartnerChat
                                user={user}
                                recipient={demoAdmin}
                                fetchMessages={fetchChatMessages}
                                sendMessage={sendChatMessage}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}