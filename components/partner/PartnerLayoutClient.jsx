'use client';

import { useState } from 'react';
import PartnerSidebar from './PartnerSidebar';
import PartnerHeader from './PartnerHeader';

export default function PartnerLayoutClient({ user, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
                {/* Pass the KYC Status here */}
                <PartnerHeader 
                    setIsOpen={setSidebarOpen} 
                    kycStatus={user.kyc_status} 
                />

                {/* PAGE CONTENT */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
}