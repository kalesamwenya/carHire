'use client';

import {
    FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt,
    FaCar, FaHistory, FaEdit, FaBan, FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';
import Link from "next/link";

export default function UserDetailsPage({ params }) {
    // In a real app, you would fetch user data using params.id
    // const { id } = params;

    // --- MOCK DATA ---
    const user = {
        id: 'USR-101',
        name: 'Alice Walker',
        email: 'alice@example.com',
        phone: '+260 972 338 115',
        address: '123 Independence Ave, Lusaka',
        role: 'Customer',
        joinDate: 'Jan 10, 2025',
        totalSpent: 4250,
        totalTrips: 12,
        status: 'Active', // Active, Suspended
        avatarColor: 'bg-purple-600'
    };

    const activeBooking = {
        id: 'BK-5520',
        car: 'Toyota Hilux 4x4',
        plate: 'ABZ 1234',
        startDate: 'Oct 24, 2025',
        endDate: 'Oct 28, 2025',
        status: 'In Progress',
        cost: 480,
        image: '/images/hilux.jpg' // Placeholder logic used below
    };

    // Set to null to test "No Active Booking" state
    // const activeBooking = null;

    const bookingHistory = [
        { id: 'BK-4900', car: 'Mercedes C-Class', date: 'Sep 10 - Sep 12, 2025', cost: 360, status: 'Completed' },
        { id: 'BK-4102', car: 'Suzuki Swift', date: 'Aug 05 - Aug 10, 2025', cost: 225, status: 'Completed' },
        { id: 'BK-3800', car: 'BMW X5', date: 'Jul 20 - Jul 22, 2025', cost: 500, status: 'Cancelled' },
    ];

    return (
        <div className="space-y-6 max-w-6xl mx-auto">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className={`h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md ${user.avatarColor}`}>
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">#{user.id}</span>
                            <span>•</span>
                            <span>Joined {user.joinDate}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    {/* Wrap the Edit button in a Link */}
                    <Link href={`/admin/users/${user.id}/edit`}>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors">
                            <FaEdit /> Edit Profile
                        </button>
                    </Link>

                    <button className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 text-sm font-medium transition-colors">
                        <FaBan /> Suspend User
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* --- LEFT COLUMN: PROFILE INFO --- */}
                <div className="space-y-6">

                    {/* Contact Details Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Contact Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FaEnvelope /></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Email</p>
                                    <p className="text-gray-900 text-sm break-all">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg"><FaPhone /></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Phone</p>
                                    <p className="text-gray-900 text-sm">{user.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><FaMapMarkerAlt /></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Address</p>
                                    <p className="text-gray-900 text-sm">{user.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lifetime Stats Card */}
                    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md">
                        <h3 className="font-bold mb-4 opacity-90">Customer Value</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-white/10 rounded-lg">
                                <p className="text-xs text-gray-300 uppercase font-bold">Total Spent</p>
                                <p className="text-2xl font-bold text-green-400">${user.totalSpent}</p>
                            </div>
                            <div className="p-3 bg-white/10 rounded-lg">
                                <p className="text-xs text-gray-300 uppercase font-bold">Total Trips</p>
                                <p className="text-2xl font-bold">{user.totalTrips}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: BOOKINGS --- */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Active Booking Section */}
                    {activeBooking ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-green-800 flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                                    Active Rental
                                </h3>
                                <span className="bg-white text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200 shadow-sm">
                            Return Pending
                        </span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6">
                                {/* Car Icon Placeholder */}
                                <div className="w-full sm:w-32 h-24 bg-green-200/50 rounded-lg flex items-center justify-center text-4xl text-green-600">
                                    <FaCar />
                                </div>

                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-green-600 font-bold uppercase">Vehicle</p>
                                        <p className="font-bold text-gray-800 text-lg">{activeBooking.car}</p>
                                        <p className="text-sm text-gray-600">{activeBooking.plate}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-green-600 font-bold uppercase">Return Date</p>
                                        <p className="font-bold text-gray-800 text-lg">{activeBooking.endDate}</p>
                                        <p className="text-sm text-gray-600">Total: ${activeBooking.cost}</p>
                                    </div>
                                </div>

                                <div className="flex items-end">
                                    <button className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-8 text-center">
                            <div className="inline-flex p-3 bg-white rounded-full text-gray-400 mb-3 shadow-sm"><FaCar /></div>
                            <h3 className="text-gray-900 font-medium">No Active Rental</h3>
                            <p className="text-gray-500 text-sm">User currently has no vehicles checked out.</p>
                        </div>
                    )}

                    {/* Booking History Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <FaHistory className="text-gray-400" /> Booking History
                            </h3>
                            <button className="text-sm text-green-600 font-medium hover:underline">View All</button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Vehicle</th>
                                    <th className="px-6 py-3">Date Range</th>
                                    <th className="px-6 py-3">Cost</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {bookingHistory.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs">{booking.id}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{booking.car}</td>
                                        <td className="px-6 py-4">{booking.date}</td>
                                        <td className="px-6 py-4 font-bold text-gray-700">${booking.cost}</td>
                                        <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                            booking.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                            {booking.status === 'Completed' ? <FaCheckCircle className="text-[10px]" /> : <FaTimesCircle className="text-[10px]" />}
                                            {booking.status}
                                        </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}