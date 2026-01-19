'use client';

import { useState } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

export default function AdminLayoutClient({ user, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
        </div>
    );
}