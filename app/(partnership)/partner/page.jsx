'use client';

import Link from 'next/link';
import axios from 'axios';
import { useSession } from 'next-auth/react';

import {
    FaCar,
    FaWallet,
    FaChartLine,
    FaArrowUp,
    FaPlus,
    FaSpinner
} from 'react-icons/fa';

import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

const BASE_API =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://api.citydrivehire.com";

export default function PartnerDashboard() {

    const { data: session } = useSession();

    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        totalEarnings: 0,
        activeRentals: 0,
        totalVehicles: 0,
        monthlyGrowth: 0
    });

    const [recentBookings, setRecentBookings] = useState([]);

    // ============================================
    // FETCH PARTNER DASHBOARD DATA
    // ============================================
    async function getPartnerDashboardData() {

        try {

            if (!session?.user?.id) return;

            setLoading(true);

            const response = await axios.get(
                `${BASE_API}/admin/get-partner-records.php?partner_id=${session.user.id}`,
                {
                    timeout: 5000,
                    headers: {
                        Authorization: `Bearer ${session?.user?.accessToken || ''}`
                    }
                }
            );

            console.log("PARTNER DASHBOARD:", response.data);

            /**
             * API RESPONSE
             * {
             *   success: true,
             *   stats: {...},
             *   data: [...]
             * }
             */

            const statsData = response.data?.stats || {};
            const bookingsData = response.data?.data || [];

            setStats({
                totalEarnings: Number(statsData.total_earnings || 0),
                activeRentals: Number(statsData.active_rentals || 0),
                totalVehicles: Number(statsData.total_vehicles || 0),
                monthlyGrowth: 12
            });

            setRecentBookings(bookingsData);

        } catch (e) {

            console.error(
                "Partner Dashboard Fetch Error:",
                e.message
            );

        } finally {

            setLoading(false);
        }
    }

    useEffect(() => {

        if (session?.user?.id) {
            getPartnerDashboardData();
        }

    }, [session]);

    return (
        <div className="space-y-8 animate-fade-in">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

                <div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Partner Overview
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Monitor your fleet performance and earnings.
                    </p>

                </div>

                <Link
                    href="/partner/add-car"
                    className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm"
                >
                    <FaPlus />
                    List New Car
                </Link>

            </div>

            {/* LOADING */}
            {loading ? (

                <div className="bg-white border border-gray-200 rounded-2xl p-16 flex items-center justify-center">

                    <div className="flex items-center gap-3 text-gray-500">

                        <FaSpinner className="animate-spin" />

                        Loading dashboard...

                    </div>

                </div>

            ) : (

                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                        {/* Earnings */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">

                            <div className="flex justify-between items-start">

                                <div>

                                    <p className="text-sm font-medium text-gray-500">
                                        Total Earnings
                                    </p>

                                    <h3 className="text-3xl font-bold text-gray-900 mt-2">
                                        ZMW {stats.totalEarnings.toLocaleString()}
                                    </h3>

                                </div>

                                <div className="p-3 bg-green-50 rounded-lg text-green-600">
                                    <FaWallet size={24} />
                                </div>

                            </div>

                            <div className="mt-4 flex items-center text-sm text-green-600">

                                <FaArrowUp className="mr-1" />

                                <span className="font-medium">
                                    {stats.monthlyGrowth}%
                                </span>

                                <span className="text-gray-400 ml-2">
                                    vs last month
                                </span>

                            </div>

                        </div>

                        {/* Active Rentals */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">

                            <div className="flex justify-between items-start">

                                <div>

                                    <p className="text-sm font-medium text-gray-500">
                                        Active Rentals
                                    </p>

                                    <h3 className="text-3xl font-bold text-gray-900 mt-2">
                                        {stats.activeRentals}
                                    </h3>

                                </div>

                                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                    <FaChartLine size={24} />
                                </div>

                            </div>

                            <div className="mt-4 text-sm text-gray-400">
                                Currently on the road
                            </div>

                        </div>

                        {/* Vehicles */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">

                            <div className="flex justify-between items-start">

                                <div>

                                    <p className="text-sm font-medium text-gray-500">
                                        Total Vehicles
                                    </p>

                                    <h3 className="text-3xl font-bold text-gray-900 mt-2">
                                        {stats.totalVehicles}
                                    </h3>

                                </div>

                                <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                                    <FaCar size={24} />
                                </div>

                            </div>

                            <div className="mt-4 text-sm text-gray-400">
                                Listed on platform
                            </div>

                        </div>

                    </div>

                    {/* Recent Bookings */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* RECENT BOOKINGS */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

                            <div className="flex items-center justify-between mb-4">

                                <h3 className="font-bold text-gray-900">
                                    Recent Bookings
                                </h3>

                                <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-semibold">
                                    {recentBookings.length} Records
                                </span>

                            </div>

                            <div className="space-y-4">

                                {recentBookings.length === 0 ? (

                                    <div className="text-sm text-gray-400 py-10 text-center">
                                        No bookings yet
                                    </div>

                                ) : (

                                    recentBookings.slice(0, 5).map((booking) => (

                                        <div
                                            key={booking.internal_id}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                                        >

                                            <div className="flex items-center gap-3">

                                                <div className="w-12 h-12 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center text-gray-400">

                                                    {booking.featured_image ? (

                                                        <img
                                                            src={`${BASE_API}${booking.featured_image}`}
                                                            alt={booking.vehicle_name}
                                                            className="w-full h-full object-cover"
                                                        />

                                                    ) : (

                                                        <FaCar />

                                                    )}

                                                </div>

                                                <div>

                                                    <p className="font-semibold text-gray-900 text-sm">
                                                        {booking.vehicle_name}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {booking.pickup_display} - {booking.return_display}
                                                    </p>

                                                    <p className="text-[11px] text-gray-400 mt-1">
                                                        {booking.customer_name}
                                                    </p>

                                                    <p className="text-[11px] text-gray-400">
                                                        #{booking.booking_id}
                                                    </p>

                                                </div>

                                            </div>

                                            <div className="text-right">

                                                <span className="text-sm font-bold text-green-600">
                                                    + ZMW {Number(
                                                        booking.amount_paid || 0
                                                    ).toLocaleString()}
                                                </span>

                                                <p className="text-[11px] text-gray-400 mt-1 capitalize">
                                                    {booking.booking_status}
                                                </p>

                                                <p className={`text-[10px] mt-1 font-semibold ${
                                                    booking.payment_status === 'paid'
                                                        ? 'text-green-600'
                                                        : 'text-orange-500'
                                                }`}>
                                                    {booking.payment_status}
                                                </p>

                                            </div>

                                        </div>

                                    ))
                                )}

                            </div>

                            <Link
                                href="/partner/bookings"
                                className="block w-full mt-5 text-sm text-center text-gray-500 hover:text-green-700 font-medium"
                            >
                                View All Reservations
                            </Link>

                        </div>

                        {/* PROMO CARD */}
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-sm p-6 text-white relative overflow-hidden">

                            <div className="relative z-10">

                                <h3 className="font-bold text-xl mb-2">
                                    Grow your business
                                </h3>

                                <p className="text-gray-300 text-sm mb-6 max-w-xs">
                                    Add more vehicles to your fleet to increase your monthly earnings potential.
                                </p>

                                <Link
                                    href="/partner/add-car"
                                    className="inline-block bg-white text-gray-900 px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors"
                                >
                                    Add Vehicle Now
                                </Link>

                            </div>

                            {/* Decorative Circle */}
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

                        </div>

                    </div>
                </>
            )}

        </div>
    );
}