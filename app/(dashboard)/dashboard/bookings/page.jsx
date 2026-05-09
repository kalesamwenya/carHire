'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import {
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaDownload,
    FaCar,
    FaSearch,
    FaTimes,
    FaCogs,
    FaShieldAlt,
    FaReceipt,
    FaCheckCircle,
    FaSpinner,
} from 'react-icons/fa';

import { generateBookingReceipt } from '@/utils/generateBookingReceipt';
import { API_BASE_URL } from '@/lib/config';

const BASE_API =
    process.env.NEXT_PUBLIC_API_URL ||
    'https://api.citydrivehire.com';

const api = axios.create({
    baseURL: BASE_API,
    timeout: 15000,
});

export default function BookingsMasterPage() {
    const { data: session, status } = useSession();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);

    // FILTERS
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortBy, setSortBy] = useState('latest');

    // =========================================================
    // FETCH BOOKINGS
    // =========================================================
    useEffect(() => {
        if (status === 'authenticated') {
            fetchBookings();
        } else if (status !== 'loading') {
            setLoading(false);
        }
    }, [status, session]);

    const fetchBookings = async () => {
        try {
            setLoading(true);

            const params = {};

            // SUPPORT BOTH MEMBER + GUEST BOOKINGS
            if (session?.user?.id) {
                params.user_id = session.user.id;
            }

            if (session?.user?.email) {
                params.email = session.user.email;
            }

            const res = await api.get('/bookings/me.php', {
                params,
            });

            console.log('BOOKINGS RESPONSE:', res.data);

            /**
             * API STRUCTURE:
             * {
             *   success: true,
             *   count: 2,
             *   data: []
             * }
             */

            if (res.data?.success) {
                const raw = Array.isArray(res.data.data)
                    ? res.data.data
                    : [];

                /**
                 * REMOVE DUPLICATES
                 * because LEFT JOIN car_images can duplicate rows
                 */
                const unique = raw.filter(
                    (booking, index, self) =>
                        index ===
                        self.findIndex(
                            (b) =>
                                b.booking_id ===
                                booking.booking_id
                        )
                );

                setBookings(unique);
            } else {
                setBookings([]);
            }
        } catch (error) {
            console.error(
                'Failed to fetch bookings:',
                error
            );

            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // RECEIPT DOWNLOAD
    // =========================================================
    const handleDownloadReceipt = async (
        e,
        booking
    ) => {
        e.stopPropagation();

        try {
            await generateBookingReceipt({
                tx_ref:
                    booking.transaction_code ||
                    `TXN-${booking.booking_id}`,

                amount:
                    booking.quoted_price ||
                    booking.amount_paid ||
                    0,

                customer: {
                    name:
                        booking.customer_name ||
                        session?.user?.name ||
                        'Customer',

                    phone:
                        booking.customer_phone ||
                        'N/A',

                    license:
                        booking.license_number ||
                        'Verified',

                    email:
                        booking.customer_email ||
                        session?.user?.email ||
                        'N/A',
                },

                car: {
                    name:
                        booking.car_name ||
                        'Vehicle',

                    transmission:
                        booking.transmission ||
                        'Automatic',
                },

                dates: {
                    from: booking.pickup_date,
                    to: booking.return_date,
                },

                booking_id: booking.booking_id,
            });
        } catch (err) {
            console.error(err);

            alert(
                'Error generating receipt. Please try again.'
            );
        }
    };

    // =========================================================
    // FILTER + SORT
    // =========================================================
    const filteredBookings = useMemo(() => {
        let filtered = [...bookings];

        // -----------------------------
        // SEARCH
        // -----------------------------
        if (searchTerm.trim()) {
            const search =
                searchTerm.toLowerCase();

            filtered = filtered.filter((b) => {
                return (
                    b.car_name
                        ?.toLowerCase()
                        .includes(search) ||
                    b.booking_id
                        ?.toLowerCase()
                        .includes(search) ||
                    b.booking_ref
                        ?.toLowerCase()
                        .includes(search)
                );
            });
        }

        // -----------------------------
        // STATUS FILTER
        // -----------------------------
        if (filterStatus !== 'All') {
            filtered = filtered.filter(
                (b) =>
                    b.booking_status?.toLowerCase() ===
                    filterStatus.toLowerCase()
            );
        }

        // -----------------------------
        // SORTING
        // -----------------------------
        switch (sortBy) {
            case 'latest':
                filtered.sort(
                    (a, b) =>
                        new Date(
                            b.pickup_date
                        ).getTime() -
                        new Date(
                            a.pickup_date
                        ).getTime()
                );
                break;

            case 'oldest':
                filtered.sort(
                    (a, b) =>
                        new Date(
                            a.pickup_date
                        ).getTime() -
                        new Date(
                            b.pickup_date
                        ).getTime()
                );
                break;

            case 'highest':
                filtered.sort(
                    (a, b) =>
                        Number(
                            b.quoted_price || 0
                        ) -
                        Number(
                            a.quoted_price || 0
                        )
                );
                break;

            case 'lowest':
                filtered.sort(
                    (a, b) =>
                        Number(
                            a.quoted_price || 0
                        ) -
                        Number(
                            b.quoted_price || 0
                        )
                );
                break;

            default:
                break;
        }

        return filtered;
    }, [
        bookings,
        searchTerm,
        filterStatus,
        sortBy,
    ]);

    // =========================================================
    // LOADING
    // =========================================================
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-5">
                <FaSpinner className="animate-spin text-4xl text-green-600" />

                <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
                    Accessing Booking Vault...
                </p>
            </div>
        );
    }

    // =========================================================
    // EMPTY STATE
    // =========================================================
    const showEmpty =
        !loading && filteredBookings.length === 0;

    // =========================================================
    // MAIN UI
    // =========================================================
    return (
        <div className="max-w-8xl mx-auto py-10 px-4 font-sans">
            {/* HEADER */}
            <header className="mb-10 space-y-6">
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                    <div>
                        <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">
                            City Drive Hire
                        </p>

                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                            Booking Vault
                        </h1>

                        <p className="text-gray-500 font-medium mt-2">
                            {filteredBookings.length}{' '}
                            booking
                            {filteredBookings.length !== 1
                                ? 's'
                                : ''}{' '}
                            found
                        </p>
                    </div>

                    {/* SORT */}
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Sort
                        </span>

                        <select
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(
                                    e.target.value
                                )
                            }
                            className="bg-white border border-gray-100 rounded-2xl px-5 py-3 text-xs font-bold outline-none focus:ring-2 focus:ring-green-500/20"
                        >
                            <option value="latest">
                                Latest
                            </option>

                            <option value="oldest">
                                Oldest
                            </option>

                            <option value="highest">
                                Highest Price
                            </option>

                            <option value="lowest">
                                Lowest Price
                            </option>
                        </select>
                    </div>
                </div>

                {/* FILTERS */}
                <div className="bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50 flex flex-col xl:flex-row gap-4">
                    {/* SEARCH */}
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />

                        <input
                            type="text"
                            placeholder="Search vehicle or booking ID..."
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-[1.5rem] border-none text-sm font-bold focus:ring-2 focus:ring-green-500/20 outline-none"
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    {/* STATUS FILTER */}
                    <div className="flex bg-gray-50 p-1.5 rounded-[1.5rem] overflow-x-auto no-scrollbar">
                        {[
                            'All',
                            'Pending',
                            'Confirmed',
                            'Upcoming',
                            'Completed',
                            'Cancelled',
                        ].map((status) => (
                            <button
                                key={status}
                                onClick={() =>
                                    setFilterStatus(
                                        status
                                    )
                                }
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                    filterStatus ===
                                    status
                                        ? 'bg-white shadow-sm text-gray-900'
                                        : 'text-gray-400 hover:text-gray-700'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* EMPTY STATE */}
            {showEmpty ? (
                <div className="py-24 text-center">
                    <div className="w-24 h-24 mx-auto rounded-[2rem] bg-gray-100 flex items-center justify-center text-gray-300 mb-8">
                        <FaCar size={40} />
                    </div>

                    <h2 className="text-3xl font-black text-gray-900 mb-3">
                        No Bookings Found
                    </h2>

                    <p className="text-gray-500 font-medium">
                        Try adjusting your search or
                        filter settings.
                    </p>
                </div>
            ) : (
                <>
                    {/* GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBookings.map(
                            (booking) => (
                                <div
                                    key={`${booking.booking_id}-${booking.internal_id}`}
                                    onClick={() =>
                                        setSelectedBooking(
                                            booking
                                        )
                                    }
                                    className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
                                >
                                    {/* IMAGE */}
                                    <div className="h-44 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                                        {booking.featured_image ||
                                        booking.image_url ? (
                                            <img
                                                src={`${BASE_API}/${booking.featured_image || booking.image_url}`}
                                                alt={
                                                    booking.car_name
                                                }
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <FaCar className="text-gray-200 text-7xl group-hover:scale-110 transition-transform duration-700" />
                                        )}

                                        <span
                                            className={`absolute top-6 left-6 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                booking.booking_status?.toLowerCase() ===
                                                'completed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : booking.booking_status?.toLowerCase() ===
                                                      'pending'
                                                    ? 'bg-orange-100 text-orange-700'
                                                    : booking.booking_status?.toLowerCase() ===
                                                      'cancelled'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-blue-100 text-blue-700'
                                            }`}
                                        >
                                            {
                                                booking.booking_status
                                            }
                                        </span>
                                    </div>

                                    {/* BODY */}
                                    <div className="p-8">
                                        <h3 className="text-xl font-black text-gray-900 mb-1">
                                            {
                                                booking.car_name
                                            }
                                        </h3>

                                        <p className="text-xs font-bold text-gray-400 mb-4 flex items-center gap-2">
                                            <FaCalendarAlt
                                                size={
                                                    10
                                                }
                                            />

                                            {
                                                booking.pickup_date
                                            }
                                        </p>

                                        <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                            <p className="text-lg font-black text-gray-900">
                                                K
                                                {Number(
                                                    booking.quoted_price ||
                                                        0
                                                ).toLocaleString()}
                                            </p>

                                            <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:text-green-600 transition-colors">
                                                <FaReceipt />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </>
            )}

            {/* MODAL */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
                        onClick={() =>
                            setSelectedBooking(null)
                        }
                    />

                    <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        {/* CLOSE */}
                        <button
                            onClick={() =>
                                setSelectedBooking(null)
                            }
                            className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors z-20"
                        >
                            <FaTimes size={20} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* LEFT */}
                            <div className="bg-green-600 p-12 text-white flex flex-col justify-between">
                                <div>
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                                        <FaCheckCircle
                                            size={24}
                                        />
                                    </div>

                                    <h2 className="text-3xl font-black leading-tight">
                                        Booking
                                        <br />
                                        Verified
                                    </h2>

                                    <p className="mt-4 text-green-100 font-mono text-xs uppercase tracking-widest">
                                        ID:{' '}
                                        {
                                            selectedBooking.booking_id
                                        }
                                    </p>
                                </div>

                                <div className="space-y-4 pt-10">
                                    <div className="flex items-center gap-4 text-sm font-bold bg-white/10 p-3 rounded-2xl">
                                        <FaCogs className="text-green-200" />

                                        {selectedBooking.transmission ||
                                            'Automatic'}
                                    </div>

                                    <div className="flex items-center gap-4 text-sm font-bold bg-white/10 p-3 rounded-2xl">
                                        <FaShieldAlt className="text-green-200" />

                                        Payment:{' '}
                                        {selectedBooking.payment_status ||
                                            'Pending'}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="p-10 bg-white">
                                <div className="mb-8">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                                        Total Amount
                                    </p>

                                    <h3 className="text-4xl font-black text-gray-900">
                                        K
                                        {Number(
                                            selectedBooking.quoted_price ||
                                                0
                                        ).toLocaleString()}
                                    </h3>

                                    <p className="text-[10px] text-green-600 font-bold mt-1 italic">
                                        Booking registered
                                        successfully
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {/* DATES */}
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                            <FaCalendarAlt
                                                size={14}
                                            />
                                        </div>

                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase">
                                                Duration
                                            </p>

                                            <p className="text-xs font-bold text-gray-800">
                                                {
                                                    selectedBooking.pickup_date
                                                }{' '}
                                                to{' '}
                                                {
                                                    selectedBooking.return_date
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* LOCATION */}
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                            <FaMapMarkerAlt
                                                size={14}
                                            />
                                        </div>

                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase">
                                                Pickup
                                                Location
                                            </p>

                                            <p className="text-xs font-bold text-gray-800">
                                                City Drive
                                                Hub,
                                                Lusaka
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ACTION */}
                                <div className="mt-12">
                                    {[
                                        'completed',
                                        'confirmed',
                                        'upcoming',
                                    ].includes(
                                        selectedBooking.booking_status?.toLowerCase()
                                    ) ? (
                                        <button
                                            onClick={(e) =>
                                                handleDownloadReceipt(
                                                    e,
                                                    selectedBooking
                                                )
                                            }
                                            className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 active:scale-95"
                                        >
                                            <FaDownload className="animate-pulse" />

                                            Get Digital
                                            Receipt
                                        </button>
                                    ) : (
                                        <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                                            <p className="text-[10px] font-bold text-orange-700 uppercase">
                                                Payment
                                                Pending
                                            </p>
                                        </div>
                                    )}

                                    <p className="text-center text-[9px] text-gray-400 mt-6 font-medium">
                                        Powered by City
                                        Drive Hire
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}