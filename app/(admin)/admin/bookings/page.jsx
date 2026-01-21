'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaList, FaCalendarAlt, FaChevronDown, FaEye, FaUndo, FaCheckDouble, FaTrash, FaUser, FaCar, FaClock } from 'react-icons/fa';
import CityDriveLoader from '@/components/CityDriveLoader';

export default function BookingsPage() {
    const [view, setView] = useState('list');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Dynamic Date Context
    const today = new Date();
    const currentMonth = today.getMonth(); // 0 = Jan
    const currentYear = today.getFullYear();

      const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get(`${BASE_API}/admin/dashboard_data.php`);
                const rawData = res.data.data.bookings || [];
                
                const mappedData = rawData.map(b => {
                    const start = new Date(b.pickup_date);
                    const end = new Date(b.return_date);
                    
                    // Calculate span (ensure it's at least 1 day)
                    const diffTime = Math.abs(end - start);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                    return {
                        ...b,
                        user: b.user || b.customer_name || 'Client',
                        startDay: start.getDate(),
                        startMonth: start.getMonth(),
                        startYear: start.getFullYear(),
                        span: diffDays,
                        color: getStatusColor(b.status)
                    };
                });
                setBookings(mappedData);
            } catch (err) {
                console.error("Calendar Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        if (s === 'confirmed') return 'bg-green-100 text-green-700 border-green-200';
        if (s === 'completed') return 'bg-blue-100 text-blue-700 border-blue-200';
        if (s === 'refunded') return 'bg-purple-100 text-purple-700 border-purple-200';
        if (s === 'cancelled') return 'bg-red-100 text-red-700 border-red-200';
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'; // pending
    };

    const handleStatusUpdate = async (id, newStatus) => {
        if (['cancelled', 'refunded'].includes(newStatus)) {
            if (!window.confirm(`Emit Photography: Are you sure you want to mark this as ${newStatus}?`)) return;
        }

        try {
            await axios.post('https://api.citydrivehire.com/admin/update_booking_status.php', { id, status: newStatus });
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus, color: getStatusColor(newStatus) } : b));
            if (selectedBooking?.id === id) setSelectedBooking(prev => ({ ...prev, status: newStatus }));
            setActiveDropdown(null);
        } catch (err) {
            alert("Update failed.");
        }
    };

    if (loading) return <CityDriveLoader message="sycing booking data"/>;

    return (
        <div className="relative" onClick={() => setActiveDropdown(null)}>
            {/* Header section as before... */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Booking Requests</h2>
                    <p className="text-sm text-gray-500">Manage City Drive Hire schedule.</p>
                </div>
                <div className="bg-white p-1 rounded-lg border border-gray-200 flex shadow-sm">
                    <button onClick={() => setView('list')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'list' ? 'bg-slate-900 text-white shadow' : 'text-gray-500'}`}><FaList className="inline mr-2"/> List</button>
                    <button onClick={() => setView('calendar')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'calendar' ? 'bg-slate-900 text-white shadow' : 'text-gray-500'}`}><FaCalendarAlt className="inline mr-2"/> Calendar</button>
                </div>
            </div>

            {view === 'list' ? (
                /* LIST VIEW TABLE CODE HERE (Same as previous step) */
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-visible">
                     <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs">#{booking.id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{booking.user}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${booking.color}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end items-center gap-2 relative">
                                        <button onClick={(e) => {e.stopPropagation(); setSelectedBooking(booking)}} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"><FaEye /></button>
                                        <div className="relative">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === booking.id ? null : booking.id); }}
                                                className="flex items-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-bold"
                                            >
                                                Manage <FaChevronDown size={10} />
                                            </button>
                                            {activeDropdown === booking.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-2xl z-[100] py-1 text-left overflow-hidden">
                                                    <button onClick={() => handleStatusUpdate(booking.id, 'confirmed')} className="w-full px-4 py-2 text-xs hover:bg-green-50 flex items-center gap-2 text-green-700 font-bold"><FaCheck /> Confirm</button>
                                                    <button onClick={() => handleStatusUpdate(booking.id, 'completed')} className="w-full px-4 py-2 text-xs hover:bg-blue-50 flex items-center gap-2 text-blue-700 font-bold"><FaCheckDouble /> Complete</button>
                                                    <button onClick={() => handleStatusUpdate(booking.id, 'refunded')} className="w-full px-4 py-2 text-xs hover:bg-purple-50 flex items-center gap-2 text-purple-700 font-bold"><FaUndo /> Refund</button>
                                                    <div className="border-t my-1"></div>
                                                    <button onClick={() => handleStatusUpdate(booking.id, 'cancelled')} className="w-full px-4 py-2 text-xs hover:bg-red-50 flex items-center gap-2 text-red-600 font-bold"><FaTrash /> Cancel</button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* FIXED CALENDAR VIEW */
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in">
                    <div className="p-4 border-b font-bold text-gray-800 flex justify-between">
                        <span>January 2026</span>
                        <span className="text-xs text-gray-400 uppercase tracking-widest">Emit Photography Schedule</span>
                    </div>
                    <div className="grid grid-cols-7 auto-rows-fr bg-gray-200 gap-px">
                        {/* Empty cells for Jan 2026 starting Thu */}
                        {[...Array(4)].map((_, i) => <div key={i} className="bg-white min-h-[120px]"></div>)}
                        
                        {[...Array(31)].map((_, i) => {
                            const day = i + 1;
                            
                            // Filter bookings for THIS specific day
                            const daysBookings = bookings.filter(b => 
                                b.startYear === currentYear && 
                                b.startMonth === currentMonth && 
                                day >= b.startDay && day < (b.startDay + b.span)
                            );

                            return (
                                <div key={day} className="bg-white min-h-[120px] p-2 hover:bg-gray-50 transition-colors">
                                    <span className={`text-xs font-bold ${day === today.getDate() ? 'text-blue-600 underline' : 'text-gray-400'}`}>{day}</span>
                                    <div className="mt-2 space-y-1">
                                        {daysBookings.map(b => (
                                            <div 
                                                key={b.id} 
                                                onClick={() => setSelectedBooking(b)}
                                                className={`text-[9px] p-1 rounded border truncate font-bold cursor-pointer hover:opacity-80 ${b.color}`}
                                            >
                                                {b.car}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* MODAL CODE (Same as before, ensuring it's always included) */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex justify-end animate-in fade-in duration-300">
                    <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 animate-in slide-in-from-right duration-500 overflow-y-auto">
                        <div className="flex justify-between items-center mb-8 border-b pb-4">
                            <h3 className="text-xl font-bold text-gray-900">Booking Details</h3>
                            <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                <div className="h-12 w-12 bg-slate-900 rounded-full flex items-center justify-center text-white"><FaUser /></div>
                                <div><p className="text-[10px] text-gray-400 uppercase font-black">Customer</p><p className="font-bold text-gray-900 text-lg">{selectedBooking.user}</p></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border border-gray-100 rounded-xl"><FaCar className="text-blue-500 mb-1"/><p className="font-bold text-gray-800">{selectedBooking.car}</p></div>
                                <div className="p-4 border border-gray-100 rounded-xl"><FaClock className="text-orange-500 mb-1"/><p className="font-bold text-gray-800">K{selectedBooking.total}</p></div>
                            </div>
                            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Rental Timeline</p>
                                <p className="text-sm font-bold text-slate-700">{selectedBooking.pickup_date} to {selectedBooking.return_date}</p>
                            </div>
                            <div className="pt-6 border-t grid grid-cols-2 gap-3">
                                <button onClick={() => handleStatusUpdate(selectedBooking.id, 'confirmed')} className="bg-green-600 text-white py-2 rounded-lg font-bold text-xs hover:bg-green-700">Confirm</button>
                                <button onClick={() => handleStatusUpdate(selectedBooking.id, 'completed')} className="bg-blue-600 text-white py-2 rounded-lg font-bold text-xs hover:bg-blue-700">Complete</button>
                                <button onClick={() => handleStatusUpdate(selectedBooking.id, 'refunded')} className="bg-purple-600 text-white py-2 rounded-lg font-bold text-xs hover:bg-purple-700">Refund</button>
                                <button onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')} className="bg-red-600 text-white py-2 rounded-lg font-bold text-xs hover:bg-red-700">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}