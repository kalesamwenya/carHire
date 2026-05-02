'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  FaBars, FaHandshake, FaExclamationTriangle, 
  FaClock, FaTimesCircle, FaChevronDown, FaUserCircle,
  FaBell, FaCog, FaSignOutAlt
} from 'react-icons/fa';
import Link from 'next/link';
import NotificationDropdown from './NotificationDropdown';
import ChatDropdown from './ChatDropdown';



export default function PartnerHeader({ setIsOpen, kycStatus }) {
    const [activeDropdown, setActiveDropdown] = useState(null); // 'profile', 'notifications', 'chat'

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveDropdown(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleDropdown = (e, name) => {
        e.stopPropagation(); // Prevent immediate closing from the useEffect
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    return (
        <header className="sticky top-0 z-40 w-full flex flex-col bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="h-16 flex items-right justify-end px-4 md:px-8">
                


                {/* Right Section: Actions & Profile */}
                <div className="flex items-center gap-2 md:gap-5">
                    
                    <div className="hidden md:flex items-center border-r border-gray-100 pr-5 gap-1">
                        {/* Notification Dropdown */}
                        <NotificationDropdown
                            isOpen={activeDropdown === 'notifications'} 
                            onClick={(e) => toggleDropdown(e, 'notifications')} 
                        />
                        
                        {/* Chat Dropdown */}
                        <ChatDropdown
                            isOpen={activeDropdown === 'chat'} 
                            onClick={(e) => toggleDropdown(e, 'chat')}
                            unreadCount={2} 
                        />
                    </div>

                    {/* User Profile Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={(e) => toggleDropdown(e, 'profile')}
                            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                        >
                            <div className="flex flex-col items-end hidden md:flex text-right">
                                <span className="text-sm font-semibold text-gray-800 leading-none">Emit Admin</span>
                                <span className="text-[11px] text-green-600 font-bold uppercase tracking-tighter">Verified Partner</span>
                            </div>
                            <div className="relative">
                                <FaUserCircle size={32} className="text-gray-300" />
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <FaChevronDown size={12} className={`text-gray-400 transition-transform ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} />
                        </button>

                        {activeDropdown === 'profile' && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account</p>
                                </div>
                                <Link href="/partner/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-green-600 transition-colors">
                                    <FaCog /> Settings
                                </Link>
                                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors">
                                    <FaSignOutAlt /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}