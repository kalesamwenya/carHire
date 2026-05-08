'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaCheck,
    FaTimes,
    FaList,
    FaCalendarAlt,
    FaChevronDown,
    FaChevronLeft,
    FaChevronRight,
    FaEye,
    FaUndo,
    FaCheckDouble,
    FaTrash,
    FaUser,
    FaCar,
    FaClock,
    FaSearch,
    FaMoneyBillWave,
    FaEnvelope,
    FaPhone,
    FaCreditCard,
    FaMapMarkerAlt,
    FaCalendarCheck
} from 'react-icons/fa';

import CityDriveLoader from '@/components/CityDriveLoader';
import { generateBookingReceipt } from "@/utils/generateBookingReceipt";

export default function BookingsPage() {
    const BASE_API =
        process.env.NEXT_PUBLIC_API_URL || 'https://api.citydrivehire.com';

    const [view, setView] = useState('list');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: 'success'
    });

    const [navDate, setNavDate] = useState(new Date());

    const showToast = (message, type = 'success') => {
        setToast({
            show: true,
            message,
            type
        });

        setTimeout(() => {
            setToast({
                show: false,
                message: '',
                type: 'success'
            });
        }, 4000);
    };

    const getStatusColor = (status) => {
        const s = status?.toLowerCase();

        switch (s) {
            case 'confirmed':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';

            case 'completed':
                return 'bg-blue-100 text-blue-700 border-blue-200';

            case 'refunded':
                return 'bg-purple-100 text-purple-700 border-purple-200';

            case 'cancelled':
                return 'bg-rose-100 text-rose-700 border-rose-200';

            default:
                return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

  const fetchBookings = async () => {
    try {
        setLoading(true);
        const res = await axios.get(`${BASE_API}/admin/get-master-records.php`);
        const rawData = res.data?.data || [];

        const mapped = rawData.map((b) => ({
            ...b,
            id: b.internal_id,
            bookingRef: b.reference_no,
            user: b.customer_name || 'Guest Customer',
            // Ensure these match your PHP SQL Aliases exactly
            email: b.customer_email, 
            phone: b.customer_phone,
            license: b.license_number || 'N/A', // Make sure license_number is in your SELECT if needed
            car: b.vehicle_name || 'Unknown Vehicle',
            transmission: b.transmission || 'Automatic',
            total: parseFloat(b.quoted_amount || 0),
            paid: parseFloat(b.total_paid || 0),
            balance: parseFloat(b.balance_due || 0),
            status: b.booking_status || 'pending',
            color: getStatusColor(b.booking_status),
            residency: b.residency || 'Local',
            pickup_date: b.pickup_date,
            return_date: b.return_date,
            pickup_display: new Date(b.pickup_date).toLocaleDateString(),
            return_display: new Date(b.return_date).toLocaleDateString(),
        }));

        setBookings(mapped);
    } catch (err) {
        showToast('Failed to fetch master records.', 'error');
    } finally {
        setLoading(false);
    }
};
useEffect(() => {
    fetchBookings();
}, []);

const handleStatusUpdate = async (id, newStatus) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
        await axios.post(`${BASE_API}/admin/update_booking_status.php`, 
            { id, status: newStatus },
            { headers: { 'Content-Type': 'application/json' } }
        );

        if (newStatus === 'confirmed') {
            const b = bookings.find(item => item.id === id);
            if (b) {
                // Now passing the mapped fields correctly
                await generateBookingReceipt({
                    tx_ref: b.bookingRef,
                    amount: b.total,
                    customer: {
                        name: b.user,
                        phone: b.customer_phone || 'N/A',   // Uses the mapped b.phone
                        email: b.customer_email || 'N/A',   // Uses the mapped b.email
                        license: b.license || 'N/A',
                        residency: b.residency || 'Local'
                    },
                    car: {
                        name: b.car,
                        transmission: b.transmission
                    },
                    dates: {
                        from: b.pickup_date,
                        to: b.return_date
                    },
                    booking_id: id
                });
            }
        }
        showToast(`Status updated to ${newStatus}`);
        fetchBookings(); // Refresh to get latest balance/status from DB
    } catch (err) {
        showToast('Update failed.', 'error');
    } finally {
        setIsProcessing(false);
        setActiveDropdown(null);
    }
};
    /**
     * FILTERS
     */
    const filteredBookings = useMemo(() => {
        return bookings.filter((b) => {
            const matchesSearch =
                b.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.bookingRef?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.car?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === 'all'
                    ? true
                    : b.status?.toLowerCase() === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [bookings, searchTerm, statusFilter]);

    /**
     * CALENDAR
     */
    const daysInMonth = new Date(
        navDate.getFullYear(),
        navDate.getMonth() + 1,
        0
    ).getDate();

    const firstDayOfMonth = new Date(
        navDate.getFullYear(),
        navDate.getMonth(),
        1
    ).getDay();

    const changeMonth = (offset) => {
        setNavDate(
            new Date(
                navDate.getFullYear(),
                navDate.getMonth() + offset,
                1
            )
        );
    };

    if (loading) {
        return <CityDriveLoader message="syncing fleet data..." />;
    }

    return (
        <div
            className="relative min-h-screen bg-slate-50 px-4 md:px-8 pb-20"
            onClick={() => setActiveDropdown(null)}
        >
            {/* TOAST */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        className={`fixed top-6 right-6 z-[500] px-5 py-4 rounded-2xl shadow-2xl text-sm font-bold border ${
                            toast.type === 'error'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                    >
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PROCESSING OVERLAY */}
            {isProcessing && (
                <div className="fixed inset-0 z-[400] bg-black/10 backdrop-blur-[1px] cursor-wait" />
            )}

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row justify-between lg:items-center py-8 gap-5">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Fleet Schedule
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Real-time rental management dashboard.
                    </p>
                </div>

                

                <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                    <button
                        onClick={() => setView('list')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            view === 'list'
                                ? 'bg-slate-900 text-white shadow-lg'
                                : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <FaList />
                        List
                    </button>

                    <button
                        onClick={() => setView('calendar')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            view === 'calendar'
                                ? 'bg-slate-900 text-white shadow-lg'
                                : 'text-slate-500 hover:bg-slate-50'
                        }`}
                    >
                        <FaCalendarAlt />
                        Calendar
                    </button>
                </div>
            </div>

            {/* Quick stats */}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: 'Total Active', val: bookings.filter(b => b.status === 'confirmed').length, color: 'text-emerald-600' },
                    { label: 'Pending Payment', val: bookings.filter(b => b.balance > 0).length, color: 'text-amber-600' },
                    { label: 'Today\'s Pickups', val: bookings.filter(b => b.pickup_date === new Date().toISOString().split('T')[0]).length, color: 'text-blue-600' },
                    { label: 'Total Revenue', val: `K${bookings.reduce((acc, b) => acc + Number(b.paid), 0).toLocaleString()}`, color: 'text-slate-900' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-[10px] uppercase font-black text-slate-400 mb-1">{stat.label}</p>
                        <p className={`text-xl font-black ${stat.color}`}>{stat.val}</p>
                    </div>
                ))}
            </div>

            {/* FILTER BAR */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                        type="text"
                        placeholder="Search booking, customer or vehicle..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-14 bg-white border border-slate-200 rounded-2xl pl-12 pr-4 outline-none focus:ring-2 focus:ring-slate-900 shadow-sm"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-14 px-5 bg-white border border-slate-200 rounded-2xl outline-none shadow-sm font-medium text-slate-700"
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="refunded">Refunded</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* LIST VIEW */}
            {view === 'list' ? (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-5 text-[11px] uppercase tracking-wider text-slate-400 font-black">
                                        Booking
                                    </th>

                                    <th className="px-6 py-5 text-[11px] uppercase tracking-wider text-slate-400 font-black">
                                        Customer
                                    </th>

                                    <th className="px-6 py-5 text-[11px] uppercase tracking-wider text-slate-400 font-black">
                                        Vehicle
                                    </th>

                                    <th className="px-6 py-5 text-[11px] uppercase tracking-wider text-slate-400 font-black">
                                        Payment
                                    </th>

                                    <th className="px-6 py-5 text-[11px] uppercase tracking-wider text-slate-400 font-black">
                                        Status
                                    </th>

                                    <th className="px-6 py-5 text-[11px] uppercase tracking-wider text-slate-400 font-black text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredBookings.map((booking) => (
                                    <tr
                                        key={booking.id}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-6 py-5">
                                            <p className="font-mono text-xs text-blue-600 font-black mb-1">
                                                #{booking.bookingRef}
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                {booking.pickup_display} →
                                                {' '}
                                                {booking.return_display}
                                            </p>
                                        </td>

                                        <td className="px-6 py-5">
                                            <p className="font-bold text-slate-900">
                                                {booking.user}
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                {booking.customer_email}
                                            </p>
                                        </td>

                                        <td className="px-6 py-5">
                                            <p className="font-bold text-slate-700">
                                                {booking.car}
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                {booking.plate_number}
                                            </p>
                                        </td>

                                        <td className="px-6 py-5">
                                            <p className="font-black text-slate-900">
                                                K
                                                {booking.total.toLocaleString()}
                                            </p>

                                            <p
                                                className={`text-xs font-bold ${
                                                    booking.balance > 0
                                                        ? 'text-amber-600'
                                                        : 'text-emerald-600'
                                                }`}
                                            >
                                                {booking.balance > 0
                                                    ? `Balance: K${booking.balance.toLocaleString()}`
                                                    : 'Fully Paid'}
                                            </p>
                                        </td>

                                        <td className="px-6 py-5">
                                            <span
                                                className={`px-3 py-1 rounded-full text-[10px] uppercase font-black border ${booking.color}`}
                                            >
                                                {booking.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5 text-right relative">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        setSelectedBooking(
                                                            booking
                                                        )
                                                    }
                                                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white transition-all"
                                                >
                                                    <FaEye />
                                                </button>

                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();

                                                            setActiveDropdown(
                                                                activeDropdown ===
                                                                    booking.id
                                                                    ? null
                                                                    : booking.id
                                                            );
                                                        }}
                                                        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:shadow-lg"
                                                    >
                                                        Manage
                                                        <FaChevronDown
                                                            size={10}
                                                        />
                                                    </button>

                                                    <AnimatePresence>
                                                        {activeDropdown ===
                                                            booking.id && (
                                                            <motion.div
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: 10
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: 0
                                                                }}
                                                                exit={{
                                                                    opacity: 0,
                                                                    y: 10
                                                                }}
                                                                className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[200] py-2 overflow-hidden"
                                                            >
                                                                <button
                                                                    onClick={() =>
                                                                        handleStatusUpdate(
                                                                            booking.id,
                                                                            'confirmed'
                                                                        )
                                                                    }
                                                                    className="w-full px-4 py-3 text-xs hover:bg-emerald-50 flex items-center gap-3 text-emerald-700 font-bold"
                                                                >
                                                                    <FaCheck />
                                                                    Confirm
                                                                    Pickup
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        handleStatusUpdate(
                                                                            booking.id,
                                                                            'completed'
                                                                        )
                                                                    }
                                                                    className="w-full px-4 py-3 text-xs hover:bg-blue-50 flex items-center gap-3 text-blue-700 font-bold"
                                                                >
                                                                    <FaCheckDouble />
                                                                    Mark
                                                                    Completed
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        handleStatusUpdate(
                                                                            booking.id,
                                                                            'refunded'
                                                                        )
                                                                    }
                                                                    className="w-full px-4 py-3 text-xs hover:bg-purple-50 flex items-center gap-3 text-purple-700 font-bold"
                                                                >
                                                                    <FaUndo />
                                                                    Refund
                                                                </button>

                                                                <div className="h-px bg-slate-100 my-1"></div>

                                                                <button
                                                                    onClick={() =>
                                                                        handleStatusUpdate(
                                                                            booking.id,
                                                                            'cancelled'
                                                                        )
                                                                    }
                                                                    className="w-full px-4 py-3 text-xs hover:bg-rose-50 flex items-center gap-3 text-rose-600 font-bold"
                                                                >
                                                                    <FaTrash />
                                                                    Cancel
                                                                    Booking
                                                                </button>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                    {/* CALENDAR HEADER */}
                    <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                        <div className="flex items-center gap-4">
                            <h3 className="text-xl font-black text-slate-900">
                                {navDate.toLocaleString('default', {
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </h3>

                            <div className="flex gap-1 bg-white border rounded-xl p-1">
                                <button
                                    onClick={() => changeMonth(-1)}
                                    className="p-2 hover:bg-slate-50 rounded-lg"
                                >
                                    <FaChevronLeft size={12} />
                                </button>

                                <button
                                    onClick={() => changeMonth(1)}
                                    className="p-2 hover:bg-slate-50 rounded-lg"
                                >
                                    <FaChevronRight size={12} />
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setNavDate(new Date())}
                            className="text-xs font-bold text-blue-600"
                        >
                            Today
                        </button>
                    </div>

                    <div className="grid grid-cols-7 bg-slate-100 gap-px">
                        {[
                            'Sun',
                            'Mon',
                            'Tue',
                            'Wed',
                            'Thu',
                            'Fri',
                            'Sat'
                        ].map((d) => (
                            <div
                                key={d}
                                className="bg-slate-50 p-4 text-center text-[10px] uppercase tracking-widest font-black text-slate-400"
                            >
                                {d}
                            </div>
                        ))}

                        {[...Array(firstDayOfMonth)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-white min-h-[140px]"
                            />
                        ))}

                        {[...Array(daysInMonth)].map((_, i) => {
                            const day = i + 1;

                            const checkDate = new Date(
                                navDate.getFullYear(),
                                navDate.getMonth(),
                                day
                            );

                            const isToday =
                                checkDate.toDateString() ===
                                new Date().toDateString();

                            const dayBookings = filteredBookings.filter(
                                (b) =>
                                    checkDate >= b.startDate &&
                                    checkDate <= b.endDate
                            );

                            return (
                                <div
                                    key={day}
                                    className="bg-white min-h-[140px] p-2 border-t border-slate-50 hover:bg-slate-50/50"
                                >
                                    <span
                                        className={`text-xs font-black px-2 py-1 rounded-lg inline-block ${
                                            isToday
                                                ? 'bg-slate-900 text-white'
                                                : 'text-slate-400'
                                        }`}
                                    >
                                        {day}
                                    </span>

                                    <div className="mt-2 space-y-1">
                                        {dayBookings
                                            .slice(0, 4)
                                            .map((b) => (
                                                <div
                                                    key={b.id}
                                                    onClick={() =>
                                                        setSelectedBooking(b)
                                                    }
                                                    className={`text-[9px] p-1.5 rounded-lg border truncate font-black cursor-pointer hover:scale-105 transition-transform ${b.color}`}
                                                >
                                                    {b.car} ({b.plate_number})
                                                </div>
                                            ))}

                                        {dayBookings.length > 4 && (
                                            <p className="text-[9px] text-center font-bold text-slate-400">
                                                +
                                                {dayBookings.length - 4}
                                                {' '}
                                                more
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* SIDEBAR */}
            <AnimatePresence>
                {selectedBooking && (
                    <div className="fixed inset-0 z-[500] flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedBooking(null)}
                            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{
                                type: 'spring',
                                damping: 25,
                                stiffness: 200
                            }}
                            className="relative w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-blue-600 font-black">
                                            Booking Reference
                                        </p>

                                        <h2 className="text-3xl font-black text-slate-900">
                                            #
                                            {selectedBooking.bookingRef}
                                        </h2>
                                    </div>

                                    <button
                                        onClick={() =>
                                            setSelectedBooking(null)
                                        }
                                        className="p-3 rounded-full hover:bg-slate-100"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>

                                <div className="space-y-5">
                                    {/* STATUS */}
                                    <div
                                        className={`inline-flex px-4 py-2 rounded-full text-xs uppercase font-black border ${selectedBooking.color}`}
                                    >
                                        {selectedBooking.status}
                                    </div>

                                    {/* CUSTOMER */}
                                    <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                                                <FaUser />
                                            </div>

                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">
                                                    Customer
                                                </p>

                                                <h3 className="font-black text-lg text-slate-900">
                                                    {selectedBooking.user}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* GRID */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 rounded-3xl border border-slate-100">
                                            <FaCar className="text-blue-500 mb-2" />

                                            <p className="text-[10px] uppercase font-black text-slate-400 mb-1">
                                                Vehicle
                                            </p>

                                            <p className="font-bold text-slate-800">
                                                {selectedBooking.car}
                                            </p>

                                            <p className="text-xs text-slate-400 mt-1">
                                                {
                                                    selectedBooking.plate_number
                                                }
                                            </p>
                                        </div>

                                        <div className="p-5 rounded-3xl border border-slate-100">
                                            <FaMoneyBillWave className="text-emerald-500 mb-2" />

                                            <p className="text-[10px] uppercase font-black text-slate-400 mb-1">
                                                Amount
                                            </p>

                                            <p className="font-black text-slate-900 text-xl">
                                                K
                                                {selectedBooking.total.toLocaleString()}
                                            </p>

                                            <p className="text-xs text-slate-400">
                                                Paid: K
                                                {selectedBooking.paid.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* CONTACT */}
                                    <div className="p-6 rounded-3xl border border-slate-100 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <FaEnvelope className="text-slate-400" />

                                            <span className="text-sm font-medium text-slate-700">
                                                {
                                                    selectedBooking.customer_email
                                                }
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <FaPhone className="text-slate-400" />

                                            <span className="text-sm font-medium text-slate-700">
                                                {
                                                    selectedBooking.customer_phone
                                                }
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <FaMapMarkerAlt className="text-slate-400" />

                                            <span className="text-sm font-medium text-slate-700">
                                                {
                                                    selectedBooking.residency
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* RENTAL PERIOD */}
                                    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <FaCalendarCheck className="text-blue-500" />

                                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">
                                                Rental Timeline
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-xs font-bold text-slate-500">
                                                    PICKUP
                                                </p>

                                                <p className="font-black text-slate-900">
                                                    {
                                                        selectedBooking.pickup_display
                                                    }
                                                </p>
                                            </div>

                                            <div className="flex-1 h-px bg-slate-200 mx-4"></div>

                                            <div className="text-right">
                                                <p className="text-xs font-bold text-slate-500">
                                                    RETURN
                                                </p>

                                                <p className="font-black text-slate-900">
                                                    {
                                                        selectedBooking.return_display
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PAYMENT */}
                                    <div className="p-6 rounded-3xl border border-slate-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <FaCreditCard className="text-purple-500" />

                                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">
                                                Payment Details
                                            </p>
                                        </div>

                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">
                                                    Method
                                                </span>

                                                <span className="font-bold text-slate-900">
                                                    {
                                                        selectedBooking.payment_method
                                                    }
                                                </span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-slate-500">
                                                    Status
                                                </span>

                                                <span className="font-bold text-slate-900">
                                                    {
                                                        selectedBooking.payment_status
                                                    }
                                                </span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-slate-500">
                                                    Transaction
                                                </span>

                                                <span className="font-mono text-xs font-bold text-blue-600">
                                                    {
                                                        selectedBooking.transaction_code
                                                    }
                                                </span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-slate-500">
                                                    Balance Due
                                                </span>

                                                <span
                                                    className={`font-black ${
                                                        selectedBooking.balance >
                                                        0
                                                            ? 'text-amber-600'
                                                            : 'text-emerald-600'
                                                    }`}
                                                >
                                                    K
                                                    {selectedBooking.balance.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="pt-6 border-t space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                disabled={isProcessing}
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        selectedBooking.id,
                                                        'confirmed'
                                                    )
                                                }
                                                className="bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs hover:bg-emerald-700"
                                            >
                                                CONFIRM
                                            </button>

                                            <button
                                                disabled={isProcessing}
                                                onClick={() =>
                                                    handleStatusUpdate(
                                                        selectedBooking.id,
                                                        'completed'
                                                    )
                                                }
                                                className="bg-blue-600 text-white py-4 rounded-2xl font-black text-xs hover:bg-blue-700"
                                            >
                                                COMPLETE
                                            </button>
                                        </div>

                                        <button
                                            disabled={isProcessing}
                                            onClick={() =>
                                                handleStatusUpdate(
                                                    selectedBooking.id,
                                                    'refunded'
                                                )
                                            }
                                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-3"
                                        >
                                            <FaUndo />
                                            ISSUE REFUND
                                        </button>

                                        <button
                                            disabled={isProcessing}
                                            onClick={() =>
                                                handleStatusUpdate(
                                                    selectedBooking.id,
                                                    'cancelled'
                                                )
                                            }
                                            className="w-full bg-rose-50 text-rose-600 py-4 rounded-2xl font-black text-xs hover:bg-rose-100"
                                        >
                                            CANCEL BOOKING
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}