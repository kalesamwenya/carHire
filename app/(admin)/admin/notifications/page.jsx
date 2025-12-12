'use client';

import { FaBell, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaCalendarCheck } from 'react-icons/fa';

const notifications = [
    { id: 1, type: 'alert', title: 'Maintenance Overdue', message: 'Toyota Hilux (ABZ 1234) has missed scheduled service.', time: '10 mins ago' },
    { id: 2, type: 'success', title: 'Payment Received', message: 'Invoice #INV-001 was paid by John Doe.', time: '1 hour ago' },
    { id: 3, type: 'info', title: 'New Partner Registration', message: 'Mike Ross wants to list a vehicle.', time: '3 hours ago' },
    { id: 4, type: 'booking', title: 'New Booking Request', message: 'Booking #BK-5520 needs approval.', time: 'Yesterday' },
];

export default function NotificationsPage() {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                <button className="text-sm text-green-600 font-bold hover:underline">Mark all as read</button>
            </div>

            <div className="space-y-4">
                {notifications.map((notif) => (
                    <div key={notif.id} className={`flex items-start gap-4 p-4 rounded-xl border shadow-sm transition-all hover:shadow-md ${notif.type === 'alert' ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'}`}>

                        {/* Icon Logic */}
                        <div className={`mt-1 p-2 rounded-full shrink-0 ${
                            notif.type === 'alert' ? 'bg-red-100 text-red-600' :
                                notif.type === 'success' ? 'bg-green-100 text-green-600' :
                                    notif.type === 'booking' ? 'bg-purple-100 text-purple-600' :
                                        'bg-blue-100 text-blue-600'
                        }`}>
                            {notif.type === 'alert' && <FaExclamationTriangle />}
                            {notif.type === 'success' && <FaCheckCircle />}
                            {notif.type === 'booking' && <FaCalendarCheck />}
                            {notif.type === 'info' && <FaInfoCircle />}
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className={`font-bold text-sm ${notif.type === 'alert' ? 'text-red-900' : 'text-gray-900'}`}>{notif.title}</h3>
                                <span className="text-xs text-gray-400">{notif.time}</span>
                            </div>
                            <p className={`text-sm mt-1 ${notif.type === 'alert' ? 'text-red-800' : 'text-gray-600'}`}>{notif.message}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center">
                <button className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">
                    Load Older Notifications
                </button>
            </div>
        </div>
    );
}