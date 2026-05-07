'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaList, FaCalendarAlt, FaChevronDown, FaEye, FaUndo, FaCheckDouble, FaTrash, FaUser, FaCar, FaClock } from 'react-icons/fa';
import CityDriveLoader from '@/components/CityDriveLoader';

export default function BookingsPage() {
    const [view, setView] = useState('list');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const today = new Date();
    const currentMonth = today.getMonth(); 
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
                    const diffTime = Math.abs(end - start);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                    return {
                        ...b,
                        id: b.id, // Primary Key for PHP
                        user: b.customer_name || 'Client',
                        car: b.car_name || 'Vehicle',
                        total: b.total_price || '0',
                        startDay: start.getDate(),
                        startMonth: start.getMonth(),
                        startYear: start.getFullYear(),
                        span: diffDays,
                        color: getStatusColor(b.status)
                    };
                });
                setBookings(mappedData);
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [BASE_API]);

    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        switch(s) {
            case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'refunded': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        if (isProcessing) return;
        if (['cancelled', 'refunded'].includes(newStatus)) {
            if (!window.confirm(`CityDrive Hire: Are you sure? This will notify the customer via email.`)) return;
        }

        setIsProcessing(true);
        try {
            await axios.post(`${BASE_API}/admin/update_booking_status.php`, 
                { id, status: newStatus },
                { headers: { 'Content-Type': 'application/json' } }
            );
            
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus, color: getStatusColor(newStatus) } : b));
            if (selectedBooking?.id === id) setSelectedBooking(prev => ({ ...prev, status: newStatus, color: getStatusColor(newStatus) }));
            setActiveDropdown(null);
        } catch (err) {
            alert(err.response?.data?.message || "Update failed.");
        } finally {
            setIsProcessing(false);
        }
    };

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    if (loading) return <CityDriveLoader message="syncing fleet data..."/>;

    return (
        <div className="relative min-h-screen pb-20" onClick={() => setActiveDropdown(null)}>
            {/* Overlay for processing state */}
            {isProcessing && <div className="fixed inset-0 bg-white/20 z-[200] cursor-wait" />}

            <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Fleet Schedule</h2>
                    <p className="text-sm text-gray-500">Manage CityDrive Hire booking requests.</p>
                </div>
                <div className="bg-white p-1 rounded-lg border border-gray-200 flex shadow-sm">
                    <button onClick={() => setView('list')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'list' ? 'bg-slate-900 text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}><FaList className="inline mr-2"/> List</button>
                    <button onClick={() => setView('calendar')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${view === 'calendar' ? 'bg-slate-900 text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}><FaCalendarAlt className="inline mr-2"/> Calendar</button>
                </div>
            </div>

            {view === 'list' ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-visible">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                            <tr>
                                <th className="px-6 py-4">Ref ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Vehicle</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-blue-600 font-bold">#{booking.booking_id}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{booking.user}</td>
                                    <td className="px-6 py-4 text-gray-500">{booking.car}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase border ${booking.color}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end items-center gap-2 relative">
                                        <button onClick={(e) => {e.stopPropagation(); setSelectedBooking(booking)}} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"><FaEye /></button>
                                        <div className="relative">
                                            <button 
                                                disabled={isProcessing}
                                                onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === booking.id ? null : booking.id); }}
                                                className="flex items-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 disabled:opacity-50"
                                            >
                                                Manage <FaChevronDown size={10} />
                                            </button>
                                            {activeDropdown === booking.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-2xl z-[150] py-1 text-left overflow-hidden ring-1 ring-black/5">
                                                    <button onClick={() => handleStatusUpdate(booking.id, 'confirmed')} className="w-full px-4 py-2 text-xs hover:bg-green-50 flex items-center gap-2 text-green-700 font-bold"><FaCheck /> Confirm Pickup</button>
                                                    <button onClick={() => handleStatusUpdate(booking.id, 'completed')} className="w-full px-4 py-2 text-xs hover:bg-blue-50 flex items-center gap-2 text-blue-700 font-bold"><FaCheckDouble /> Mark Completed</button>
                                                    <button onClick={() => handleStatusUpdate(booking.id, 'refunded')} className="w-full px-4 py-2 text-xs hover:bg-purple-50 flex items-center gap-2 text-purple-700 font-bold"><FaUndo /> Refund</button>
                                                    <div className="border-t my-1"></div>
                                                    <button onClick={() => handleStatusUpdate(booking.id, 'cancelled')} className="w-full px-4 py-2 text-xs hover:bg-red-50 flex items-center gap-2 text-red-600 font-bold"><FaTrash /> Cancel Booking</button>
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
                /* Calendar View remains similar but ensuring z-index on click */
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b font-bold text-gray-800 flex justify-between bg-slate-50">
                        <span>{today.toLocaleString('default', { month: 'long' })} {currentYear}</span>
                        <span className="text-xs text-gray-400 uppercase tracking-widest">Active Rentals</span>
                    </div>
                    <div className="grid grid-cols-7 bg-gray-200 gap-px">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="bg-gray-50 p-2 text-center text-[10px] font-black text-gray-400 uppercase">{d}</div>
                        ))}
                        {[...Array(firstDayOfMonth)].map((_, i) => <div key={`empty-${i}`} className="bg-white min-h-[120px] opacity-40"></div>)}
                        {[...Array(daysInMonth)].map((_, i) => {
                            const day = i + 1;
                            const daysBookings = bookings.filter(b => 
                                b.startYear === currentYear && 
                                b.startMonth === currentMonth && 
                                day >= b.startDay && day < (b.startDay + b.span)
                            );

                            return (
                                <div key={day} className="bg-white min-h-[120px] p-2 border-t hover:bg-gray-50 transition-colors">
                                    <span className={`text-xs font-bold ${day === today.getDate() ? 'bg-slate-900 text-white px-2 py-1 rounded-full' : 'text-gray-400'}`}>{day}</span>
                                    <div className="mt-2 space-y-1">
                                        {daysBookings.map(b => (
                                            <div 
                                                key={b.id} 
                                                onClick={() => setSelectedBooking(b)}
                                                className={`text-[9px] p-1 rounded border truncate font-bold cursor-pointer hover:scale-105 transition-transform ${b.color}`}
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

            {/* Slide-out Modal Details */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex justify-end">
                    <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto">
                        <div className="flex justify-between items-center mb-8 border-b pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Booking #{selectedBooking.booking_id}</h3>
                                <p className='text-xs text-gray-400'>Internal ID: {selectedBooking.id}</p>
                            </div>
                            <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600 p-2"><FaTimes size={20} /></button>
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
                                <button disabled={isProcessing} onClick={() => handleStatusUpdate(selectedBooking.id, 'confirmed')} className="bg-green-600 text-white py-3 rounded-lg font-bold text-xs hover:bg-green-700 disabled:opacity-50">Confirm Pickup</button>
                                <button disabled={isProcessing} onClick={() => handleStatusUpdate(selectedBooking.id, 'completed')} className="bg-blue-600 text-white py-3 rounded-lg font-bold text-xs hover:bg-blue-700 disabled:opacity-50">Mark Complete</button>
                                <button disabled={isProcessing} onClick={() => handleStatusUpdate(selectedBooking.id, 'refunded')} className="bg-purple-600 text-white py-3 rounded-lg font-bold text-xs hover:bg-purple-700 disabled:opacity-50">Issue Refund</button>
                                <button disabled={isProcessing} onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')} className="bg-red-600 text-white py-3 rounded-lg font-bold text-xs hover:bg-red-700 disabled:opacity-50">Cancel Rental</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}