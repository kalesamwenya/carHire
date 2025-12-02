'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FaBars, FaTimes, FaHome, FaHistory, FaUser, FaCog, FaSignOutAlt, FaCar
} from 'react-icons/fa';

export default function DashboardLayoutClient({ user, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const navigation = [
        { name: 'Overview', href: '/dashboard', icon: FaHome },
        { name: 'My Bookings', href: '/dashboard/bookings', icon: FaHistory },
        { name: 'Profile', href: '/dashboard/profile', icon: FaUser },
        { name: 'Settings', href: '/dashboard/settings', icon: FaCog },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">

            {/* MOBILE OVERLAY */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* SIDEBAR (Flex Item) */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:inset-auto lg:flex lg:flex-col lg:flex-shrink-0
            `}>
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold text-green-700 tracking-tight">
                        <FaCar /> CarHire
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="ml-auto lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                        aria-label="Close sidebar"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Navigation Links (Scrollable) */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                    isActive
                                        ? 'bg-green-50 text-green-700 shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <item.icon className={`text-lg ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Footer (Sticky at bottom of sidebar) */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold shrink-0">
                            {user.name?.[0] || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-100 hover:bg-red-50 rounded-lg transition-colors shadow-sm">
                        <FaSignOutAlt /> Sign Out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT WRAPPER (Flex Item) */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Mobile Toggle Bar (Visible only on mobile) */}
                <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 shrink-0">
                    <span className="font-bold text-gray-700 text-lg">Dashboard</span>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none transition-colors"
                        aria-label="Open sidebar"
                    >
                        <FaBars size={24} />
                    </button>
                </div>

                {/* Page Content (Scrollable independent of sidebar) */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
}