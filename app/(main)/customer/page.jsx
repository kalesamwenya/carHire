'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaCar, FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function CustomerBookingsPage() {
    const { data: session } = useSession();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const Public_Api = "https://api.citydrivehire.com";

    useEffect(() => {
        const fetchBookings = async () => {
            if (!session?.user?.id) return;
            try {
                const res = await fetch(`${Public_Api}/bookings/get-customer-bookings.php?user_id=${session.user.id}`);
                const result = await res.json();
                if (result.success) setBookings(result.data);
            } catch (error) {
                console.error("Failed to load bookings");
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [session]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    if (loading) return <div className="p-20 text-center text-gray-500 italic">Fetching your trips...</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

            {bookings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                    <FaCar className="mx-auto text-gray-300 text-5xl mb-4" />
                    <p className="text-gray-500">You haven't made any reservations yet.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
                            {/* Car Image */}
                            <div className="w-full md:w-48 h-48 md:h-auto relative">
                                <img 
                                    src={`${process.env.NEXT_PUBLIC_BASE_URL}/${booking.main_image}`} 
                                    alt={booking.make_model}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Details */}
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{booking.make_model}</h3>
                                        <p className="text-sm text-gray-500">Provider: <span className="font-medium">{booking.partner_name}</span></p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(booking.status)}`}>
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FaCalendarAlt className="text-gray-400" />
                                        <span>{booking.start_date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FaClock className="text-gray-400" />
                                        <span>Total: ZMW {booking.total_price}</span>
                                    </div>
                                </div>

                                {booking.status === 'Confirmed' && (
                                    <div className="mt-2 p-3 bg-green-50 rounded-xl flex items-center gap-3 text-xs text-green-800">
                                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                                        <p>Booking confirmed! You can contact the provider at <strong>{booking.partner_phone}</strong> to coordinate pickup.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}