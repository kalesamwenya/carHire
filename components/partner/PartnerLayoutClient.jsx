'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import PartnerSidebar from './PartnerSidebar';
import PartnerHeader from './PartnerHeader';
import AdminPartnerChat from '../ui/AdminPartnerChat';
import { fetchChatMessages, sendChatMessage } from '@/lib/chat';
import { X, MessageCircle } from 'lucide-react';

export default function PartnerLayoutClient({ user, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const pathname = usePathname();

    const demoAdmin = { id: 1, name: 'Support Admin', role: 'admin' };

    // Hide the floating bubble entirely if we are on the main chat page
    const isChatPage = pathname === '/partner/chat';

    // Close the mini-chat bubble automatically if the route changes
    useEffect(() => {
        setShowChat(false);
    }, [pathname]);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden relative">
            {/* MOBILE OVERLAY */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* SIDEBAR */}
            <PartnerSidebar 
                user={user} 
                isOpen={sidebarOpen} 
                setIsOpen={setSidebarOpen} 
            />

            {/* CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <PartnerHeader 
                    setIsOpen={setSidebarOpen} 
                    kycStatus={user?.kyc_status} 
                />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
                    {children}
                </main>
            </div>

            {/* FLOATING CHAT BUBBLE */}
            <AdminPartnerChat/>
        </div>
    );
}