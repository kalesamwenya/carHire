'use client';

import Link from 'next/link';
import { FaBell } from 'react-icons/fa';

const mockNotifs = [
    { id: 1, title: 'Maintenance Overdue', text: 'Vehicle ABZ 1234 missed service.', type: 'alert' },
    { id: 2, title: 'New Booking', text: 'Booking #BK-2029 created.', type: 'success' },
];

export default function NotificationsDropdown({ isOpen, onToggle }) {
    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className={`p-2 transition-colors relative ${isOpen ? 'text-green-600 bg-green-50 rounded-lg' : 'text-gray-500 hover:text-green-600'}`}
            >
                <FaBell className="text-lg" />
                <span className="absolute top-1.5 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-sm text-gray-800">Notifications</h3>
                        <span className="text-xs text-gray-400">2 New</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {mockNotifs.map((notif) => (
                            <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 flex gap-3">
                                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${notif.type === 'alert' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                                    <p className="text-xs text-gray-500">{notif.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100 text-center">
                        <Link href="/admin/notifications" className="text-xs font-bold text-green-600 hover:underline">
                            View All Notifications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}