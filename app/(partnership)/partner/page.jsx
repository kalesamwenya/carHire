'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaCar, FaWallet, FaChartLine, FaArrowUp, FaPlus, FaSpinner, FaLock } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

export default function PartnerDashboard() {
    const { data: session, status } = useSession();

    // Mock Data for Dashboard
    const stats = {
        totalEarnings: 12500,
        activeRentals: 3,
        totalVehicles: 8,
        monthlyGrowth: 12
    };

    // --- Auth & Role Check ---
    const isAuthorized = session?.user?.role?.toLowerCase() === 'partner';

    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <FaSpinner className="animate-spin text-green-600 text-4xl mb-4" />
                <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">Loading Partner Portal...</p>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <div className="p-20 text-center bg-white rounded-2xl border-2 border-dashed border-gray-100">
                <p className="font-black uppercase text-gray-400 tracking-widest">Please sign in to access partner tools</p>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
                    <FaLock size={24} />
                </div>
                <h2 className="text-xl font-black text-gray-900 uppercase">Access Denied</h2>
                <p className="text-gray-500 text-sm mt-2">This dashboard is strictly for Partner accounts.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Partner Overview</h1>
                    <p className="text-gray-500 font-medium">Logistics for <span className="text-gray-900 font-bold">{session.user.name}</span></p>
                </div>
                <Link
                    href="/partner/add-car"
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
                >
                    <FaPlus /> List New Car
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Earnings</p>
                            <h3 className="text-3xl font-black text-gray-900 mt-1">K{stats.totalEarnings.toLocaleString()}</h3>
                        </div>
                        <div className="p-4 bg-green-500 rounded-2xl text-white shadow-md">
                            <FaWallet size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-[11px] font-bold text-green-600 uppercase">
                        <FaArrowUp className="mr-1" />
                        <span>{stats.monthlyGrowth}% Growth</span>
                        <span className="text-gray-300 ml-2">vs last month</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Rentals</p>
                            <h3 className="text-3xl font-black text-gray-900 mt-1">{stats.activeRentals}</h3>
                        </div>
                        <div className="p-4 bg-blue-500 rounded-2xl text-white shadow-md">
                            <FaChartLine size={20} />
                        </div>
                    </div>
                    <div className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Live Fleet Utility
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Vehicles</p>
                            <h3 className="text-3xl font-black text-gray-900 mt-1">{stats.totalVehicles}</h3>
                        </div>
                        <div className="p-4 bg-purple-500 rounded-2xl text-white shadow-md">
                            <FaCar size={20} />
                        </div>
                    </div>
                    <div className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Total Assets Listed
                    </div>
                </div>
            </div>

            {/* Quick Actions / Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
                    <h3 className="font-black text-gray-900 uppercase tracking-tight mb-6">Recent Bookings</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-2xl border border-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 border border-gray-100">
                                        <FaCar />
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 text-sm">Toyota RAV4</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Oct 12 - Oct 15</p>
                                    </div>
                                </div>
                                <span className="text-sm font-black text-green-600">+ K1,800</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 text-[11px] text-center text-gray-400 hover:text-gray-900 font-black uppercase tracking-widest transition-colors">
                        View All Reservations
                    </button>
                </div>

                <div className="bg-gray-900 rounded-[2.5rem] shadow-xl p-8 text-white relative overflow-hidden group">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <h3 className="font-black text-2xl tracking-tight mb-2 italic">Scale Your Fleet</h3>
                            <p className="text-gray-400 text-sm mb-8 max-w-xs font-medium">
                                Add more vehicles to your profile to maximize your earning potential in the Lusaka market.
                            </p>
                        </div>
                        <Link href="/partner/add-car" className="inline-block bg-white text-gray-900 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all duration-300 w-fit shadow-lg">
                            Add Vehicle Now
                        </Link>
                    </div>
                    {/* Decorative Elements */}
                    <FaCar className="absolute -bottom-10 -right-10 text-white/5 text-[180px] -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                </div>
            </div>
        </div>
    );
}