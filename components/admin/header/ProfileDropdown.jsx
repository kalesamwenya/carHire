'use client';

import Link from 'next/link';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';

export default function ProfileDropdown({ isOpen, onToggle }) {
    return (
        <div className="relative">
            <div
                onClick={onToggle}
                className={`flex items-center gap-3 cursor-pointer p-1.5 rounded-lg transition-colors ${isOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
            >
                <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-gray-800 leading-none">Admin User</p>
                    <p className="text-xs text-gray-500">Super Admin</p>
                </div>
                <div className="h-9 w-9 bg-gradient-to-tr from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
                    AU
                </div>
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 md:hidden">
                        <p className="text-sm font-bold text-gray-800">Admin User</p>
                        <p className="text-xs text-gray-500">Super Admin</p>
                    </div>

                    <Link
                        href="/admin/settings"
                        onClick={onToggle} // Close on click
                        className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-green-600 flex items-center gap-2"
                    >
                        <FaCog /> Settings
                    </Link>
                    <Link
                        href="/admin/admins"
                        onClick={onToggle}
                        className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-green-600 flex items-center gap-2"
                    >
                        <FaUser /> Team Management
                    </Link>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <FaSignOutAlt /> Sign Out
                    </button>
                </div>
            )}
        </div>
    );
}