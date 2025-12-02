'use client';

import { useState } from 'react';
import { FaBell, FaCar, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function NotificationsPage() {
    // Mock Notifications Data
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'booking', title: 'New Booking: Toyota RAV4', message: 'User John Doe has booked your vehicle for Oct 15 - Oct 18.', time: '2 hours ago', read: false },
        { id: 2, type: 'system', title: 'Payout Processed', message: 'Your weekly earnings of ZMW 4,500 have been sent to your account.', time: '1 day ago', read: true },
        { id: 3, type: 'alert', title: 'Vehicle Maintenance Due', message: 'Ford Ranger (ABC 123) is due for servicing in 500km.', time: '2 days ago', read: true },
    ]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <button className="text-sm text-green-600 font-medium hover:underline">Mark all as read</button>
            </div>

            <div className="space-y-3">
                {notifications.map((note) => (
                    <div
                        key={note.id}
                        onClick={() => markAsRead(note.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex gap-4 ${
                            note.read
                                ? 'bg-white border-gray-200'
                                : 'bg-blue-50 border-blue-200 shadow-sm'
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            note.type === 'booking' ? 'bg-green-100 text-green-600' :
                                note.type === 'alert' ? 'bg-red-100 text-red-600' :
                                    'bg-gray-100 text-gray-600'
                        }`}>
                            {note.type === 'booking' ? <FaCar /> :
                                note.type === 'alert' ? <FaExclamationCircle /> : <FaCheckCircle />}
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className={`font-semibold ${note.read ? 'text-gray-900' : 'text-blue-900'}`}>{note.title}</h4>
                                <span className="text-xs text-gray-500">{note.time}</span>
                            </div>
                            <p className={`text-sm mt-1 ${note.read ? 'text-gray-600' : 'text-blue-800'}`}>{note.message}</p>
                        </div>

                        {!note.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}