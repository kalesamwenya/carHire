'use client';

import Link from 'next/link';
import { FaEnvelope } from 'react-icons/fa';

// You can eventually replace this with a fetch call
const mockMessages = [
    { id: 1, user: 'Alice Walker', time: '2m ago', text: 'Is the Toyota Hilux available?' },
    { id: 2, user: 'Bob Builder', time: '1h ago', text: 'Thanks for the service!' },
];

export default function MessagesDropdown({ isOpen, onToggle }) {
    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className={`p-2 transition-colors relative ${isOpen ? 'text-green-600 bg-green-50 rounded-lg' : 'text-gray-500 hover:text-green-600'}`}
            >
                <FaEnvelope className="text-lg" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-blue-500 rounded-full border border-white"></span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-sm text-gray-800">Messages</h3>
                        <span className="text-xs text-blue-600 font-bold cursor-pointer hover:underline">Mark all read</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {mockMessages.map((msg) => (
                            <div key={msg.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-sm text-gray-900">{msg.user}</span>
                                    <span className="text-[10px] text-gray-400">{msg.time}</span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">{msg.text}</p>
                            </div>
                        ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-100 text-center">
                        <Link href="/admin/messages" className="text-xs font-bold text-green-600 hover:underline">
                            View All Messages
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}