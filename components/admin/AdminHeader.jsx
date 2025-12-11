'use client';

import { FaBars, FaBell, FaSearch } from 'react-icons/fa';

export default function AdminHeader({ onMenuClick }) {
    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 shadow-sm sticky top-0 z-30">

            {/* LEFT: Menu Button & Search */}
            <div className="flex items-center gap-4">
                {/* Toggle Button (Mobile Only) */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <FaBars className="text-xl" />
                </button>

                {/* Search Bar (Hidden on very small screens) */}
                <div className="hidden sm:flex items-center bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-green-500 focus-within:bg-white transition-all">
                    <FaSearch className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search bookings, cars..."
                        className="bg-transparent border-none outline-none text-sm w-64 text-gray-700"
                    />
                </div>
            </div>

            {/* RIGHT: Notifications & Profile */}
            <div className="flex items-center gap-6">
                {/* Notifications */}
                <button className="relative p-2 text-gray-500 hover:text-green-600 transition-colors">
                    <FaBell className="text-lg" />
                    <span className="absolute top-1.5 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                {/* Profile Dropdown Trigger */}
                <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-gray-800 leading-none">Admin User</p>
                        <p className="text-xs text-gray-500">Super Administrator</p>
                    </div>
                    <div className="h-9 w-9 bg-gradient-to-tr from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
                        AU
                    </div>
                </div>
            </div>
        </header>
    );
}