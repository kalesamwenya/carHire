'use client';

import { useState } from 'react';
import { FaCheck, FaTimes, FaList, FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Mock Data
const bookings = [
    { id: 101, user: 'Sarah M.', car: 'Toyota Hilux', dates: 'Oct 12 - Oct 15', total: 360, status: 'Pending', startDay: 12, span: 4, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { id: 102, user: 'Mike T.', car: 'Suzuki Swift', dates: 'Oct 14 - Oct 20', total: 270, status: 'Confirmed', startDay: 14, span: 7, color: 'bg-green-100 text-green-700 border-green-200' },
    { id: 103, user: 'Emit P.', car: 'BMW X5', dates: 'Nov 01 - Nov 03', total: 500, status: 'Cancelled', startDay: null, span: 0, color: 'bg-red-100 text-red-700 border-red-200' }, // Starts in Nov, won't show on Oct grid
];

export default function BookingsPage() {
    const [view, setView] = useState('list'); // 'list' or 'calendar'

    return (
        <div>
            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Booking Requests</h2>
                    <p className="text-sm text-gray-500">Manage and schedule incoming reservations.</p>
                </div>

                {/* View Toggles */}
                <div className="bg-white p-1 rounded-lg border border-gray-200 flex shadow-sm">
                    <button
                        onClick={() => setView('list')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'list' ? 'bg-slate-900 text-white shadow' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        <FaList /> List
                    </button>
                    <button
                        onClick={() => setView('calendar')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'calendar' ? 'bg-slate-900 text-white shadow' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        <FaCalendarAlt /> Calendar
                    </button>
                </div>
            </div>

            {/* CONDITIONAL RENDERING */}
            {view === 'list' ? (
                // --- LIST VIEW (Original Table) ---
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                        <tr>
                            <th className="px-6 py-3">Booking ID</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Vehicle</th>
                            <th className="px-6 py-3">Dates</th>
                            <th className="px-6 py-3">Total</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs">#{booking.id}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{booking.user}</td>
                                <td className="px-6 py-4">{booking.car}</td>
                                <td className="px-6 py-4 text-gray-500">{booking.dates}</td>
                                <td className="px-6 py-4 font-bold">${booking.total}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-gray-100 text-gray-500'
                                    }`}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    {booking.status === 'Pending' && (
                                        <>
                                            <button className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100" title="Approve">
                                                <FaCheck />
                                            </button>
                                            <button className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Reject">
                                                <FaTimes />
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                // --- CALENDAR VIEW (New Grid) ---
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
                    {/* Calendar Controls */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-lg text-gray-800">October 2025</h3>
                        <div className="flex gap-2">
                            <button className="p-2 border rounded hover:bg-gray-50 text-gray-500"><FaChevronLeft /></button>
                            <button className="p-2 border rounded hover:bg-gray-50 text-gray-500"><FaChevronRight /></button>
                        </div>
                    </div>

                    {/* Days Header */}
                    <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid (Oct 2025 starts on a Wednesday) */}
                    <div className="grid grid-cols-7 auto-rows-fr bg-gray-200 gap-px border-b border-gray-200">
                        {/* Empty cells for days before Oct 1st (Sun, Mon, Tue) */}
                        {[...Array(3)].map((_, i) => (
                            <div key={`empty-${i}`} className="bg-white min-h-[120px]"></div>
                        ))}

                        {/* Days 1-31 */}
                        {[...Array(31)].map((_, i) => {
                            const day = i + 1;
                            // Filter bookings active on this day (Simplified visual logic)
                            const daysBookings = bookings.filter(b => b.startDay && day >= b.startDay && day < (b.startDay + b.span));

                            return (
                                <div key={day} className="bg-white min-h-[120px] p-2 hover:bg-gray-50 transition-colors relative group">
                                    <span className={`text-sm font-semibold ${day === 12 ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-gray-700'}`}>
                                        {day}
                                    </span>

                                    {/* Booking Chips */}
                                    <div className="mt-2 space-y-1">
                                        {daysBookings.map(b => (
                                            <div
                                                key={b.id}
                                                className={`text-[10px] px-1.5 py-1 rounded border truncate font-medium cursor-pointer ${b.color}`}
                                                title={`${b.car} - ${b.user}`}
                                            >
                                                {b.car}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add Button (Hover) */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-gray-400 hover:text-green-600">+</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}