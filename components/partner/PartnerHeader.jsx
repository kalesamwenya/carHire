'use client';

import { useState } from 'react';
import { 
  FaBars, FaHandshake, FaExclamationTriangle, 
  FaClock, FaTimesCircle, FaChevronDown, FaUserCircle,
  FaBell, FaCog, FaSignOutAlt
} from 'react-icons/fa';
import ChatDropdown from '@/components/ui/ChatDropdown';
import Link from 'next/link';

export default function PartnerHeader({ setIsOpen, kycStatus }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const getKycBanner = () => {
        const banners = {
            pending: {
                bg: "bg-amber-50",
                border: "border-amber-100",
                text: "text-amber-800",
                icon: <FaClock className="animate-pulse text-amber-500" />,
                msg: "Verification in progress. Listing cars is temporarily disabled until approved."
            },
            rejected: {
                bg: "bg-rose-50",
                border: "border-rose-100",
                text: "text-rose-800",
                icon: <FaTimesCircle className="text-rose-500" />,
                msg: <>Documents rejected. <Link href="/partner/settings" className="underline font-bold hover:text-rose-900">Please re-upload clear NRC images.</Link></>
            },
            actionRequired: {
                bg: "bg-indigo-50",
                border: "border-indigo-100",
                text: "text-indigo-800",
                icon: <FaExclamationTriangle className="text-indigo-500" />,
                msg: <>Action Required: <Link href="/partner/settings" className="underline font-bold hover:text-indigo-900">Upload your NRC to start earning.</Link></>
            }
        };

        const current = kycStatus === 'pending' ? banners.pending : 
                        kycStatus === 'rejected' ? banners.rejected : 
                        (kycStatus === null || kycStatus === '') ? banners.actionRequired : null;

        if (!current) return null;

        return (
            <div className={`${current.bg} ${current.border} border-b px-6 py-2.5 transition-all duration-500 ease-in-out`}>
                <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-xs md:text-sm font-medium tracking-tight">
                    {current.icon}
                    <span className={current.text}>{current.msg}</span>
                </div>
            </div>
        );
    };

    return (
        <header className="sticky top-0 z-40 w-full flex flex-col bg-white/80 backdrop-blur-md">
            {/* Dynamic KYC Banner with smooth transition */}
            {/* {getKycBanner()} */}

            {/* Main Header Row */}
            <div className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-gray-100 shadow-sm">
                
                {/* Left Section: Branding */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="lg:hidden p-2 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                        <FaBars size={20} />
                    </button>
                    
                    <Link href="/partner/dashboard" className="flex items-center gap-2.5 group">
                        <div className="bg-green-600 p-2 rounded-lg group-hover:bg-green-700 transition-colors">
                            <FaHandshake className="text-white" size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900 leading-none tracking-tight">Partner Portal</span>
                            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest hidden sm:block">Fleet Management</span>
                        </div>
                    </Link>
                </div>

                {/* Right Section: Actions & Profile */}
                <div className="flex items-center gap-2 md:gap-5">
                    
                    {/* Activity Icons */}
                    <div className="hidden md:flex items-center border-r border-gray-100 pr-5 gap-1">
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-all">
                            <FaBell size={18} />
                        </button>
                        <ChatDropdown unreadCount={2} />
                    </div>

                    {/* User Profile Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
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
                            <FaChevronDown size={12} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isProfileOpen && (
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