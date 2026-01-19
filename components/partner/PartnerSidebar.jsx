'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
    FaTimes, FaHandshake, FaChartPie, FaBell, FaChartBar, 
    FaCar, FaWallet, FaPlusCircle, FaCog, FaSignOutAlt 
} from 'react-icons/fa';

export default function PartnerSidebar({ user, isOpen, setIsOpen }) {
    const pathname = usePathname();

    const navigation = [
        { name: 'Dashboard', href: '/partner', icon: FaChartPie },
        { name: 'Notifications', href: '/partner/notifications', icon: FaBell },
        { name: 'Analytics', href: '/partner/analytics', icon: FaChartBar },
        { name: 'My Fleet', href: '/partner/fleet', icon: FaCar },
        { name: 'Earnings', href: '/partner/earnings', icon: FaWallet },
        { name: 'Add Vehicle', href: '/partner/add-car', icon: FaPlusCircle },
        { name: 'Settings', href: '/partner/settings', icon: FaCog },
    ];

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
            transform transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 lg:static lg:inset-auto lg:flex lg:flex-col lg:flex-shrink-0
        `}>
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-gray-100 shrink-0 bg-gray-900">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white tracking-tight">
                    <FaHandshake className="text-green-500" /> Partner<span className="font-light text-gray-400">Portal</span>
                </Link>
                <button onClick={() => setIsOpen(false)} className="ml-auto lg:hidden p-2 text-gray-400 hover:text-white">
                    <FaTimes size={20} />
                </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                                isActive ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <item.icon className={`text-lg ${isActive ? 'text-white' : 'text-gray-400'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold uppercase">
                        {user.name?.[0] || 'P'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">Partner Account</p>
                    </div>
                </div>
                <button 
                    onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-100 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <FaSignOutAlt /> Sign Out
                </button>
            </div>
        </aside>
    );
}