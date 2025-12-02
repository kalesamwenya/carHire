import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

async function getBookings() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/bookings`, { cache: 'no-store' });
    return res.ok ? res.json() : [];
}

export default async function BookingsPage() {
    const bookings = await getBookings();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Booking History</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {bookings.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {bookings.map((booking) => (
                            <div key={booking.booking_id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg text-gray-900">
                                                {booking.car_name || `Vehicle ${booking.car_id}`}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                                booking.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500 flex flex-col sm:flex-row gap-2 sm:gap-6">
                                            <span className="flex items-center gap-1"><FaCalendarAlt /> {booking.from} - {booking.to}</span>
                                            <span className="flex items-center gap-1"><FaMapMarkerAlt /> Lusaka Pickup</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-row md:flex-col justify-between items-end">
                                        <span className="text-sm text-gray-400">Total Cost</span>
                                        <span className="font-bold text-xl text-green-700">ZMW {booking.total}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-gray-500">
                        You haven't made any bookings yet.
                    </div>
                )}
            </div>
        </div>
    );
}