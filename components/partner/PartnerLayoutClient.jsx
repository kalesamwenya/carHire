'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FaBars, FaTimes, FaChartPie, FaCar, FaPlusCircle, FaCalendarCheck,
    FaWallet, FaCog, FaSignOutAlt, FaHandshake, FaBell, FaChartBar
} from 'react-icons/fa';

export default function PartnerLayoutClient({ user, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const navigation = [
        { name: 'Dashboard', href: '/partner', icon: FaChartPie },
        { name: 'Notifications', href: '/partner/notifications', icon: FaBell }, // New
        { name: 'Analytics', href: '/partner/analytics', icon: FaChartBar },     // New
        { name: 'My Fleet', href: '/partner/fleet', icon: FaCar },
        { name: 'Earnings', href: '/partner/earnings', icon: FaWallet },
        { name: 'Add Vehicle', href: '/partner/add-car', icon: FaPlusCircle },
        { name: 'Settings', href: '/partner/settings', icon: FaCog },
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

            {/* SIDEBAR */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:static lg:inset-auto lg:flex lg:flex-col lg:flex-shrink-0
            `}>
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0 bg-gray-900">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white tracking-tight">
                        <FaHandshake className="text-green-500" /> Partner<span className="font-light text-gray-400">Portal</span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="ml-auto lg:hidden p-2 text-gray-400 hover:text-white rounded-md transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Navigation Links */}
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
                                        ? 'bg-green-600 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <item.icon className={`text-lg ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Partner Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                            {user.name?.[0] || 'P'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">Partner Account</p>
                        </div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-100 hover:bg-red-50 rounded-lg transition-colors shadow-sm">
                        <FaSignOutAlt /> Sign Out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT WRAPPER */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 shrink-0">
                    <span className="font-bold text-gray-900 flex items-center gap-2">
                        <FaHandshake className="text-green-600" /> Partner Dashboard
                    </span>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none"
                    >
                        <FaBars size={24} />
                    </button>
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
}