'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
    FaChartPie,
    FaCar,
    FaCalendarAlt,
    FaUsers,
    FaSignOutAlt,
    FaCog,
    FaFileInvoiceDollar,
    FaTools,
    FaMapMarkedAlt,
    FaTimes,
    FaChartBar,
    FaChartLine,
    FaUserShield,
    FaEnvelope,
    FaLifeRing, FaBell,
    FaCarSide
} from 'react-icons/fa';

export default function AdminSidebar({ isOpen, setIsOpen }) {
    const pathname = usePathname();

    // Categorized Menu Data
    const menuGroups = [
        {
            title: "Overview",
            items: [
                { name: 'Dashboard', href: '/admin', icon: FaChartPie },
                { name: 'Live Map', href: '/admin/map', icon: FaMapMarkedAlt },
            ]
        },
        {
            title: "Fleet Operations",
            items: [
                { name: 'All Vehicles', href: '/admin/cars', icon: FaCar },
                { name: 'Maintenance', href: '/admin/maintenance', icon: FaTools },
            ]
        },
        {
            title: "Business",
            items: [
                { name: 'Bookings', href: '/admin/bookings', icon: FaCalendarAlt },
                { name: 'Invoices', href: '/admin/invoices', icon: FaFileInvoiceDollar },
                {name: 'Reports', href: '/admin/reports', icon: FaChartBar },
                { name: 'Users & Partners', href: '/admin/users', icon: FaUsers },
            ]
        },
        {
            title: "Data & Insights",
            items: [
                { name: 'Analytics', href: '/admin/analytics', icon: FaChartLine }, // New
                { name: 'Fleet Stats', href: '/admin/statistics', icon: FaChartPie }, // New
            ]
        },
        {
            title: "Communication",
            items: [
                { name: 'Messages', href: '/admin/messages', icon: FaEnvelope },
                { name: 'Help Desk', href: '/admin/help', icon: FaLifeRing }, // Import FaLifeRing
                { name: 'Notifications', href: '/admin/notifications', icon: FaBell },
            ]
        },
        {
            title: "System",
            items: [
                { name: 'Team Management', href: '/admin/admins', icon: FaUserShield },
                { name: 'Settings', href: '/admin/settings', icon: FaCog },
            ]
        }
    ];

    return (
        <>
            {/* MOBILE OVERLAY (Darkens background when sidebar is open) */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 h-[100vh] ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            ></div>

            {/* SIDEBAR CONTAINER */}
            <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out border-r border-slate-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static flex flex-col
      `}>

                {/* BRAND LOGO */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950/50">
                   <Link href="/ddmin" className="flex items-center gap-3 group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all bg-slate-900 text-green-500`}>
                        <FaCarSide className="text-xl" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight leading-none text-green-500">
                            City<span className="text-white">Drive</span>
                        </h1>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                            Hire
                        </p>
                    </div>
                </Link>
                    {/* Close Button (Mobile Only) */}
                    <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                        <FaTimes />
                    </button>
                </div>

                {/* NAVIGATION LINKS */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8 scrollbar-thin scrollbar-thumb-slate-700">
                    {menuGroups.map((group, idx) => (
                        <div key={idx}>
                            <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                {group.title}
                            </h3>
                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)} // Close sidebar on click (mobile)
                                            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                                                isActive
                                                    ? 'bg-green-600 text-white shadow-lg shadow-green-900/20'
                                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                            }`}
                                        >
                                            <item.icon className={`mr-3 h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* FOOTER / LOGOUT */}
                <div className="p-4 border-t border-slate-800 bg-slate-950/30">
                    <button 
                        onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                        className="flex items-center w-full px-4 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <FaSignOutAlt className="mr-3" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}