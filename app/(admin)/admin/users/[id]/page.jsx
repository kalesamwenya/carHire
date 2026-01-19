'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
    FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt,
    FaCar, FaHistory, FaEdit, FaBan, FaCheckCircle, FaTimesCircle, FaSpinner,
    FaGift, FaChartLine, FaClock
} from 'react-icons/fa';
import Link from "next/link";

export default function UserDetailsPage() {
    const params = useParams();
    const id = params?.id;

    const [userData, setUserData] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming'); // State for the new tab logic

    useEffect(() => {
        async function fetchData() {
            if (!id) return;
            try {
                const res = await fetch(`https://api.citydrivehire.com/admin/get_user.php?id=${id}`);
                const json = await res.json();
                if (json.success) {
                    setUserData(json.user);
                    setBookings(json.bookings);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center h-64 text-purple-600">
            <FaSpinner className="animate-spin text-2xl" />
        </div>
    );

    if (!userData) return <div className="p-10 text-center">User not found.</div>;

    // --- DATA LOGIC ---
    
    const activeBooking = bookings.find(b => b.status === 'ongoing' || b.status === 'In Progress');
    const now = new Date();
const upcomingBookings = bookings.filter(b => new Date(b.pickup_date) > now && b.status !== 'cancelled');
const historyBookings = bookings.filter(b => new Date(b.return_date) < now || b.status === 'completed' || b.status === 'cancelled');

   const loyaltyPoints = userData.loyalty_points || 0;
const totalSpent = userData.total_revenue || 0;
    
    // Performance: Completed vs Total (excluding upcoming)
    const finishedCount = bookings.filter(b => b.status === 'completed').length;
    const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;
    const reliability = finishedCount + cancelledCount > 0 
        ? Math.round((finishedCount / (finishedCount + cancelledCount)) * 100) 
        : 100;

    const joinDate = new Date(userData.created_at).toLocaleDateString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric' 
    });

    return (
        <div className="space-y-6 max-w-6xl mx-auto">

            {/* --- HEADER (Unchanged) --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md bg-purple-600">
                        {userData.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">#{userData.id}</span>
                            <span>•</span>
                            <span>Joined {joinDate}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href={`/admin/users/${userData.id}/edit`}>
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

                {/* --- LEFT COLUMN --- */}
                <div className="space-y-6">
                    {/* Profile Info (Unchanged) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Contact Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FaEnvelope /></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Email</p>
                                    <p className="text-gray-900 text-sm break-all">{userData.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg"><FaPhone /></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Phone</p>
                                    <p className="text-gray-900 text-sm">{userData.phone || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance & Loyalty (Integrated into your dark card) */}
                    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md space-y-6">
                        <div>
                            <h3 className="font-bold mb-4 opacity-90 flex items-center gap-2"><FaGift className="text-purple-400"/> Loyalty Points</h3>
                            <div className="p-3 bg-white/10 rounded-lg">
                                <p className="text-xs text-gray-300 uppercase font-bold tracking-tight">Emit Points Balance</p>
                                <p className="text-3xl font-black text-green-400">{loyaltyPoints.toLocaleString()}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold mb-4 opacity-90 flex items-center gap-2"><FaChartLine className="text-blue-400"/> Performance</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                                    <span className="text-gray-400">Reliability</span>
                                    <span className="text-blue-400">{reliability}%</span>
                                </div>
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full transition-all" style={{width: `${reliability}%`}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN --- */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Active Booking Section (Unchanged) */}
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
                            </div>
                            <div className="flex flex-col sm:flex-row gap-6">
                                <div className="w-full sm:w-32 h-24 bg-green-200/50 rounded-lg flex items-center justify-center text-4xl text-green-600">
                                    <FaCar />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-green-600 font-bold uppercase">Vehicle</p>
                                    <p className="font-bold text-gray-800 text-lg">{activeBooking.car_name}</p>
                                    <p className="text-sm text-gray-600">Due: {new Date(activeBooking.return_date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-50 border border-gray-200 border-dashed rounded-xl p-6 text-center text-gray-500 text-sm">
                             No vehicles currently checked out.
                        </div>
                    )}

                    {/* Tabs for Upcoming and History */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="flex border-b border-gray-100">
                            <button 
                                onClick={() => setActiveTab('upcoming')}
                                className={`px-6 py-4 text-sm font-bold flex items-center gap-2 ${activeTab === 'upcoming' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <FaClock /> Upcoming
                            </button>
                            <button 
                                onClick={() => setActiveTab('history')}
                                className={`px-6 py-4 text-sm font-bold flex items-center gap-2 ${activeTab === 'history' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <FaHistory /> History
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                                    <tr>
                                        <th className="px-6 py-3">Vehicle</th>
                                        <th className="px-6 py-3">Date Range</th>
                                        <th className="px-6 py-3">Cost</th>
                                        <th className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {(activeTab === 'upcoming' ? upcomingBookings : historyBookings).map((booking) => (
                                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{booking.car_name}</td>
                                            <td className="px-6 py-4">
                                                {new Date(booking.pickup_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-700">K{booking.total_price}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                                                    booking.status === 'completed' || booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {(activeTab === 'upcoming' ? upcomingBookings : historyBookings).length === 0 && (
                                <div className="p-10 text-center text-gray-400 text-sm">No records found for this section.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}