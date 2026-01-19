'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FaBars, FaSearch, FaShieldAlt } from 'react-icons/fa';

// Import the new independent components
import MessagesDropdown from '@/components/admin/header/MessagesDropdown';
import NotificationsDropdown from '@/components/admin/header/NotificationsDropdown';
import ProfileDropdown from '@/components/admin/header/ProfileDropdown';

export default function AdminHeader({ user, onMenuClick }) {
    const pathname = usePathname();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const actionContainerRef = useRef(null);

    // 1. Dynamic Page Title Logic
    const getPageTitle = () => {
        const segments = pathname.split('/').filter(Boolean);
        const currentSection = segments[1] || 'Dashboard';
        return currentSection
            .replace(/-/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    };

    // 2. Click Outside Logic (Closes any active dropdown)
    useEffect(() => {
        function handleClickOutside(event) {
            if (actionContainerRef.current && !actionContainerRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggle = (name) => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    return (
        <>
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-2">
                     <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center">
                        <FaShieldAlt className="text-amber-500 text-sm" />
                     </div>
                     <span className="font-bold text-slate-900">Admin Panel</span>
                </div>
                <button
                    onClick={onMenuClick}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                    <FaBars size={24} />
                </button>
            </header>

            {/* Desktop Header */}
            <header className="hidden lg:flex bg-white border-b border-gray-200 h-16 items-center justify-between px-4 lg:px-8 shadow-sm sticky top-0 z-30">

            {/* --- LEFT SIDE --- */}
            <div className="flex items-center gap-4 flex-1">

                <h2 className="hidden md:block text-xl font-bold text-gray-800 tracking-tight min-w-[120px]">
                    {getPageTitle()}
                </h2>

                <div className="hidden sm:flex items-center bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-green-500 focus-within:bg-white transition-all w-full max-w-xs ml-4">
                    <FaSearch className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent border-none outline-none text-sm w-full text-gray-700"
                    />
                </div>
            </div>

            {/* --- RIGHT SIDE: Components --- */}
            <div className="flex items-center gap-4" ref={actionContainerRef}>

                <MessagesDropdown
                    isOpen={activeDropdown === 'messages'}
                    onToggle={() => toggle('messages')}
                />

                <NotificationsDropdown
                    isOpen={activeDropdown === 'notifications'}
                    onToggle={() => toggle('notifications')}
                />

                <ProfileDropdown
                    isOpen={activeDropdown === 'profile'}
                    onToggle={() => toggle('profile')}
                />

            </div>
        </header>
        </>
    );
}