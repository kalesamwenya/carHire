'use client';

import { FaBell } from 'react-icons/fa';
import Link from 'next/link';

const MOCK_NOTIFICATIONS = [
    { id: 1, title: "New Booking Request", time: "2 mins ago", read: false },
    { id: 2, title: "System Update", time: "1 hour ago", read: true },
    { id: 3, title: "Payment Verified", time: "3 hours ago", read: false },
];

export default function NotificationDropdown({ isOpen, onClick }) {
    return (
        <div className="relative">
            <button 
                onClick={onClick}
                className={`p-2 rounded-full transition-all relative ${
                    isOpen ? 'bg-green-50 text-green-600' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                }`}
            >
                <FaBell size={18} />
                {/* Red dot for unread status */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        <button className="text-[10px] text-green-600 font-bold uppercase hover:underline">
                            Mark all as read
                        </button>
                    </div>
                    
                    <div className="max-h-[300px] overflow-y-auto">
                        {MOCK_NOTIFICATIONS.length > 0 ? (
                            MOCK_NOTIFICATIONS.map(n => (
                                <div key={n.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3">
                                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.read ? 'bg-transparent' : 'bg-green-500'}`} />
                                    <div>
                                        <p className="text-sm text-gray-800 font-medium">{n.title}</p>
                                        <p className="text-xs text-gray-400">{n.time}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                No new notifications
                            </div>
                        )}
                    </div>
                    
                    <Link href="/partner/notifications" className="block p-3 text-center text-xs font-bold text-gray-500 hover:bg-gray-50 bg-gray-50/30">
                        View All Activity
                    </Link>
                </div>
            )}
        </div>
    );
}