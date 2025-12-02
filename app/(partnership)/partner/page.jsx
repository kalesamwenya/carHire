import Link from 'next/link';
import { FaCar, FaWallet, FaChartLine, FaArrowUp, FaPlus } from 'react-icons/fa';

export const dynamic = 'force-dynamic';

export default function PartnerDashboard() {
    // Mock Data for Dashboard
    const stats = {
        totalEarnings: 12500,
        activeRentals: 3,
        totalVehicles: 8,
        monthlyGrowth: 12
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Partner Overview</h1>
                    <p className="text-gray-500 mt-1">Monitor your fleet performance and earnings.</p>
                </div>
                <Link
                    href="/partner/add-car"
                    className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-sm"
                >
                    <FaPlus /> List New Car
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">ZMW {stats.totalEarnings.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg text-green-600">
                            <FaWallet size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-green-600">
                        <FaArrowUp className="mr-1" />
                        <span className="font-medium">{stats.monthlyGrowth}%</span>
                        <span className="text-gray-400 ml-2">vs last month</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Rentals</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.activeRentals}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                            <FaChartLine size={24} />
                        </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-400">
                        Currently on the road
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Vehicles</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalVehicles}</h3>
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

            {/* Quick Actions / Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Recent Bookings</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                                        <FaCar />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">Toyota RAV4</p>
                                        <p className="text-xs text-gray-500">Oct 12 - Oct 15</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-green-600">+ ZMW 1,800</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 text-sm text-center text-gray-500 hover:text-green-700 font-medium">
                        View All Reservations
                    </button>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-sm p-6 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold text-xl mb-2">Grow your business</h3>
                        <p className="text-gray-300 text-sm mb-6 max-w-xs">
                            Add more vehicles to your fleet to increase your monthly earnings potential.
                        </p>
                        <Link href="/partner/add-car" className="inline-block bg-white text-gray-900 px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">
                            Add Vehicle Now
                        </Link>
                    </div>
                    {/* Decorative Circle */}
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                </div>
            </div>
        </div>
    );
}